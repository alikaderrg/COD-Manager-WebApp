import express from 'express';
import { testShopifyConnection, saveShopifyCredentials } from '../controllers/shopifyController.js';
import { verifyToken } from '../middlewares/authenticate.js';

const router = express.Router();

router.post('/test', verifyToken, testShopifyConnection);
router.post('/save', verifyToken, saveShopifyCredentials);

export default router;
