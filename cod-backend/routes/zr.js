import express from 'express';
import { saveZRSettings, sendToZR, getTrackingInfo } from '../controllers/zrController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/save', verifyToken, saveZRSettings);
router.post('/send', verifyToken, sendToZR);
router.post('/track', verifyToken, getTrackingInfo);

export default router;
