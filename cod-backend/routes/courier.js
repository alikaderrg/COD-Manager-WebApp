// routes/courier.js
import express from 'express';
import { verifyToken } from '../middlewares/authenticate.js';
import { exportToCourier } from '../controllers/courierController.js';

const router = express.Router();

// POST /api/courier/export
router.post('/export', verifyToken, exportToCourier);

export default router;
