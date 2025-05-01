// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import shopifyRoutes from './routes/shopify.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use('/api/shopify', shopifyRoutes);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/shopify', shopifyRoutes);

// Root Test
app.get('/', (req, res) => {
  res.send('COD Manager API is running ✅');
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
