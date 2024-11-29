import prisma from "@/utils/db";
import { verifyAdmin } from "@/utils/middleware";

// This API handler was made with the assistance of ChatGPT.

async function handler(req, res) {
  // Check the HTTP method
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { page = 1, pageSize = 6 } = req.query;

  try {
    // Fetch comments sorted by report count with pagination
    const comments = await prisma.comment.findMany({
      where: { isHidden: false },
      orderBy: {
        numReports: 'desc', // Sort by report count in descending order
      },
      include: {
        reports: true,
        author: { select: { username: true }},
      },
      skip: (page - 1) * pageSize, // Calculate offset for pagination
      take: parseInt(pageSize), // Limit the number of results
    });

    // Count total comments for pagination metadata
    const totalComments = await prisma.comment.count({
      where: { isHidden: false }, // Count only non-hidden comments
    });

    res.status(200).json({
      comments,
      pagination: {
        totalComments,
        currentPage: parseInt(page),
        pageSize: parseInt(pageSize),
        totalPages: Math.ceil(totalComments / pageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: 'Error fetching comments' });
  }
}

export default verifyAdmin(handler);