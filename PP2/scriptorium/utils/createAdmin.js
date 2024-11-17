const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

// Initialize Prisma Client
const prisma = new PrismaClient();

// Get the salt rounds from environment variable or default to 10
const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;

// Function to hash the password
async function hashPassword(password) {
    return await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
}

// Create admin function
async function createAdmin() {
    // Define the admin user's details
    const adminUser = {
        username: 'admin',
        email: 'admin@example.com', // Set a unique email
        first_name: 'Jane',
        last_name: 'Doe',
        role: 'ADMIN', // Set the role to ADMIN
    };

    // Hash the password before storing it
    const hashedPassword = await hashPassword('password123'); // Use a strong password in production

    // Create the admin user in the database
    try {
        const createdAdmin = await prisma.user.create({
            data: {
                ...adminUser,
                password: hashedPassword, // Store the hashed password
            },
        });
        console.log(`Admin user created: ${createdAdmin.username}`);
    } catch (error) {
        console.error('Error creating admin user:', error);
    }
}

// Run the createAdmin function
createAdmin()
    .catch(e => {
        console.error('Error running createAdmin:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
