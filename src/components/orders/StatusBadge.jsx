
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusVariantMap = {
    'Created': 'created',
    'No Response': 'no_response',
    'Injoignable': 'injoignable',
    'Faux numéro': 'faux_numero',
    'Confirmed': 'confirmed',
    'Pick Listed': 'pick_listed',
    'Packed': 'packed',
    'Ready to Ship': 'ready_to_ship',
    'Shipped To Courier': 'shipped_to_courier',
    'Delivered': 'delivered',
    'Returned': 'returned',
    'Cancelled': 'cancelled',
    'Deleted': 'deleted',
    // Add other statuses from your list
};

const StatusBadge = ({ status, className }) => {
  const variant = statusVariantMap[status] || 'default';
  return (
    <Badge variant={variant} className={cn("capitalize", className)}>
      {status?.replace(/_/g, ' ') || 'Unknown'}
    </Badge>
  );
};

export default StatusBadge;

