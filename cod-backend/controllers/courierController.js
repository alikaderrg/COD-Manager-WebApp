import axios from 'axios';
import prisma from '../lib/prisma.js';

// Export parcels to ZR Express
export async function exportToZRExpress(req, res) {
  const userId = req.user?.id;
  const orders = req.body.orders;

  if (!orders || !orders.length) {
    return res.status(400).json({ error: 'No orders provided' });
  }

  try {
    const zr = await prisma.zRIntegration.findUnique({ where: { userId } });

    if (!zr) return res.status(403).json({ error: 'ZR Express not configured for this user' });

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
        IDWilaya: '31',
        Commune: o.commune,
        Total: String(o.sellingPrice),
        Note: o.commentary || '',
        TProduit: o.productName,
        id_Externe: o.id,
        Source: ''
      }))
    };

    // Export
    await axios.post('https://procolis.com/api_v1/add_colis', colisPayload, {
      headers: {
        token: zr.token,
        key: zr.key,
        'Content-Type': 'application/json'
      }
    });

    // Query status right after
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

    const updated = confirmed.map(colis => ({
      id: colis.Tracking,
      trackingId: colis.Tracking
    }));

    return res.status(200).json({ updated });
  } catch (err) {
    console.error('ZR Export Error:', err?.response?.data || err.message);
    return res.status(500).json({ error: 'Failed to export and confirm orders with ZR Express' });
  }
}

// Get parcel status from ZR Express
export async function getZRParcelStatus(req, res) {
  const userId = req.user?.id;
  const { trackingNumbers } = req.body;

  if (!Array.isArray(trackingNumbers) || trackingNumbers.length === 0) {
    return res.status(400).json({ error: 'No tracking numbers provided' });
  }

  try {
    const zr = await prisma.zRIntegration.findUnique({ where: { userId } });

    if (!zr) return res.status(403).json({ error: 'ZR Express not configured for this user' });

    const payload = {
      Colis: trackingNumbers.map(tr => ({ Tracking: tr }))
    };

    const response = await axios.post('https://procolis.com/api_v1/lire', payload, {
      headers: {
        token: zr.token,
        key: zr.key,
        'Content-Type': 'application/json'
      }
    });

    return res.status(200).json(response.data);
  } catch (err) {
    console.error('ZR Status Error:', err?.response?.data || err.message);
    return res.status(500).json({ error: 'Failed to fetch parcel status from ZR Express' });
  }
}

// Mark parcels as ready to ship
export async function updateZRParcelToReady(req, res) {
  const userId = req.user?.id;
  const { trackingNumbers } = req.body;

  if (!Array.isArray(trackingNumbers) || trackingNumbers.length === 0) {
    return res.status(400).json({ error: 'No tracking numbers provided' });
  }

  try {
    const zr = await prisma.zRIntegration.findUnique({ where: { userId } });

    if (!zr) return res.status(403).json({ error: 'ZR Express not configured for this user' });

    const payload = {
      Colis: trackingNumbers.map(tr => ({ Tracking: tr }))
    };

    const response = await axios.post('https://procolis.com/api_v1/pret_a_expedier', payload, {
      headers: {
        token: zr.token,
        key: zr.key,
        'Content-Type': 'application/json'
      }
    });

    return res.status(200).json(response.data);
  } catch (err) {
    console.error('ZR Ready Error:', err?.response?.data || err.message);
    return res.status(500).json({ error: 'Failed to mark parcels as ready to ship' });
  }
}

// Cancel a parcel
export async function cancelZRParcel(req, res) {
  const userId = req.user?.id;
  const { trackingNumber } = req.body;

  if (!trackingNumber) {
    return res.status(400).json({ error: 'No tracking number provided' });
  }

  try {
    const zr = await prisma.zRIntegration.findUnique({ where: { userId } });

    if (!zr) return res.status(403).json({ error: 'ZR Express not configured for this user' });

    const payload = {
      Colis: [{ Tracking: trackingNumber }]
    };

    const response = await axios.post('https://procolis.com/api_v1/annuler', payload, {
      headers: {
        token: zr.token,
        key: zr.key,
        'Content-Type': 'application/json'
      }
    });

    return res.status(200).json(response.data);
  } catch (err) {
    console.error('ZR Cancel Error:', err?.response?.data || err.message);
    return res.status(500).json({ error: 'Failed to cancel parcel on ZR Express' });
  }
}
