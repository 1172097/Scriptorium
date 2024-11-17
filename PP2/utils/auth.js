// This file was created with the assistance of GPT-4

import bcrypt from "bcrypt";
import ms from 'ms';
import jwt from "jsonwebtoken";

const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS);
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN;

export async function hashPassword(password) {
  return await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
}

export async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}


export function generateToken(user, is_refresh_token = false) {
  const payload = {
    user_id: user.user_id,
    role: user.role,
    expiresAt: Date.now() + ms(is_refresh_token ? JWT_REFRESH_EXPIRES_IN : JWT_EXPIRES_IN),
  };
  console.log('payload', payload)
  const secret = is_refresh_token ? JWT_REFRESH_SECRET : JWT_SECRET;
  const expiresIn = is_refresh_token ? JWT_REFRESH_EXPIRES_IN : JWT_EXPIRES_IN;
  return jwt.sign(payload, secret, { expiresIn });
}

// decoded is null when invalid
// when valid it returns the payload

export function verifyToken(req, is_refresh_token = false) {
  const { refresh_token } = req.body;
  const auth_token = req.headers.authorization;

  const temp = is_refresh_token ? refresh_token : auth_token;

  if (!temp || !temp.startsWith('Bearer ')) {
      return null;
  }
  const token = temp.split(' ')[1]; // Extract the token
  const secret = is_refresh_token ? JWT_REFRESH_SECRET : JWT_SECRET;
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    return null;
  }
}