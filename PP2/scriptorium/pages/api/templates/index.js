// This file was created with the assistance of GPT-4

import prisma from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {
      query,           // Search term for title and content
      tags,            // Comma-separated list of tag names
      page = 1,        // Current page number
      limit = 10,      // Items per page
      sortBy = 'title', // Sort field
      order = 'asc'    // Can be 'asc' or 'desc'
    } = req.query;

    // Convert page and limit to numbers
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build the where clause for search conditions
    const whereClause = {
      AND: []
    };

    // Add title and content search if query parameter exists
    if (query) {
      whereClause.AND.push({
        OR: [
          {
            title: {
              contains: query
            }
          },
          {
            content: {
              contains: query
            }
          }
        ]
      });
    }

    // Add tags search if tags parameter exists
    if (tags) {
      const tagIds = tags.split(',')
        .filter(id => id.trim())  // Remove any empty strings
        .map(Number);
      whereClause.AND.push({
        tags: {
          some: {
            id: {
              in: tagIds
            }
          }
        }
      });
    }

    // If no search conditions, remove the AND array
    if (whereClause.AND.length === 0) {
      delete whereClause.AND;
    }

    // Execute the search query
    const [templates, totalCount] = await Promise.all([
      prisma.codeTemplate.findMany({
        where: whereClause,
        include: {
          author: {
            select: {
              username: true,
              profile_picture: true
            }
          },
          tags: {
            select: {
              name: true
            }
          }
        },
        orderBy: {
          [sortBy]: order.toLowerCase() === 'desc' ? 'desc' : 'asc'
        },
        skip,
        take: limitNum
      }),
      prisma.codeTemplate.count({
        where: whereClause
      })
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limitNum);
    const hasMore = pageNum < totalPages;
    const hasLess = pageNum > 1;

    // Return the response
    return res.status(200).json({
      templates,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems: totalCount,
        itemsPerPage: limitNum,
        hasMore,
        hasLess
      }
    });

  } catch (error) {
    console.error('Template search error:', error);
    return res.status(500).json({
      message: 'Error searching templates',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}