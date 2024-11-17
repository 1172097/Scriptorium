import prisma from "@/utils/db";
import { verifyUser } from "@/utils/middleware";

// This API handler was made with the assistance of ChatGPT.

async function handler(req, res) {
  if (req.method === 'POST') {
    const { title, content, tagIds, templateIds } = req.body;
    const authorId = req.user.user_id;

    // Validate input
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required.' });
    }

    try {
      // Create a new blog post
      const newPost = await prisma.blogPost.create({
        data: {
          title,
          content,
          authorId,
          tags: {
            connect: tagIds?.map(id => ({ id: Number(id) })), // Connect existing tags by ID
          },
          templates: {
            connect: templateIds?.map(id => ({ id: Number(id) })), // Connect existing templates by ID
          },
        },
      });

      res.status(201).json(newPost);
    } catch (error) {
      console.error("Error creating blog post:", error);
      res.status(500).json({ error: 'Error creating blog post' });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

export default verifyUser(handler);
