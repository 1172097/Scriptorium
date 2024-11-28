// This file was created with the assistance of GPT-4

import prisma from "@/utils/db";
import { verifyUser } from "@/utils/middleware";

async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }

  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  try {
    const template = await prisma.codeTemplate.findUnique({
      where: { id: parsedId },
      select: {
        id: true,
        title: true,
        description: true,
        content: true,
        language: true,
        tags: true,
        author: true
      }
    });

    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }

    res.status(200).json(template);
  } catch (error) {
    console.error("Error fetching template:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default handler;