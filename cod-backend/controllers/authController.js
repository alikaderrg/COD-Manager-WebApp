import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export async function signup(req, res) {
  const { fullName, storeName, username, email, phoneNumber, password } = req.body;

  try {
    // Basic empty check
    if (!fullName || !storeName || !username || !email || !phoneNumber || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate phone number format
    if (!/^\d{10}$/.test(phoneNumber)) {
      return res.status(400).json({ error: 'Phone number must be exactly 10 digits' });
    }

    // Check for duplicates
    const [existingEmail, existingUsername, existingPhone] = await Promise.all([
      prisma.user.findUnique({ where: { email } }),
      prisma.user.findUnique({ where: { username } }),
      prisma.user.findFirst({ where: { phoneNumber } })
    ]);

    if (existingEmail) return res.status(409).json({ error: 'Email already in use' });
    if (existingUsername) return res.status(409).json({ error: 'Username already taken' });
    if (existingPhone) return res.status(409).json({ error: 'Phone number already used' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        fullName,
        storeName,
        username,
        email,
        phoneNumber,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      token,
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        storeName: newUser.storeName,
        username: newUser.username,
        phoneNumber: newUser.phoneNumber,
      },
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        storeName: user.storeName,
        username: user.username,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
}
