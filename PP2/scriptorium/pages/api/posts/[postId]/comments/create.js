import prisma from "@/utils/db";
import { verifyUser } from "@/utils/middleware";

// This API handler was made with the assistance of ChatGPT.

async function handler(req, res) {
  const { method } = req;
  const postId  = Number(req.query.postId);

  try {
    // Handle POST request to create a new comment under a post or as a reply to another comment
    if (method === 'POST') {
      const { content, parentId } = req.body; // Use parentId from req.body
      const userId = req.user.user_id;

      // Validate input
      if (!content) {
        return res.status(400).json({ error: 'Content is required.' });
      }


      const existingPost = await prisma.blogPost.findUnique({
        where: { id: Number(postId) },
      });
      if (!existingPost) {
        return res.status(404).json({ error: 'Post not found' });
      }

      if (parentId) {
        // Check if the parent comment exists
        const existingComment = await prisma.comment.findUnique({
          where: { id: Number(parentId) },
        });
        if (!existingComment) {
          return res.status(404).json({ error: 'Parent comment not found' });
        }
      }

      // Determine the postId to use: use parentId if it's provided, otherwise use the postId from the query
      const targetPostId = parentId ? null : Number(postId);
      const newComment = await prisma.comment.create({
        data: {
          content,
          postId: targetPostId, // Associate with a post if postId is provided and parentId is not
          parentId: parentId ? Number(parentId) : null, // Associate as a reply if parentId is provided
          authorId: userId, // Assuming userId refers to the user creating the comment
        },
      });

      return res.status(201).json(newComment); // Respond with the created comment
    }

    // If method is not supported
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${method} Not Allowed` });
  } catch (error) {
    console.error("Error handling comments:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export default verifyUser(handler);
