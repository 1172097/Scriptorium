import prisma from "@/utils/db";
import { verifyAdmin } from "../../../../utils/middleware";

// This API handler was made with the assistance of ChatGPT.

async function handler(req, res) {
  const { method } = req;
  const postId = Number(req.query.id); // Get postId from the query

  if (method === 'PATCH') {
    const existingPost = await prisma.blogPost.findUnique({
      where: { id: postId },
    });
    if (!existingPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    try {
      // Update the isHidden status of the post to true
      const updatedPost = await prisma.blogPost.update({
        where: { id: postId },
        data: { isHidden: true },
      });

      return res.status(200).json({message: "Success", updatedPost}); // Return the updated post
    } catch (error) {
      console.error("Error updating post:", error);
      return res.status(500).json({ error: 'Error updating post' });
    }
  }

  // Handle method not allowed
  res.setHeader('Allow', ['PATCH']);
  return res.status(405).json({ message: `Method ${method} Not Allowed` });
}

export default verifyAdmin(handler);