// controllers/shopifyController.js

import axios from 'axios';

export async function testShopifyConnection(req, res) {
  const { domain, token } = req.body;

  if (!domain || !token) {
    return res.status(400).json({ error: 'Domain and token are required.' });
  }

  try {
    const response = await axios.get(`https://${domain}/admin/api/2023-10/shop.json`, {
      headers: {
        'X-Shopify-Access-Token': token,
      },
    });

    return res.status(200).json({ success: true, shop: response.data.shop });
  } catch (error) {
    console.error('Shopify connection error:', error.response?.data || error.message);
    return res.status(401).json({ success: false, error: 'Failed to authenticate with Shopify.' });
  }
}
