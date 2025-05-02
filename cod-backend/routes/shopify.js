import express from 'express';
import { testShopifyConnection } from '../controllers/shopifyController.js';
import { saveShopifyCredentials } from '../controllers/shopifySaveController.js';

const router = express.Router();

router.post('/test', testShopifyConnection);
router.post('/save', saveShopifyCredentials); // ✅ new route

router.get('/ping', (req, res) => {
  res.send('pong');
});

export default router;
