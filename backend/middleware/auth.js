import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Try to decode as JWT first
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (jwtError) {
      // Fallback to base64 JSON format for backward compatibility
      try {
        decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
      } catch (base64Error) {
        return res.status(401).json({ error: 'Invalid token format' });
      }
    }
    
    // Fetch user from database
    const user = await prisma.users.findUnique({
      where: { id: decoded.userId || decoded.id }
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    // Set req.user with UUID and publicId
    req.user = {
      id: user.id,
      publicId: user.public_id
    };
    
    next();
  } catch (error) {
    console.error('❌ Auth middleware error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};
