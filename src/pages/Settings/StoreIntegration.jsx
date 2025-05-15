import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function StoreIntegration() {
  const { toast } = useToast();
  const [domain, setDomain] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [shopInfo, setShopInfo] = useState(null);

  const headers = {
    Authorization: `Bearer ${localStorage.getItem('auth_token')}`
  };

  const handleTestConnection = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${baseURL}/api/shopify/test`, {
        domain,
        token,
      }, { headers });

      setShopInfo(response.data.sample[0]);
      toast({
        title: '✅ Connected to Shopify!',
        description: `Sample product: ${response.data.sample[0].title}`,
      });

      // Save to DB
      await axios.post(`${baseURL}/api/shopify/save`, { domain, token }, { headers });

    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Unknown error';
      toast({ title: '❌ Connection failed', description: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Store Integration</h2>
        <p className="text-muted-foreground text-sm mb-4">
          Connect your Shopify store to sync orders and products.
        </p>

        <label className="block mb-2 font-medium">Shopify Store Domain</label>
        <Input
          placeholder="your-store.myshopify.com"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        />

        <label className="block mt-4 mb-2 font-medium">Access Token</label>
        <Input
          placeholder="shpat_xxx..."
          value={token}
          onChange={(e) => setToken(e.target.value)}
          type="password"
        />

        <Button
          className="mt-4"
          onClick={handleTestConnection}
          disabled={loading || !domain || !token}
        >
          {loading ? 'Testing...' : 'Test Connection'}
        </Button>

        {shopInfo && (
          <div className="mt-6 p-4 border rounded bg-muted">
            <h4 className="font-medium">Connected Store Sample Product:</h4>
            <p className="text-sm">Title: {shopInfo.title}</p>
            <p className="text-sm">Created At: {shopInfo.created_at}</p>
          </div>
        )}
      </div>
    </div>
  );
}
