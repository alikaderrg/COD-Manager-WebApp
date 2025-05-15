// scripts/generate-token.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

const payload = {
  userId: 'REPLACE_WITH_REAL_USER_ID', // e.g. from Supabase or Prisma seed
};

const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

console.log('✅ JWT token for testing:\n');
console.log(token);
