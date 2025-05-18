import prisma from '../lib/prisma.js';
import axios from 'axios';

// Test Shopify connection
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

// Save or update Shopify credentials
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

// Fetch and sync orders from Shopify
export async function fetchOrdersFromShopify(req, res) {
  const userId = req.user.id;

  try {
    const store = await prisma.shopifyStore.findFirst({ where: { userId } });
    if (!store) {
      return res.status(404).json({ error: 'No Shopify store linked to this account.' });
    }

    const response = await axios.get(
      `https://${store.storeUrl}/admin/api/2023-07/orders.json?status=any&limit=100`,
      {
        headers: {
          'X-Shopify-Access-Token': store.accessToken,
          'Content-Type': 'application/json',
        },
      }
    );

    const shopifyOrders = response.data.orders || [];
    const mappedOrders = [];

    for (const shopifyOrder of shopifyOrders) {
      const existing = await prisma.order.findFirst({
        where: { shopifyOrderId: String(shopifyOrder.id), userId },
      });

      const orderData = {
        shopifyOrderId: String(shopifyOrder.id),
        customerName: `${shopifyOrder.customer?.first_name || ''} ${shopifyOrder.customer?.last_name || ''}`,
        phoneNumber: shopifyOrder.phone || shopifyOrder.customer?.phone || '',
        productName: shopifyOrder.line_items[0]?.name || 'Unknown Product',
        quantity: shopifyOrder.line_items[0]?.quantity || 1,
        sellingPrice: parseFloat(shopifyOrder.total_price || '0'),
        confirmationStatus: 'Created',
        internalStatus: 'Created',
        userId,
        createdAt: new Date(shopifyOrder.created_at),
      };

      const order = existing
        ? await prisma.order.update({ where: { id: existing.id }, data: orderData })
        : await prisma.order.create({ data: orderData });

      mappedOrders.push(order);
    }

    res.status(200).json({ message: 'Orders synced successfully', orders: mappedOrders });
  } catch (error) {
    console.error('Error syncing orders:', error.message);
    res.status(500).json({ error: 'Failed to fetch orders from Shopify' });
  }
}
