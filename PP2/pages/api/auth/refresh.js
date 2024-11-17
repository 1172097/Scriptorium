// This file was created with the assistance of GPT-4


import { verifyToken, generateToken } from '../../../utils/auth';

export default function apiHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { refresh_token } = req.body;
  const auth_token = req.headers.authorization;

  if (!auth_token) {
    return res.status(400).json({ message: 'Auth token is required' });
  }

  const decodedAuth = verifyToken(req);

  if (decodedAuth) {
    console.log('decodedAuth', decodedAuth);
    // Remove "Bearer " prefix before returning the token
    const tokenWithoutBearer = auth_token.split(' ')[1];
    return res.status(200).json({ accessToken: tokenWithoutBearer });
  }

  if (!refresh_token) {
    return res.status(400).json({ message: 'Refresh token is required' });
  }

  const decodedRefresh = verifyToken(req, true);

  if (!decodedRefresh) {
    return res.status(401).json({ message: 'Invalid or expired refresh token' });
  }

  const newAccessToken = generateToken(decodedRefresh);

  res.status(200).json({ accessToken: newAccessToken });
}