import prisma from "@/utils/db";

// This API handler was made with the assistance of ChatGPT.

export default async function handler(req, res) {
  // Check the HTTP method
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { query, tag, template, page = 1, pageSize = 10 } = req.query;
  const sortBy = req.query.sortBy === 'asc' ? 'asc' : 'desc';

  try {
    // Build the initial where clause for filtering by tags and templates
    let whereClause = {
      isHidden: false,
      AND: [],
    };

    // Initialize an array to hold the IDs of posts associated with the given tag or template
    let postIds = [];

    // Filter by tag if provided
    if (tag) {
      const tagPosts = await prisma.tag.findUnique({
        where: { name: tag },
        include: { blogPosts: true }, // Fetch associated blog posts
      });
      if (tagPosts) {
        postIds = postIds.concat(tagPosts.blogPosts.map(post => post.id));
      }
    }

    // Filter by template if provided
    if (template) {
      const templatePosts = await prisma.codeTemplate.findUnique({
        where: { title: template },
        include: { blogPost: true }, // Fetch associated blog posts
      });
      if (templatePosts) {
        postIds = postIds.concat(templatePosts.blogPost.map(post => post.id));
      }
    }

    // Filter by post IDs (only include posts associated with the specified tag or template)
    if (postIds.length > 0) {
      whereClause.AND.push({
        id: { in: postIds },
      });
    }

    // Add title and content filtering if a query is provided
    if (query) {
      whereClause.AND.push({
        OR: [
          { title: { contains: query } },
          { content: { contains: query } },
        ],
      });
    }

    // Fetch posts with filters, sorting, and pagination
    const posts = await prisma.blogPost.findMany({
      where: whereClause,
      orderBy: {
        rating: sortBy, // Sort by rating, descending by default
      },
      include: {
        tags: true,
        templates: true,
        author: true,
      },
      skip: (page - 1) * pageSize, // Calculate offset for pagination
      take: parseInt(pageSize), // Limit the number of results
    });

    // Count total posts for pagination metadata
    const totalPosts = await prisma.blogPost.count({ where: whereClause });

    return res.status(200).json({
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
