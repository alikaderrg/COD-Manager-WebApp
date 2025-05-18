import { Router } from 'express';
import {
  getAllOrders,
  updateOrder,
  exportOrderToCourier,
  getWarehouseStatus,
  getCourierStatus,
  fetchOrdersFromShopify,
  deleteManyOrders // 👈 new controller
} from '../controllers/orderController.js';
import { authenticateToken } from '../middlewares/authenticate.js';

const router = Router();

router.use(authenticateToken);

router.get('/', getAllOrders);
router.post('/sync', fetchOrdersFromShopify);
router.put('/:id', updateOrder);
router.post('/:id/export', exportOrderToCourier);
router.get('/:id/warehouse-status', getWarehouseStatus);
router.get('/courier-status/:trackingId', getCourierStatus);

// ✅ NEW: Bulk delete route
router.delete('/delete-many', deleteManyOrders);

export default router;
