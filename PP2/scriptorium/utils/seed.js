const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

// Get the salt rounds from environment variable or default to 10
const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;

async function hashPassword(password) {
  return await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
}


const seedDatabase = async () => {
  try {
    console.log("Seeding database with sample data...");

    // Create users
    const users = await Promise.all(
      Array.from({ length: 10 }).map(async (_, i) => {
        const hashedPassword = await hashPassword(`password${i + 1}`);
        return prisma.user.create({
          data: {
            username: `user${i + 1}`,
            email: `user${i + 1}@example.com`,
            password: hashedPassword, // Save hashed password
            first_name: `First${i + 1}`,
            last_name: `Last${i + 1}`,
            profile_picture: `/incognito.png`,
            phone: `123-456-78${i}`,
          },
        });
      })
    );

    // Create tags
    const tags = await Promise.all(
      ["JavaScript", "Python", "React", "Node.js", "Django", "CSS", "HTML", "TypeScript", "GraphQL"].map((tag) =>
        prisma.tag.create({
          data: {
            name: tag,
          },
        })
      )
    );

    // Create code templates
    const templates = await Promise.all(
      Array.from({ length: 30 }).map((_, i) =>
        prisma.codeTemplate.create({
          data: {
            title: `Template ${i + 1}`,
            description: `This is a description for template ${i + 1}.`,
            content: `Code content for template ${i + 1}`,
            language: ["JavaScript", "Python", "TypeScript"][i % 3],
            authorId: users[i % users.length].user_id,
            tags: {
              connect: tags.slice(i % 3, (i % 3) + 3).map((tag) => ({ id: tag.id })),
            },
          },
        })
      )
    );

    // Create blog posts
    const blogPosts = await Promise.all(
      Array.from({ length: 30 }).map((_, i) =>
        prisma.blogPost.create({
          data: {
            title: `Blog Post ${i + 1}`,
            content: `This is the content for blog post ${i + 1}.`,
            rating: Math.floor(Math.random() * 100), // Random rating
            authorId: users[i % users.length].user_id,
            tags: {
              connect: tags.slice(i % 4, (i % 4) + 3).map((tag) => ({ id: tag.id })),
            },
            templates: {
              connect: templates.slice(i % 5, (i % 5) + 3).map((template) => ({ id: template.id })),
            },
          },
        })
      )
    );

    // Create comments
    const comments = await Promise.all(
      Array.from({ length: 50 }).map((_, i) =>
        prisma.comment.create({
          data: {
            content: `This is a comment ${i + 1}`,
            rating: Math.floor(Math.random() * 50), // Random comment rating
            authorId: users[i % users.length].user_id,
            postId: blogPosts[i % blogPosts.length].id,
          },
        })
      )
    );

    console.log("Seeding complete!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
};

seedDatabase();
