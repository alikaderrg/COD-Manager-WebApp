import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';

const EmptyOrderTable = ({ columns = 'default' }) => {
  // Create a sample order for the empty state
  const sampleOrder = {
    id: 'ORD-123456',
    createdAt: new Date(),
    confirmationStatus: 'Pending',
    warehouseStatus: 'Processing',
    courierStatus: 'Waiting',
    trackingId: 'TRK-123456',
    customerName: 'Sample Customer',
    phoneNumber: '+213 555 123456',
    productName: 'Sample Product',
    quantity: 1,
    sellingPrice: 'DA 5,000',
    exportStatus: 'Not Exported'
  };

  // Get the current filter period from localStorage or default to "Today"
  const getCurrentFilterPeriod = () => {
    const storedFilter = localStorage.getItem('orderFilterPeriod');
    return storedFilter || 'Today';
  };

  // Default columns for the main OrdersTable
  if (columns === 'default') {
    return (
      <div className="empty-table-container">
        <div className="blurred-table">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><Checkbox disabled /></TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Confirmation Status</TableHead>
                <TableHead>In-Warehouse Status</TableHead>
                <TableHead>Courier Status</TableHead>
                <TableHead>Tracking ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Export</TableHead>
                <TableHead>WhatsApp</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell><Checkbox disabled /></TableCell>
                <TableCell>{sampleOrder.id}</TableCell>
                <TableCell>{format(sampleOrder.createdAt, 'MMM dd, yyyy')}</TableCell>
                <TableCell>{sampleOrder.confirmationStatus}</TableCell>
                <TableCell>{sampleOrder.warehouseStatus}</TableCell>
                <TableCell>{sampleOrder.courierStatus}</TableCell>
                <TableCell>{sampleOrder.trackingId}</TableCell>
                <TableCell>{sampleOrder.customerName}</TableCell>
                <TableCell>{sampleOrder.phoneNumber}</TableCell>
                <TableCell>{sampleOrder.productName}</TableCell>
                <TableCell>{sampleOrder.quantity}</TableCell>
                <TableCell>{sampleOrder.sellingPrice}</TableCell>
                <TableCell>{sampleOrder.exportStatus}</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className="empty-message">
          No Orders Available ({getCurrentFilterPeriod()})
        </div>
      </div>
    );
  }

  // Simplified columns for other order pages
  return (
    <div className="empty-table-container">
      <div className="blurred-table">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-purple-100 text-purple-800">
            <tr>
              <th className="py-2 px-4 text-left">Order ID</th>
              <th className="py-2 px-4 text-left">Customer</th>
              <th className="py-2 px-4 text-left">Phone</th>
              <th className="py-2 px-4 text-left">Total</th>
              <th className="py-2 px-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2 px-4">{sampleOrder.id}</td>
              <td className="py-2 px-4">{sampleOrder.customerName}</td>
              <td className="py-2 px-4">{sampleOrder.phoneNumber}</td>
              <td className="py-2 px-4">{sampleOrder.sellingPrice}</td>
              <td className="py-2 px-4">{sampleOrder.confirmationStatus}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="empty-message">
        No Orders Available ({getCurrentFilterPeriod()})
      </div>
    </div>
  );
};

export default EmptyOrderTable;
