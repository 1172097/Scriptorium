// This file was created with the assistance of GPT-4


import prisma from "@/utils/db";
import { verifyUser } from "@/utils/middleware";

async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "PUT") {
    const { title, description, content, tags, language } = req.body;

    try {
      // Check if the template exists
      const existingTemplate = await prisma.codeTemplate.findUnique({
        where: { id: parseInt(id, 10) },
      });

      if (!existingTemplate) {
        return res.status(404).json({ error: "Code template not found" });
      }

      const data = {};
      if (language !== undefined) data.language = language;
      if (title !== undefined) data.title = title;
      if (description !== undefined) data.description = description;
      if (content !== undefined) data.content = content;
      if (tags !== undefined && tags.length > 0) {
        data.tags = {
          set: [],
          connectOrCreate: tags.map(tagName => ({
            where: { name: tagName },
            create: { name: tagName }
          }))
        };
      }

      const updatedTemplate = await prisma.codeTemplate.update({
        where: { id: parseInt(id, 10) },
        data,
        include: {
          tags: true
        }
      });

      res.status(200).json(updatedTemplate);
    } catch (error) {
      console.error("Error updating code template:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === "DELETE") {
    try {
      // Check if the template exists
      const existingTemplate = await prisma.codeTemplate.findUnique({
        where: { id: parseInt(id, 10) },
      });

      if (!existingTemplate) {
        return res.status(404).json({ error: "Code template not found" });
      }

      await prisma.codeTemplate.delete({
        where: { id: parseInt(id, 10) }
      });

      res.status(204).end();
    } catch (error) {
      console.error("Error deleting code template:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

export default verifyUser(handler);
