import express from 'express';
import { testShopifyConnection, saveShopifyCredentials } from '../controllers/shopifyController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/test', verifyToken, testShopifyConnection);
router.post('/save', verifyToken, saveShopifyCredentials);

export default router;
