import React from 'react';
import OrderManagementOverview from './Overview';

export default function AlertedOrders() {
  return <OrderManagementOverview filterStatus="Alerted" />;
}
