import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export async function signup(req, res) {
  const { fullName, email, username, storeName, phoneNumber, password } = req.body;

  try {
    // Validate required fields
    if (!fullName || !email || !username || !storeName || !phoneNumber || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate phone number format
    const phoneRegex = /^0[5-7][0-9]{8}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ error: 'Phone number must be 10 digits and start with 05, 06, or 07' });
    }

    // Check for existing email
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    // Check for existing username
    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    // Check for existing phone number
    const existingPhone = await prisma.user.findFirst({ where: { phoneNumber } });
    if (existingPhone) {
      return res.status(409).json({ error: 'Phone number already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        fullName,
        email,
        username,
        storeName,
        phoneNumber,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: { id: newUser.id, fullName: newUser.fullName, email: newUser.email }
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal server error. Please check your credentials and try again.' });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: 'No account found with that email' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      token,
      user: { id: user.id, fullName: user.fullName, email: user.email },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
}
