// This file was created with the assistance of GPT-4

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;

export async function getUserIdByUsername(username) {
    const user = await prisma.user.findUnique({
        where: {
            username: username,
        },
        select: {
            user_id: true,
        },
    });
    console.log("here:", user.user_id);

    if (!user) {
        return null;
    }

    return user.user_id;
}


export async function updateUserProfile(user_id, updateData) {
    try {
        // Check if the new username already exists
        if (updateData.username) {
            const existingUser = await prisma.user.findUnique({
                where: {
                    username: updateData.username,
                },
            });
            if (existingUser && existingUser.user_id !== user_id) {
                throw new Error("Username already exists");
            }
        }

        // Check if the new email already exists
        if (updateData.email) {
            const existingUser = await prisma.user.findUnique({
                where: {
                    email: updateData.email,
                },
            });
            if (existingUser && existingUser.user_id !== user_id) {
                throw new Error("Email already exists");
            }
        }
        
        const updatedUser = await prisma.user.update({
            where: { user_id: user_id },
            data: updateData,
        });
        return updatedUser;
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
    }
}