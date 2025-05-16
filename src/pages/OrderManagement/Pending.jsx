import React from 'react';
import OrderManagementOverview from './Overview';

export default function PendingOrders() {
  return <OrderManagementOverview filterStatus="Created" />;
}
