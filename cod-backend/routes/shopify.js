// routes/shopify.js
import express from 'express';
import { testShopifyConnection } from '../controllers/shopifyController.js';

const router = express.Router();

// Test Connection with Shopify
router.post('/test', testShopifyConnection);

// Optional: Ping test to verify routing
router.get('/ping', (req, res) => {
  res.send('pong');
});

export default router;
s
