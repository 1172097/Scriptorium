import prisma from "@/utils/db";

// This API handler was made with the assistance of ChatGPT.

export default async function handler(req, res) {
  const { method } = req;
  const postId = Number(req.query.postId);
  const sortBy = req.query.sortBy === 'asc' ? 'asc' : 'desc'; // Default to 'desc' if sortBy is invalid

  try {
    // Handle GET request to fetch comments for a specific post or as replies to a specific comment
    if (method === 'GET') {
      if (!postId) {
        return res.status(400).json({ error: 'postId is required.' });
      }

      const post = await prisma.blogPost.findUnique({ where: { id: postId } });
      if (!post) {
        return res.status(404).json({ error: 'Post not found.' });
      }

      // Fetch top-level comments for the post
      const comments = await prisma.comment.findMany({
        where: { postId, isHidden: false, },
        orderBy: { rating: sortBy },
        include: { author: true },
      });

      return res.status(200).json(comments); // Return the fetched comments
    }
    // If method is not supported
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: `Method ${method} Not Allowed` });
  } catch (error) {
    console.error("Error handling comments:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
