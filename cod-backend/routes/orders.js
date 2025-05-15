// routes/orders.js
import { Router } from 'express';
import {
  getAllOrders,
  updateOrder,
  exportOrderToCourier,
  getWarehouseStatus,
  getCourierStatus,
  fetchOrdersFromShopify
} from '../controllers/orderController.js';
import { authenticateToken } from '../middlewares/authenticate.js';

const router = Router();

// All routes below are protected
router.use(authenticateToken);

// Get all orders for the authenticated user
router.get('/', getAllOrders);

// Sync orders from Shopify
router.post('/sync', fetchOrdersFromShopify);

// Update an order (status, alert reason, cancel reason, etc.)
router.put('/:id', updateOrder);

// Export order to courier and fetch tracking ID
router.post('/:id/export', exportOrderToCourier);

// Get current warehouse status (mocked now, real integration later)
router.get('/:id/warehouse-status', getWarehouseStatus);

// Get courier status using tracking ID (via courier API)
router.get('/courier-status/:trackingId', getCourierStatus);

export default router;
