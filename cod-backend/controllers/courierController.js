// controllers/courierController.js
import axios from 'axios';
import prisma from '../lib/prisma.js';

/**
 * Export orders to ZR Express and confirm tracking
 */
export async function exportToZRExpress(req, res) {
  const userId = req.user?.id;
  const orders = req.body.orders;

  if (!orders || !orders.length) {
    return res.status(400).json({ error: 'No orders provided' });
  }

  try {
    const zr = await prisma.zRIntegration.findUnique({ where: { userId } });

    if (!zr) {
      return res.status(403).json({ error: 'ZR Express not configured for this user' });
    }

    // Prepare parcels
    const colisPayload = {
      Colis: orders.map((o) => ({
        Tracking: o.id,
        TypeLivraison: o.deliveryType === 'SD' ? '1' : '0',
        TypeColis: '0',
        Confrimee: '',
        Client: o.customerName,
        MobileA: o.phoneNumber,
        MobileB: o.phoneNumber,
        Adresse: o.note || 'N/A',
        IDWilaya: '31', // Hardcoded, replace with dynamic logic if needed
        Commune: o.commune,
        Total: String(o.sellingPrice),
        Note: o.commentary || '',
        TProduit: o.productName,
        id_Externe: o.id,
        Source: ''
      }))
    };

    // Step 1: Send parcels
    await axios.post('https://procolis.com/api_v1/add_colis', colisPayload, {
      headers: {
        token: zr.token,
        key: zr.key,
        'Content-Type': 'application/json'
      }
    });

    // Step 2: Confirm by reading them back
    const lirePayload = {
      Colis: orders.map((o) => ({ Tracking: o.id }))
    };

    const lireResponse = await axios.post('https://procolis.com/api_v1/lire', lirePayload, {
      headers: {
        token: zr.token,
        key: zr.key,
        'Content-Type': 'application/json'
      }
    });

    const confirmed = lireResponse.data.Colis || [];

    const updated = confirmed.map((colis) => ({
      id: colis.Tracking,
      trackingId: colis.Tracking // Replace if actual tracking ID differs
    }));

    return res.status(200).json({ updated });
  } catch (err) {
    console.error('ZR Export Error:', err?.response?.data || err.message);
    return res.status(500).json({ error: 'Failed to export and confirm orders with ZR Express' });
  }
}
