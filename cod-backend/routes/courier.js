// routes/courier.js
import express from 'express';
import { exportToZRExpress } from '../controllers/courierController.js';
import requireAuth from '../middlewares/requireAuth.js';

const router = express.Router();

router.post('/export', requireAuth, exportToZRExpress);

export default router;
