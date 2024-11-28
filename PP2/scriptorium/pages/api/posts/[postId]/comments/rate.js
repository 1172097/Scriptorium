import prisma from "@/utils/db";
import { verifyUser } from "@/utils/middleware";

// This API handler was made with the assistance of ChatGPT.
async function handler(req, res) {
  const { method } = req;
  const { postId } = req.query;
  const { ratingValue, commentId } = req.body;
  const userId = req.user.user_id;

  try {
    if (method === 'POST') {
      if (ratingValue === 0) {
        try {
          const ratings = await prisma.rating.findMany({
            where: {
              ownerId: userId,
              postId: commentId ? null : Number(postId),
              commentId: commentId ? Number(commentId) : null,
            },
          });
          if (ratings.length == 0) {
            return res.status(404).json({ error: 'Rating not found' });
          }
  
          const rating = await prisma.rating.delete({
            where: {
              [commentId ? 'ownerId_commentId' : 'ownerId_postId']: {
                ownerId: userId,
                ...(commentId ? { commentId: Number(commentId) } : { postId: Number(postId) }),
              },
            },
          });
          console.log(rating);
          // Decrement the corresponding post or comment rating
          const decrementData = { rating: { decrement: rating.value } };
          if (commentId) {
            await prisma.comment.update({
              where: { id: Number(commentId) },
              data: decrementData,
            });
          } else {
            await prisma.blogPost.update({
              where: { id: Number(postId) },
              data: decrementData,
            });
          }
          return res.status(200).json({ message: 'Rating deleted successfully' });
        } catch (error) {
          if (error.code === 'P2025') { // Record not found
            return res.status(404).json({ error: 'Rating not found' });
          }
          throw error; // Re-throw other unexpected errors
        }
      }
      // Validate rating value
      if (![1, -1].includes(ratingValue)) {
        return res.status(400).json({ error: 'Rating value must be +1 or -1' });
      }

      // Check if rating already exists to prevent duplicate ratings
      const existingRating = await prisma.rating.findUnique({
        where: commentId
          ? { ownerId_commentId: { ownerId: userId, commentId: Number(commentId) } }
          : { ownerId_postId: { ownerId: userId, postId: Number(postId) } }
      });

      if (existingRating) {
        return res.status(200).json({ message: 'Rating already exists' });
      }

      // Creating a new rating
      const rating = await prisma.rating.create({
        data: {
          value: ratingValue,
          ownerId: userId,
          postId: commentId ? null : Number(postId),
          commentId: commentId ? Number(commentId) : null,
        },
      });

      // Update the corresponding post or comment rating
      const updateData = { rating: { increment: ratingValue } };
      if (commentId) {
        await prisma.comment.update({
          where: { id: Number(commentId) },
          data: updateData,
        });
      } else {
        await prisma.blogPost.update({
          where: { id: Number(postId) },
          data: updateData,
        });
      }
      return res.status(201).json({ message: 'Rating created successfully', rating });

    } else {
      res.setHeader('Allow', ['POST']);
      return res.status(405).json({ message: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error("Error handling rating:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export default verifyUser(handler);
