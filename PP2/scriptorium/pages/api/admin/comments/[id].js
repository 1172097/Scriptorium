import prisma from "@/utils/db";
import { verifyAdmin } from "../../../../utils/middleware";

// This API handler was made with the assistance of ChatGPT.

async function handler(req, res) {
  const { method } = req;
  const commentId = Number(req.query.id); // Get commentId from the query

  if (method === 'PATCH') {
    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (!existingComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    try {
      // Update the isHidden status of the comment to true
      const updatedComment = await prisma.comment.update({
        where: { id: commentId },
        data: { isHidden: true },
      });

      return res.status(200).json({message: "Success", updatedComment}); // Return the updated comment
    } catch (error) {
      console.error("Error updating comment:", error);
      return res.status(500).json({ error: 'Error updating comment' });
    }
  }

  // Handle method not allowed
  res.setHeader('Allow', ['PATCH']);
  return res.status(405).json({ message: `Method ${method} Not Allowed` });
}

export default verifyAdmin(handler);