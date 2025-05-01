// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import shopifyRoutes from './routes/shopify.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/shopify', shopifyRoutes);

// Default Route
app.get('/', (req, res) => {
  res.send('📦 COD Manager API is running');
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
