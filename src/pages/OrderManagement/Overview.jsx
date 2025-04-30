
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Download, Upload, RotateCw } from 'lucide-react';
import { DatePickerWithRange } from '@/components/shared/DatePickerWithRange';
import OrdersTable from '@/components/orders/OrdersTable';
import AddOrderForm from '@/components/orders/AddOrderForm';
import ExportCourierDialog from '@/components/orders/ExportCourierDialog';
import { useToast } from '@/components/ui/use-toast';

// Mock Data - Replace with API calls or localStorage later
const initialOrders = [
    { id: 'ORD001', warehouseId: 'WH1', createdAt: '2025-04-28T10:00:00Z', internalStatus: 'Created', alertReason: null, customerName: 'Ahmed Benali', phoneNumber: '555123456', wilaya: 'Algiers', commune: 'Alger Centre', deliveryType: 'D', productName: 'Wireless Mouse', variant: 'Black', quantity: 1, cogs: 1500, sellingPrice: 2500, note: 'Urgent delivery', courier: null, trackingId: null, packageStatus: null, exportStatus: 'Pending Export', whatsappStatus: 'Pending', commentary: '' },
    { id: 'ORD002', warehouseId: 'WH2', createdAt: '2025-04-28T11:30:00Z', internalStatus: 'Confirmed', alertReason: null, customerName: 'Fatima Zohra', phoneNumber: '666789012', wilaya: 'Oran', commune: 'Oran Ville', deliveryType: 'SD', productName: 'Keyboard Pro', variant: 'N/A', quantity: 1, cogs: 4000, sellingPrice: 6000, note: '', courier: 'Yalidine', trackingId: null, packageStatus: null, exportStatus: 'Pending Export', whatsappStatus: 'Pending', commentary: 'Fragile item' },
    { id: 'ORD003', warehouseId: 'WH1', createdAt: '2025-04-27T15:00:00Z', internalStatus: 'Delivered', alertReason: null, customerName: 'Karim Salah', phoneNumber: '777345678', wilaya: 'Constantine', commune: 'Constantine Ville', deliveryType: 'D', productName: 'USB Hub', variant: 'N/A', quantity: 2, cogs: 800, sellingPrice: 1200, note: '', courier: 'ZR Express', trackingId: 'ZR123456789', packageStatus: 'Livré', exportStatus: 'Exported', whatsappStatus: 'Contacted', commentary: '' },
    { id: 'ORD004', warehouseId: 'WH1', createdAt: '2025-04-29T09:15:00Z', internalStatus: 'Packed', alertReason: null, customerName: 'Amina Kadi', phoneNumber: '551987654', wilaya: 'Algiers', commune: 'Hydra', deliveryType: 'D', productName: 'Laptop Stand', variant: 'Silver', quantity: 1, cogs: 2000, sellingPrice: 3500, note: 'Leave at reception', courier: null, trackingId: null, packageStatus: null, exportStatus: 'Pending Export', whatsappStatus: 'Pending', commentary: '' },
     { id: 'ORD005', warehouseId: 'WH2', createdAt: '2025-04-26T14:00:00Z', internalStatus: 'Returned', alertReason: 'Client Cancelled', customerName: 'Youssef Hamidi', phoneNumber: '662345111', wilaya: 'Oran', commune: 'Bir El Djir', deliveryType: 'D', productName: 'Monitor 24"', variant: 'N/A', quantity: 1, cogs: 18000, sellingPrice: 25000, note: '', courier: 'Maystro', trackingId: 'MA987654321', packageStatus: 'Retourné', exportStatus: 'Exported', whatsappStatus: 'Contacted', commentary: 'Called, client changed mind' },
];

// Helper to get status counts
const getStatusCounts = (orders) => {
    const counts = orders.reduce((acc, order) => {
        acc[order.internalStatus] = (acc[order.internalStatus] || 0) + 1;
        return acc;
    }, {});
    counts.total = orders.length;
    return counts;
};

// Helper to calculate Revenue & Confirmation Rate (Simplified)
const calculateMetrics = (orders) => {
    const deliveredOrders = orders.filter(o => o.internalStatus === 'Delivered');
    const confirmedOrBeyond = orders.filter(o => ['Confirmed', 'Pick Listed', 'Packed', 'Ready to Ship', 'Shipped To Courier', 'Delivered'].includes(o.internalStatus));

    const totalRevenue = deliveredOrders.reduce((sum, order) => sum + (order.sellingPrice || 0), 0);
    const confirmationRate = orders.length > 0 ? (confirmedOrBeyond.length / orders.length) * 100 : 0;

    return {
        totalRevenue,
        confirmationRate,
    };
};


const OrderManagementOverview = () => {
  const [orders, setOrders] = useState(() => {
      // Load orders from localStorage or use initial data
      const savedOrders = localStorage.getItem('cod_orders');
      return savedOrders ? JSON.parse(savedOrders) : initialOrders;
  });
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [dateRange, setDateRange] = useState({ from: new Date(), to: new Date() }); // Default Today
  const { toast } = useToast();


  // Save orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cod_orders', JSON.stringify(orders));
  }, [orders]);

  // Filter orders based on date range
  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      const startOfDay = new Date(dateRange.from.setHours(0, 0, 0, 0));
      const endOfDay = new Date(dateRange.to.setHours(23, 59, 59, 999));

      const filtered = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= startOfDay && orderDate <= endOfDay;
      });
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders); // Show all if no range selected
    }
  }, [dateRange, orders]);


  const handleDateChange = useCallback((newRange) => {
    setDateRange(newRange);
  }, []);

  const handleAddOrder = useCallback((newOrder) => {
     setOrders(prevOrders => [newOrder, ...prevOrders]);
     // No need to call setFilteredOrders here, useEffect will handle it
  }, []);

  const handleUpdateOrder = useCallback((orderId, updates) => {
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, ...updates } : order
        )
      );
       toast({ title: "Order Updated", description: `Order ${orderId} has been updated.` });
  }, [toast]);

  const handleExportOrderCallback = useCallback((orderId, trackingId) => {
      handleUpdateOrder(orderId, { exportStatus: 'Exported', trackingId: trackingId });
  }, [handleUpdateOrder]);

  // Placeholder functions for actions
  const handleExportReport = () => toast({ title: "Export Report", description: "Functionality not implemented yet." });
  const handleBulkSync = () => toast({ title: "Bulk Order Sync", description: "Functionality not implemented yet." });
  const handleImportExportCSV = () => toast({ title: "Import/Export CSV", description: "Functionality not implemented yet." });
   const handleSendWhatsApp = (orderId, phone, name) => {
       toast({ title: "Send WhatsApp", description: `Preparing message for ${name} (${phone}) - Requires configuration.` });
       // Logic for deep linking or API call
       handleUpdateOrder(orderId, { whatsappStatus: 'Contacted' }); // Optimistic update
   };
   const handlePrintLabel = (orderId) => toast({ title: "Print Label", description: `Printing label for order ${orderId} - Requires configuration.` });


  // Calculate metrics based on the currently filtered orders
  const statusCounts = getStatusCounts(filteredOrders);
  const metrics = calculateMetrics(filteredOrders);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-6 space-y-6"
    >
      {/* Header & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-primary">Order Management</h1>
        <div className="flex flex-wrap items-center gap-2">
            <DatePickerWithRange onDateChange={handleDateChange} />
            <Button variant="outline" size="icon" onClick={handleBulkSync} title="Sync Orders"> <RotateCw size={16}/> </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4">
        <SummaryCard title="Total Orders" value={statusCounts.total || 0} />
        <SummaryCard title="Revenue (Delivered)" value={`DA ${metrics.totalRevenue.toLocaleString()}`} />
        <SummaryCard title="Confirm Rate" value={`${metrics.confirmationRate.toFixed(1)}%`} />
        <SummaryCard title="Pending" value={statusCounts['Created'] || 0} />
        <SummaryCard title="Confirmed" value={statusCounts['Confirmed'] || 0} />
        <SummaryCard title="Processing" value={statusCounts['Packed'] || 0} />
        <SummaryCard title="Shipped" value={statusCounts['Shipped To Courier'] || 0} />
      </div>

       {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2">
         <AddOrderForm onOrderAdded={handleAddOrder} />
         <ExportCourierDialog allOrders={orders} onOrdersExported={handleExportOrderCallback} />
         <Button variant="outline" onClick={handleExportReport}> <Download className="mr-2 h-4 w-4"/> Export Report </Button>
         <Button variant="outline" onClick={handleImportExportCSV}> <Upload className="mr-2 h-4 w-4"/> Import/Export CSV </Button>
         {/* Add Bulk Action Dropdown Here Later */}
      </div>


      {/* Orders Table */}
      <OrdersTable
          orders={filteredOrders}
          onUpdateOrder={handleUpdateOrder}
          onExportOrder={(orderId) => toast({ title: "Export Single Order", description: `Trigger export for ${orderId}` })} // Replace with actual logic if needed differently
          onSendWhatsApp={handleSendWhatsApp}
          onPrintLabel={handlePrintLabel}
        />

    </motion.div>
  );
};

// Small helper component for summary cards
const SummaryCard = ({ title, value }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-card p-4 rounded-lg shadow-md border border-border text-center transition-transform duration-200"
    >
        <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
        <p className="text-xl md:text-2xl font-bold text-primary">{value}</p>
    </motion.div>
);

export default OrderManagementOverview;
