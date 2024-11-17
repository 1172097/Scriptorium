import prisma from "@/utils/db";
import { verifyUser } from "../../../../../utils/middleware";

// This API handler was made with the assistance of ChatGPT.

async function handler(req, res) {
  const { method } = req;
  const commentId = Number(req.query.commentId); // Extract the comment ID from the query parameters
  const sortBy = req.query.sortBy === 'asc' ? 'asc' : 'desc'; // Default to 'desc' if sortBy is invalid
  const userId = req.user.user_id;

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: {
      author: true,   // Include author details if needed
      ratings: true,  // Include ratings to check if the user has rated
      replies: {
        orderBy: { rating: sortBy },    // Order replies by rating
      },
    },
  });

  if (!comment) {
    return res.status(404).json({ error: 'Comment not found' });
  }
  try {

    // Handle GET request to fetch a specific comment by ID
    if (method === 'GET') {
      if (!commentId) {
        return res.status(400).json({ error: 'Comment ID is invalid.' });
      }

      // Retrieve the user's rating if they are logged in
      let userRating = null;
      if (userId) {
        userRating = comment.ratings.find((rating) => rating.ownerId === userId);
      }

      return res.status(200).json({ comment, userRating });
    }

    // Handle PUT request to update a specific comment
    if (method === 'PUT') {
      if (!commentId) {
        return res.status(400).json({ error: 'Comment ID is invalid.' });
      }
      const { content } = req.body;

      // Validate input
      if (!content) {
        return res.status(400).json({ error: 'Content is required.' });
      }

      const updatedComment = await prisma.comment.update({
        where: { id: commentId },
        data: { content },
      });

      return res.status(200).json(updatedComment); // Respond with the updated comment
    }

    // Handle DELETE request to remove a specific comment
    if (method === 'DELETE') {
      if (!commentId) {
        return res.status(400).json({ error: 'Comment ID is invalid.' });
      }
      await prisma.comment.delete({
        where: { id: Number(commentId) },
      });

      return res.status(200).json({ message: "Comment deleted" });
    }

    // If method is not supported
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return res.status(405).json({ message: `Method ${method} Not Allowed` });
  } catch (error) {
    console.error("Error handling comment:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export default verifyUser(handler);
