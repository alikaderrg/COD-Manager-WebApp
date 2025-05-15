import express from 'express';
import {
  exportToZRExpress,
  getZRParcelStatus,
  updateZRParcelToReady,
  cancelZRParcel
} from '../controllers/courierController.js';
import { authenticateToken as requireAuth } from '../middlewares/authenticate.js';

const router = express.Router();

// Export parcels to ZR Express
router.post('/export', requireAuth, exportToZRExpress);

// Get parcel tracking status from ZR Express
router.post('/status', requireAuth, getZRParcelStatus);

// Mark parcel as ready to ship
router.post('/ready', requireAuth, updateZRParcelToReady);

// Cancel a parcel
router.post('/cancel', requireAuth, cancelZRParcel);

export default router;
