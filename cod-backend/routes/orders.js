import express from 'express';
import { fetchOrdersFromShopify, getOrders, updateOrder } from '../controllers/orderController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getOrders);
router.post('/sync', verifyToken, fetchOrdersFromShopify);
router.put('/:id', verifyToken, updateOrder);

export default router;
