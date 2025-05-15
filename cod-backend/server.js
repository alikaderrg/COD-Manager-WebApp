// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import passport from './auth/passport.js';

// Routes
import authRoutes from './routes/auth.js';
import shopifyRoutes from './routes/shopify.js';
import ordersRoutes from './routes/orders.js';
import zrRoutes from './routes/zr.js';
import courierRoutes from './routes/courier.js';



dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Route mounting
app.use('/api/auth', authRoutes);         // No auth required
app.use('/api/shopify', shopifyRoutes);   // Protected
app.use('/api/orders', ordersRoutes);     // Protected
app.use('/api/zr', zrRoutes);             // Protected
app.use('/api/courier', courierRoutes);

app.use(session({
  secret: process.env.SESSION_SECRET || 'cod_manager_secret',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Default route
app.get('/', (req, res) => {
  res.send('📦 COD Manager API is running');
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
  res.redirect('https://cod-manager-web-app.vercel.app/'); // or dashboard page
});
