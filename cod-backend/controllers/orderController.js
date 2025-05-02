// controllers/orderController.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getOrders(req, res) {
  try {
    const orders = await prisma.order.findMany({ where: { userId: req.user.userId }});
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
}

export async function fetchOrdersFromShopify(req, res) {
  // TODO: Implement logic to pull orders from Shopify
  res.json({ message: 'Shopify order sync not implemented yet' });
}

export async function updateOrder(req, res) {
  const { id } = req.params;
  const data = req.body;

  try {
    const updated = await prisma.order.update({
      where: { id },
      data,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order' });
  }
}
