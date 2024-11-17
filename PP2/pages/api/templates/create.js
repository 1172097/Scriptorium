// This file was created with the assistance of GPT-4

import prisma from "@/utils/db";
import { verifyUser } from "@/utils/middleware";

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let { 
    isForked,
    title,
    description,
    content,
    language,
    originTemplateId,
    tags,
  } = req.body;
  const authorId = req.user.user_id;

  console.log("Received request body:", req.body);
  console.log("authorId:", authorId);

  try {
    // Verify the author exists
    // Validate required fields
    if (isForked) {
      console.log("isForked is true");
      if (!originTemplateId) {
        return res.status(400).json({
          message: "Please provide the originTemplateId when forking a template",
        });
      }

      console.log("originTemplateId:", originTemplateId);

      const originTemplate = await prisma.codeTemplate.findUnique({
        where: { id: originTemplateId }
      });

      if (!originTemplate) {
        return res.status(400).json({
          message: "Invalid originTemplateId - template does not exist",
        });
      }

      if (!authorId) {
        return res.status(400).json({
          message: "Please provide the authorId when forking a template",
        });
      }

      // Copy fields from the origin template
      title = title || originTemplate.title;
      description = description || originTemplate.description;
      content = originTemplate.content;
      language = originTemplate.language;
      tags = tags || originTemplate.tags;

    }

    if (!isForked && (!title || !description || !content || !language || !authorId)) {
        return res.status(400).json({
        message: "Please provide all required fields: title, description, content, language, and authorId",
        });
    }

    const authorExists = await prisma.user.findUnique({
      where: { user_id: authorId }
    });

    if (!authorExists) {
      return res.status(400).json({
        message: "Invalid authorId - user does not exist",
      });
    }

    // Create the code template with optional tags
    const codeTemplate = await prisma.codeTemplate.create({
      data: {
        title,
        description,
        content,
        language,
        authorId,
        originTemplateId,
        isForked: !!originTemplateId,
        tags: tags && tags.length > 0 ? {
          connectOrCreate: tags.map(tagName => ({
            where: { name: tagName },
            create: { name: tagName }
          }))
        } : undefined
      },
      include: {
        author: {
          select: {
            username: true,
            profile_picture: true
          }
        },
        tags: true
      }
    });

    res.status(201).json(codeTemplate);
  } catch (error) {
    console.error("Error creating code template:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default verifyUser(handler);
