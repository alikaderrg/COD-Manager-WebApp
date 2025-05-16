import React from 'react';
import OrderManagementOverview from './Overview';

export default function DeletedOrders() {
  return <OrderManagementOverview filterStatus="Deleted" />;
}
