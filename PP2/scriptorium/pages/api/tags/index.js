import prisma from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { page = 1, pageSize = 10, search = '' } = req.query;

    try {
      // Search and sort tags by name with pagination
      const tags = await prisma.tag.findMany({
        where: { name: { contains: search } },
        orderBy: {
          name: 'asc' // Always sort by name in ascending order
        },
        skip: (page - 1) * pageSize, // Offset for pagination
        take: parseInt(pageSize), // Limit the number of results
      });

      // Count total matching tags for pagination metadata
      const totalTags = await prisma.tag.count({
        where: {
          name: {
            contains: search,
          }
        }
      });

      res.status(200).json({
        tags,
        pagination: {
          totalTags,
          currentPage: parseInt(page),
          pageSize: parseInt(pageSize),
          totalPages: Math.ceil(totalTags / pageSize),
        },
      });
    } catch (error) {
      console.error("Error fetching tags:", error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
