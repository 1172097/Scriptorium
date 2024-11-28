// This file was created with the assistance of GPT-4


import { PrismaClient } from '@prisma/client';
import { updateUserProfile } from "../../../utils/db";
import { verifyUser } from '../../../utils/middleware';

const prisma = new PrismaClient();

async function handler(req, res) {
  if (req.method !== 'PUT' && req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  if (req.method === 'GET') {
    const user_id = req.user.user_id;
    if (!user_id) {
      return res.status(400).json({ message: 'User ID not provided' });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { user_id: user_id },
        select: {
          user_id: true,
          username: true,
          email: true,
          first_name: true,
          last_name: true,
          profile_picture: true,
          phone: true,
          created_at: true,
          updated_at: true,
          role: true,
        },
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json({ user });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    } finally {
      await prisma.$disconnect();
    }
  }

  // const { user, email, firstName, lastName, profilePicture, phone, darkMode, new_username } = req.body;
  const { email, firstName, lastName, profilePicture, phone, darkMode, new_username } = req.body;
  const user_id = req.user.user_id;
  
  console.log("user_id:", user_id);
  if (!user_id) {
    return res.status(400).json({ message: 'User ID not provided' });
  }

  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { user_id: user_id },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updateData = {};

    if (new_username) updateData.username = new_username;
    if (email) updateData.email = email;
    if (firstName) updateData.first_name = firstName;
    if (lastName) updateData.last_name = lastName;
    if (profilePicture) updateData.profile_picture = profilePicture;
    if (phone) updateData.phone = phone;
    if (darkMode !== undefined) updateData.dark_mode = darkMode;

    updateData.updated_at = new Date();

    const updatedUser = await updateUserProfile(user_id, updateData);

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    console.error(error);
    if (error.message === "Username already exists" || error.message === "Email already exists") {
      return res.status(400).json ({ message: error.message });
    }
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}

export default verifyUser(handler);