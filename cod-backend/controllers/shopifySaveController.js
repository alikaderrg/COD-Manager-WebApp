// controllers/shopifySaveController.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function saveShopifyCredentials(req, res) {
  const { domain, token, userId } = req.body;

  if (!domain || !token || !userId) {
    return res.status(400).json({ error: 'Missing domain, token, or userId' });
  }

  try {
    const existing = await prisma.shopifyIntegration.findUnique({
      where: { userId },
    });

    if (existing) {
      await prisma.shopifyIntegration.update({
        where: { userId },
        data: { domain, token },
      });
    } else {
      await prisma.shopifyIntegration.create({
        data: {
          domain,
          token,
          user: { connect: { id: userId } },
        },
      });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Shopify save error:', err);
    return res.status(500).json({ error: 'Server error saving credentials' });
  }
}
