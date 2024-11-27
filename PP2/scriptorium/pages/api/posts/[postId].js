import prisma from "@/utils/db";
import { attachUser } from "@/utils/middleware";

// This API handler was made with the assistance of ChatGPT.

async function handler(req, res) {
  const { method } = req;
  const { postId } = req.query; // Extract the ID from the query parameters
  const userId = req.user ? req.user.id : null; // Extract the user ID from the request
  

  try {
    // Handle GET request to fetch a specific blog post by ID
    if (method === 'GET') {
        
        const post = await prisma.blogPost.findUnique({
        where: { id: Number(postId) }, // Ensure id is a number
        include: {
          tags: true,
          templates: {
            select: { 
              id: true,
              title: true // Only include the template's title
            },
          },
          author: {
            select: {
              profile_picture: true,
              username: true, // Only include the author's name
            },
          },
          comments: {
            include: {
              author: {
                select: {
                  profile_picture: true,
                  username: true, // Only include the author's name
                },
              },
            }
          }
        },
      });

      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      
      let userRating = null;
      if (userId) {
        userRating = post.ratings.find(rating => rating.ownerId === userId);
      }

      return res.status(200).json({ post, userRating });
    }

    // Handle PUT request to update a specific blog post
    if (method === 'PUT') {
        const { title, content, tagIds, templateIds} = req.body;
        const postId = Number(req.query.postId);

        const post = await prisma.blogPost.findUnique({
          where: { id: Number(postId) }, // Ensure id is a number
        });
        if (!post) {
          return res.status(404).json({ error: 'Post not found' });
        }

      // Validate input
      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required.' });
      }

      const updatedPost = await prisma.blogPost.update({
        where: { id: postId },
        data: {
          title,
          content,
          tags: {
            set: tagIds?.map(id => ({ id: Number(id) })), // Connect existing tags by ID
          },
          templates: {
            set: templateIds?.map(id => ({ id: Number(id) })), // Connect existing templates by ID
          },
        },
      });

      return res.status(200).json(updatedPost);
    }

    // Handle DELETE request to remove a specific blog post
    if (method === 'DELETE') {

      const post = await prisma.blogPost.findUnique({
        where: { id: Number(postId) }, // Ensure id is a number
      });
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      await prisma.blogPost.delete({
        where: { id: Number(postId) },
      });

      return res.status(200).json({ message: "Post deleted" });
    }

    // If method is not supported
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return res.status(405).json({ message: `Method ${method} Not Allowed` });
  } catch (error) {
    console.error("Error handling post:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export default attachUser(handler);
