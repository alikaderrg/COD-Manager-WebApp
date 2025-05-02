// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import authRoutes from './routes/auth.js';
import shopifyRoutes from './routes/shopify.js';
import ordersRoutes from './routes/orders.js';
import zrRoutes from './routes/zr.js';

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
