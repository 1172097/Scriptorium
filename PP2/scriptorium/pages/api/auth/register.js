// This file was created with the assistance of GPT-4

import { hashPassword } from "@/utils/auth";
import prisma from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, email, password, firstName, lastName, phone, role } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "Please provide all the required fields",
    });
  }

  try {
        // Check if the username or email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: username },
          { email: email }
        ]
      }
    });

    if (existingUser) {
        return res.status(400).json({
          message: "Username or email already exists",
        });
      }

        const hashedPassword = await hashPassword(password);
        const user = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          first_name: "",
          last_name: "",
          profile_picture: "/public/default_profile_pic.png",
          // phone,
          role,
        },
    // select: {
    //   username: true,
    //   email: true,
    //   firstName: true,
    //   lastName: true,
    // },
    });
    res.status(200).json(user);
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}
