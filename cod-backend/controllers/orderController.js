import prisma from '../lib/prisma.js';
import axios from 'axios';

// Fetch all orders for a user
export const getAllOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update an order (status or reason)
export const updateOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const data = req.body;

    const order = await prisma.order.updateMany({
      where: { id, userId },
      data,
    });

    res.json({ success: true, order });
  } catch (err) {
    console.error('Error updating order:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Sync orders from Shopify
export const fetchOrdersFromShopify = async (req, res) => {
  try {
    const userId = req.user.id;

    const shopify = await prisma.shopifyIntegration.findUnique({
      where: { userId },
    });

    if (!shopify) return res.status(400).json({ error: 'No Shopify integration found' });

    const response = await axios.get(`https://${shopify.domain}/admin/api/2023-10/orders.json`, {
      headers: {
        'X-Shopify-Access-Token': shopify.token,
        'Content-Type': 'application/json',
      },
    });

    const orders = response.data.orders;

    // Save orders to database (simplified logic)
    for (const order of orders) {
      await prisma.order.upsert({
        where: { shopifyId: String(order.id) },
        update: {},
        create: {
          shopifyId: String(order.id),
          userId,
          customerName: order.customer?.first_name || 'Unknown',
          phoneNumber: order.phone || '',
          wilaya: order.shipping_address?.province || '',
          commune: order.shipping_address?.city || '',
          deliveryType: 'D',
          productName: order.line_items?.[0]?.title || '',
          quantity: order.line_items?.[0]?.quantity || 1,
          cogs: 0,
          sellingPrice: Number(order.total_price || 0),
          internalStatus: 'Created',
        },
      });
    }

    res.json({ success: true, count: orders.length });
  } catch (err) {
    console.error('Error syncing Shopify orders:', err?.response?.data || err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// Export to Courier (ZR Express)
export const exportOrderToCourier = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const order = await prisma.order.findUnique({ where: { id } });

    const zr = await prisma.zRIntegration.findUnique({ where: { userId } });
    if (!zr) return res.status(400).json({ error: 'ZR Express not connected' });

    const payload = {
      Colis: [
        {
          Tracking: '',
          TypeLivraison: '0',
          TypeColis: '0',
          Confrimee: '',
          Client: order.customerName,
          MobileA: order.phoneNumber,
          Adresse: `${order.commune}, ${order.wilaya}`,
          IDWilaya: '16',
          Commune: order.commune,
          Total: order.sellingPrice.toString(),
          Note: order.note || '',
          TProduit: order.productName,
          id_Externe: order.id,
        },
      ],
    };

    const result = await axios.post('https://procolis.com/api_v1/add_colis', payload, {
      headers: { token: zr.token, key: zr.key },
    });

    await prisma.order.update({ where: { id }, data: { exportStatus: 'Exported' } });
    res.json({ success: true, message: 'Order exported to courier', result: result.data });
  } catch (err) {
    console.error('Error exporting order:', err?.response?.data || err);
    res.status(500).json({ error: 'Failed to export order' });
  }
};

// Get warehouse status
export const getWarehouseStatus = async (req, res) => {
  try {
    const statuses = [
      'Pending',
      'Pick Listed',
      'Packed',
      'Ready To Ship',
      'Shipped To Courier',
      'Received by Courier',
    ];
    const random = statuses[Math.floor(Math.random() * statuses.length)];
    res.json({ status: random });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch warehouse status' });
  }
};

// Get courier status using ZR Express API
export const getCourierStatus = async (req, res) => {
  try {
    const { trackingId } = req.params;
    const userId = req.user.id;

    const zr = await prisma.zRIntegration.findUnique({ where: { userId } });
    if (!zr) return res.status(400).json({ error: 'ZR Express not connected' });

    const result = await axios.post('https://procolis.com/api_v1/lire', {
      Colis: [{ Tracking: trackingId }],
    }, {
      headers: { token: zr.token, key: zr.key },
    });

    const status = result?.data?.Colis?.[0]?.Etat || 'Unknown';
    res.json({ status });
  } catch (err) {
    console.error('Error getting courier status:', err?.response?.data || err);
    res.status(500).json({ error: 'Failed to fetch courier status' });
  }
};

// Delete many orders
export async function deleteManyOrders(req, res) {
  try {
    const { orderIds } = req.body;

    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({ error: 'No order IDs provided' });
    }

    await prisma.order.deleteMany({
      where: {
        id: {
          in: orderIds
        },
        userId: req.user.id
      }
    });

    res.status(200).json({ message: 'Orders deleted successfully' });
  } catch (error) {
    console.error('Bulk delete error:', error.message);
    res.status(500).json({ error: 'Failed to delete orders' });
  }
}
