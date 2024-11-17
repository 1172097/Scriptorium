import prisma from "@/utils/db";
import { verifyUser } from "@/utils/middleware";

async function handler(req, res) {
  if (req.method === 'POST') {
    const { name } = req.body;

    // Validate request body
    if (!name) {
      return res.status(400).json({ error: 'Tag name is required.' });
    }

    try {
      // Check if the tag already exists
      const existingTag = await prisma.tag.findUnique({
        where: { name: name.trim() },
      });

      // If the tag exists, return the existing tag
      if (existingTag) {
        return res.status(200).json(existingTag); // Return existing tag
      }

      // Create a new tag
      const newTag = await prisma.tag.create({
        data: {
          name: name.trim(), // Remove leading/trailing whitespace
        },
      });

      return res.status(201).json(newTag); // Return created tag
    } catch (error) {
      console.error("Error creating tag:", error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}

export default verifyUser(handler);
