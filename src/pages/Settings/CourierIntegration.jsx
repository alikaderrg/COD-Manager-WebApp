import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const headers = {
  Authorization: `Bearer ${localStorage.getItem('auth_token')}`
};

export default function CourierIntegration() {
  const { toast } = useToast();
  const [token, setToken] = useState('');
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.post(`${baseURL}/api/zr/save`, { token, key }, { headers });
      toast({ title: '✅ Courier connected', description: 'ZR Express settings saved.' });
    } catch (err) {
      toast({ title: '❌ Failed', description: err.response?.data?.error || err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleOrderSync = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/orders/sync`, { headers });
      toast({ title: '✅ Orders synced', description: `${res.data.count} orders fetched.` });
    } catch (err) {
      toast({ title: '❌ Sync failed', description: err.response?.data?.error || err.message });
    }
  };

  const handleExportOrder = async (orderId) => {
    try {
      await axios.post(`${baseURL}/api/orders/export`, { orderId }, { headers });
      toast({ title: '✅ Order exported', description: `Order ${orderId} sent to courier.` });
    } catch (err) {
      toast({ title: '❌ Export failed', description: err.response?.data?.error || err.message });
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">ZR Express Integration</h2>
        <p className="text-muted-foreground text-sm mb-4">Enter your courier API credentials to enable shipping and tracking.</p>

        <label className="block mb-2 font-medium">Token</label>
        <Input
          placeholder="Your ZR Express Token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />

        <label className="block mt-4 mb-2 font-medium">Key</label>
        <Input
          placeholder="Your ZR Express Key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />

        <Button
          className="mt-4"
          onClick={handleSave}
          disabled={loading || !token || !key}
        >
          {loading ? 'Saving...' : 'Save Integration'}
        </Button>
      </div>
    </div>
  );
}
