// routes/shopify.js

import express from 'express';
import { testShopifyConnection } from '../controllers/shopifyController.js';

const router = express.Router();

// Test connection to Shopify API
router.post('/test', testShopifyConnection);

export default router;
