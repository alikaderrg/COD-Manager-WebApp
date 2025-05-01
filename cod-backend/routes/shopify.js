// routes/shopify.js

import express from 'express';
import { testShopifyConnection } from '../controllers/shopifyController.js';

const router = express.Router();

// POST /api/shopify/test
router.post('/test', testShopifyConnection);

export default router;
