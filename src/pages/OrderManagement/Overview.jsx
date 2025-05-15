import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Download, Upload, RotateCw } from 'lucide-react';
import { DatePickerWithRange } from '@/components/shared/DatePickerWithRange';
import OrdersTable from '@/components/orders/OrdersTable';
import AddOrderForm from '@/components/orders/AddOrderForm';
import ExportCourierDialog from '@/components/orders/ExportCourierDialog';
import { useToast } from '@/components/ui/use-toast';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const headers = {
  Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
};

const getStatusCounts = (orders) => {
  const counts = orders.reduce((acc, order) => {
    acc[order.internalStatus] = (acc[order.internalStatus] || 0) + 1;
    return acc;
  }, {});
  counts.total = orders.length;
  return counts;
};

const calculateMetrics = (orders) => {
  const deliveredOrders = orders.filter(o => o.internalStatus === 'Delivered');
  const confirmedOrders = orders.filter(o => o.internalStatus === 'Confirmed');
  const alertOrders = orders.filter(o => o.internalStatus === 'Alerted');
  const shippedOrders = orders.filter(o => o.packageStatus === 'Shipped');

  const totalPotentialRevenue = orders.reduce((sum, order) => sum + (order.sellingPrice || 0), 0);
  const totalRevenue = deliveredOrders.reduce((sum, order) => sum + (order.sellingPrice || 0), 0);

  return {
    totalRevenue,
    totalPotentialRevenue,
    confirmedCount: confirmedOrders.length,
    pendingCount: alertOrders.length,
    shippedCount: shippedOrders.length,
    deliveredCount: deliveredOrders.length,
  };
};

const OrderManagementOverview = ({ filterStatus }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [dateRange, setDateRange] = useState({ from: new Date(), to: new Date() });
  const { toast } = useToast();

  useEffect(() => {
    const savedOrders = localStorage.getItem('cod_orders');
    const parsedOrders = savedOrders ? JSON.parse(savedOrders) : [];
    setOrders(parsedOrders);
  }, []);

  useEffect(() => {
    let result = [...orders];

    if (filterStatus) {
      result = result.filter(order => order.internalStatus === filterStatus);
    } else if (dateRange?.from && dateRange?.to) {
      const start = new Date(dateRange.from.setHours(0, 0, 0, 0));
      const end = new Date(dateRange.to.setHours(23, 59, 59, 999));
      result = result.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= start && orderDate <= end;
      });
    }

    setFilteredOrders(result);
  }, [orders, dateRange, filterStatus]);

  const handleDateChange = useCallback((newRange) => {
    setDateRange(newRange);
  }, []);

  const handleAddOrder = useCallback((newOrder) => {
    const updated = [newOrder, ...orders];
    setOrders(updated);
    localStorage.setItem('cod_orders', JSON.stringify(updated));
  }, [orders]);

  const handleUpdateOrder = useCallback((orderId, updates) => {
    const updated = orders.map(order =>
      order.id === orderId ? { ...order, ...updates } : order
    );
    setOrders(updated);
    localStorage.setItem('cod_orders', JSON.stringify(updated));
    toast({ title: "Order Updated", description: `Order ${orderId} has been updated.` });
  }, [orders, toast]);

  const handleExportOrderCallback = useCallback((orderId, trackingId) => {
    handleUpdateOrder(orderId, { exportStatus: 'Exported', trackingId });
  }, [handleUpdateOrder]);

  const handleSendWhatsApp = (orderId, phone, name) => {
    toast({ title: "Send WhatsApp", description: `Preparing message for ${name} (${phone})` });
    handleUpdateOrder(orderId, { whatsappStatus: 'Contacted' });
  };

  const handlePrintLabel = (orderId) => toast({ title: "Print Label", description: `Printing label for order ${orderId}` });

  const handleBulkSync = async () => {
    try {
      const res = await axios.post(`${baseURL}/api/orders/sync`, {}, { headers });
      const synced = res.data.orders || [];
      setOrders(synced);
      localStorage.setItem('cod_orders', JSON.stringify(synced));
      toast({ title: '✅ Synced', description: `Fetched ${synced.length} orders.` });
    } catch (err) {
      toast({ title: '❌ Sync Failed', description: err.response?.data?.error || err.message });
    }
  };

  const statusCounts = getStatusCounts(filteredOrders);
  const metrics = calculateMetrics(filteredOrders);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="p-4 md:p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-primary">Order Management</h1>
        {!filterStatus && (
          <div className="flex flex-wrap items-center gap-2">
            <DatePickerWithRange onDateChange={handleDateChange} />
            <Button variant="outline" size="icon" title="Sync Orders" onClick={handleBulkSync}> <RotateCw size={16} /> </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4">
        <SummaryCard title="Total Orders" value={statusCounts.total || 0} />
        <SummaryCard title="Potential Revenue" value={`DA ${metrics.totalPotentialRevenue.toLocaleString()}`} />
        <SummaryCard title="Revenue Delivered" value={`DA ${metrics.totalRevenue.toLocaleString()}`} />
        <SummaryCard title="Confirmed Orders" value={metrics.confirmedCount} />
        <SummaryCard title="Pending Orders" value={metrics.pendingCount} />
        <SummaryCard title="Shipped Orders" value={metrics.shippedCount} />
        <SummaryCard title="Delivered Orders" value={metrics.deliveredCount} />
      </div>

      {!filterStatus && (
        <div className="flex flex-wrap items-center gap-2">
          <AddOrderForm onOrderAdded={handleAddOrder} />
          <ExportCourierDialog allOrders={orders} onOrdersExported={handleExportOrderCallback} />
          <Button variant="outline"> <Download className="mr-2 h-4 w-4" /> Export Report </Button>
          <Button variant="outline"> <Upload className="mr-2 h-4 w-4" /> Import/Export CSV </Button>
        </div>
      )}

      <OrdersTable
        orders={filteredOrders}
        onUpdateOrder={handleUpdateOrder}
        onExportOrder={handleExportOrderCallback}
        onSendWhatsApp={handleSendWhatsApp}
        onPrintLabel={handlePrintLabel}
      />
    </motion.div>
  );
};

const SummaryCard = ({ title, value }) => (
  <motion.div whileHover={{ y: -5 }} className="bg-card p-4 rounded-lg shadow-md border border-border text-center transition-transform duration-200">
    <h3 className="text-sm text-muted-foreground mb-1">{title}</h3>
    <p className="text-xl md:text-2xl font-bold text-primary">{value}</p>
  </motion.div>
);

export default OrderManagementOverview;
