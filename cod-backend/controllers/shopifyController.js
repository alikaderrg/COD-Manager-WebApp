import prisma from '../lib/prisma.js';
import axios from 'axios';

// Test Shopify connection using credentials
export async function testShopifyConnection(req, res) {
  try {
    const { storeUrl, accessToken } = req.body;

    if (!storeUrl || !accessToken) {
      return res.status(400).json({ error: 'Missing storeUrl or accessToken' });
    }

    const response = await axios.get(`https://${storeUrl}/admin/api/2023-07/shop.json`, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json',
      },
    });

    res.status(200).json({ success: true, shop: response.data.shop });
  } catch (error) {
    console.error('Shopify connection test failed:', error.message);
    res.status(500).json({ success: false, error: 'Failed to connect to Shopify' });
  }
}

// Save or update Shopify credentials for authenticated user
export async function saveShopifyCredentials(req, res) {
  try {
    const { storeUrl, accessToken } = req.body;

    if (!storeUrl || !accessToken) {
      return res.status(400).json({ error: 'Missing storeUrl or accessToken' });
    }

    const userId = req.user.id;

    const existing = await prisma.shopifyStore.findFirst({ where: { userId } });

    if (existing) {
      await prisma.shopifyStore.update({
        where: { id: existing.id },
        data: { storeUrl, accessToken },
      });
    } else {
      await prisma.shopifyStore.create({
        data: { storeUrl, accessToken, userId },
      });
    }

    res.status(200).json({ message: 'Shopify credentials saved successfully' });
  } catch (error) {
    console.error('Error saving Shopify credentials:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}
