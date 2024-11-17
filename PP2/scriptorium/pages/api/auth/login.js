// This file was created with the assistance of GPT-4

import prisma from "../../../utils/db";
import { comparePassword, generateToken } from "../../../utils/auth";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Please provide all the required fields",
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      username: true,
      role: true,
      password: true,
      user_id: true,
    },
  });

  if (!user) {
    return res.status(404).json({
      message: "User does not exist",
    });
  }

  if (!(await comparePassword(password, user.password))) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  const token = generateToken(user);
  const refreshToken = generateToken(user, true,);

  console.log();
  return res.status(200).json({
    token,
    refreshToken,
  });
}
