const headers = {
    Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
  };

  const handleOrderSync = async () => {
    try {
      await axios.post(`${baseURL}/api/orders/sync`, {}, { headers });
      toast({ title: '✅ Orders Synced' });
    } catch (err) {
      toast({ title: '❌ Sync failed', description: err.response?.data?.error || err.message });
    }
  };
