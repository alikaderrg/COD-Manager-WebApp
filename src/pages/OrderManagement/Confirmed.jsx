import React from 'react';
import OrderManagementOverview from './Overview';

export default function ConfirmedOrders() {
  return <OrderManagementOverview filterStatus="Confirmed" />;
}
