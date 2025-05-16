import React from 'react';
import OrderManagementOverview from './Overview';

export default function CancelledOrders() {
  return <OrderManagementOverview filterStatus="Cancelled" />;
}
