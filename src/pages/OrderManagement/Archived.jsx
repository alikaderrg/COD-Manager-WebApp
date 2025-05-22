import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EmptyOrderTable from '@/components/orders/EmptyOrderTable';

export default function Deleted() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDeletedOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/orders?status=Deleted`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data.orders || []);
      } catch (err) {
        setError('Failed to load created orders');
      } finally {
        setLoading(false);
      }
    };

    fetchDeletedOrders();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4 text-purple-700">Cancelled Orders</h2>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : orders.length === 0 ? (
        <EmptyOrderTable columns="simple" />
      ) : (
        <OrderTable orders={orders} />
      )}
    </div>
  );
}

const OrderTable = ({ orders }) => (
  <div className="overflow-x-auto">
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
        {orders.map((order) => (
          <tr key={order.id} className="border-b hover:bg-purple-50">
            <td className="py-2 px-4">{order.id}</td>
            <td className="py-2 px-4">{order.customerName}</td>
            <td className="py-2 px-4">{order.phoneNumber}</td>
            <td className="py-2 px-4">{order.sellingPrice}</td>
            <td className="py-2 px-4 text-green-600 font-medium">
              {order.confirmationStatus}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
