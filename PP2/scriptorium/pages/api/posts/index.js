import prisma from "@/utils/db";

// This API handler was made with the assistance of ChatGPT.

export default async function handler(req, res) {
  // Check the HTTP method
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { query, tags = [], templates = [], page = 1, pageSize = 10 } = req.query;
  const sortBy = req.query.sortBy === 'asc' ? 'asc' : 'desc';

  try {
    // Parse tags and templates into arrays of integers
    const tagIds = Array.isArray(tags) 
      ? tags.map(id => parseInt(id, 10)).filter(Number.isInteger) 
      : tags.split(',').map(id => parseInt(id, 10)).filter(Number.isInteger);

    const templateIds = Array.isArray(templates) 
      ? templates.map(id => parseInt(id, 10)).filter(Number.isInteger) 
      : templates.split(',').map(id => parseInt(id, 10)).filter(Number.isInteger);

    // Build the where clause
    let whereClause = {
      isHidden: false,
      AND: [],
    };

    // Ensure the post matches the query in title or content
    if (query) {
      whereClause.AND.push({
        OR: [
          { title: { contains: query } },
          { content: { contains: query } },
        ],
      });
    }

    // Ensure the post matches at least one tag or template
    if (tagIds.length > 0 || templateIds.length > 0) {
      whereClause.AND.push({
        OR: [
          tagIds.length > 0 ? { tags: { some: { id: { in: tagIds } } } } : undefined,
          templateIds.length > 0
            ? { templates: { some: { id: { in: templateIds } } } }
            : undefined,
        ].filter(Boolean), // Remove undefined conditions
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
        templates: {
          select: { 
            title: true, // Only include the template's title
          },
        },
        author: {
          select: {
            username: true, // Only include the author's name
          },
        },
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
