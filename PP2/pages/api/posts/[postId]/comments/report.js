import prisma from "@/utils/db";
import { verifyUser } from "@/utils/middleware";

// This API handler was made with the assistance of ChatGPT.
async function handler(req, res) {
  const { method } = req;
  const postId = Number(req.query.postId);
  const userId = req.user.user_id;

  if (method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${method} Not Allowed` });
  }
  try {
    // Retrieve the reason for the report and optional commentId from the request body
    const { reason, commentId } = req.body;

    if (!reason) {
      return res.status(400).json({ error: 'Report reason is required.' });
    }
    const existingReport = await prisma.report.findMany({
      where: {
        ownerId: userId,
        postId: commentId ? null : Number(postId),
        commentId: commentId ? Number(commentId) : null,
      },
    });

    const existingPost = await prisma.blogPost.findUnique({
      where: { id: Number(postId) },
    });
    if (!existingPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (existingReport.length > 0) {
      return res.status(201).json({
        message: 'You have already reported this post or comment.',
        report: existingReport[0],
      });
    }


    // Create the report entry based on the presence of commentId, explicitly setting the other field to null
    const reportEntry = await prisma.report.create({
      data: {
        reason,
        ownerId: userId,
        postId: commentId ? null : Number(postId),
        commentId: commentId ? Number(commentId) : null,
      },
    });

    if (commentId) {
      // Increment the report count for the comment
      await prisma.comment.update({
        where: { id: Number(commentId) },
        data: { numReports: { increment: 1 } },
      });
    } else {
      // Increment the report count for the post
      await prisma.blogPost.update({
        where: { id: Number(postId) },
        data: { numReports: { increment: 1 } },
      });
    }

    return res.status(201).json({
      message: 'Report submitted successfully.',
      report: reportEntry,
    });
  } catch (error) {
    console.error("Error submitting report:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export default verifyUser(handler);
