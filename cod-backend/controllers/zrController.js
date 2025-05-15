// controllers/zrController.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function saveZRSettings(req, res) {
  const { token, key } = req.body;
  const userId = req.user.userId;

  try {
    const saved = await prisma.zrIntegration.upsert({
      where: { userId },
      update: { token, key },
      create: { token, key, userId },
    });
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save ZR settings' });
  }
}

export async function sendToZR(req, res) {
  // TODO: Send parcel data to ZR Express
  res.json({ message: 'Send to ZR Express not implemented' });
}

export async function getTrackingInfo(req, res) {
  // TODO: Call ZR Express to get tracking data
  res.json({ message: 'Tracking info not implemented yet' });
}
