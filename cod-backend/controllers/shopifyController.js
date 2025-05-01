// controllers/shopifyController.js
import axios from 'axios';

export async function testShopifyConnection(req, res) {
  const { domain, token } = req.body;

  if (!domain || !token) {
    return res.status(400).json({ error: 'Missing domain or token' });
  }

  try {
    const response = await axios.get(`https://${domain}/admin/api/2023-10/products.json`, {
      headers: {
        'X-Shopify-Access-Token': token,
        'Content-Type': 'application/json'
      },
    });

    const products = response.data.products;
    if (!products || products.length === 0) {
      return res.status(404).json({ error: 'No products found or invalid token' });
    }

    return res.status(200).json({
      success: true,
      sample: products.slice(0, 1),
    });
  } catch (error) {
    console.error('Shopify API Error:', error?.response?.data || error.message);
    return res.status(401).json({
      error: 'Invalid Shopify credentials, store domain, or token',
    });
  }
}
