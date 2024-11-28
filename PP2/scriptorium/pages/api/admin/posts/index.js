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
    // Fetch posts sorted by report count with pagination
    const posts = await prisma.blogPost.findMany({
      where: { isHidden: false },
      orderBy: {
        numReports: 'desc', // Sort by report count in descending order
      },
      include: {
        reports: true,
        ratings: true,
        author: { select: { username: true }},
      },
      skip: (page - 1) * pageSize, // Calculate offset for pagination
      take: parseInt(pageSize), // Limit the number of results
    });

    // Count total posts for pagination metadata
    const totalPosts = await prisma.blogPost.count({
      where: { isHidden: false }, // Count only non-hidden posts
    });

    res.status(200).json({
      posts,
      pagination: {
        totalPosts,
        currentPage: parseInt(page),
        pageSize: parseInt(pageSize),
        totalPages: Math.ceil(totalPosts / pageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    res.status(500).json({ error: 'Error fetching blog posts' });
  }
}

export default verifyAdmin(handler);
