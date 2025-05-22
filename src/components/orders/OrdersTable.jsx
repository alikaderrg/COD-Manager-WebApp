import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { MoreHorizontal, MessageSquare, Printer, Edit2 } from 'lucide-react';
import DeliveryDropdown from '@/components/DeliveryDropdown';
import EmptyOrderTable from './EmptyOrderTable';
import StatusBadge from './StatusBadge';

const confirmationStatuses = ['Created', 'Alerted', 'Confirmed', 'Cancelled', 'Deleted'];
const alertReasons = ['No response', 'Unreachable', 'Faux number', 'Waiting client response'];
const cancelReasons = ['Client cancelled', 'Already ordered', 'Price conflict', 'Client unavailable', 'Client on the move'];

const OrdersTable = ({ orders = [], onUpdateOrder, onExportOrder, onSendWhatsApp, onPrintLabel }) => {
  const [selectedRows, setSelectedRows] = useState(new Set());

  const handleSelectAll = (event) => {
    const allIds = new Set(orders.map((order) => order.id));
    setSelectedRows(event.target.checked ? allIds : new Set());
  };

  const handleSelectRow = (orderId) => {
    const updated = new Set(selectedRows);
    updated.has(orderId) ? updated.delete(orderId) : updated.add(orderId);
    setSelectedRows(updated);
  };

  const handleStatusChange = (orderId, status, reason = null) => {
    onUpdateOrder(orderId, {
      confirmationStatus: status,
      alertReason: status === 'Alerted' ? reason : null,
      cancelReason: status === 'Cancelled' ? reason : null,
    });
  };

  return (
    <div className="overflow-x-auto">
      {orders.length === 0 ? (
        <EmptyOrderTable columns="default" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead><Checkbox onChange={handleSelectAll} /></TableHead>
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
            {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell><Checkbox checked={selectedRows.has(order.id)} onChange={() => handleSelectRow(order.id)} /></TableCell>
              <TableCell>{order.id}</TableCell>
              <TableCell>{format(new Date(order.createdAt), 'Pp')}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm"><StatusBadge status={order.confirmationStatus} /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                    <DropdownMenuRadioGroup value={order.confirmationStatus} onValueChange={(newStatus) => handleStatusChange(order.id, newStatus)}>
                      {confirmationStatuses.map((status) => (
                        <DropdownMenuRadioItem key={status} value={status}>{status}</DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                    {order.confirmationStatus === 'Alerted' && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>Alert Reason</DropdownMenuSubTrigger>
                          <DropdownMenuSubContent>
                            {alertReasons.map(reason => (
                              <DropdownMenuItem key={reason} onClick={() => handleStatusChange(order.id, 'Alerted', reason)}>{reason}</DropdownMenuItem>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                      </>
                    )}
                    {order.confirmationStatus === 'Cancelled' && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>Cancel Reason</DropdownMenuSubTrigger>
                          <DropdownMenuSubContent>
                            {cancelReasons.map(reason => (
                              <DropdownMenuItem key={reason} onClick={() => handleStatusChange(order.id, 'Cancelled', reason)}>{reason}</DropdownMenuItem>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
                {order.alertReason && order.confirmationStatus === 'Alerted' && (
                  <div className="text-xs text-yellow-500">({order.alertReason})</div>
                )}
                {order.cancelReason && order.confirmationStatus === 'Cancelled' && (
                  <div className="text-xs text-red-500">({order.cancelReason})</div>
                )}
              </TableCell>
              <TableCell>{order.warehouseStatus || '-'}</TableCell>
              <TableCell>{order.courierStatus || '-'}</TableCell>
              <TableCell>{order.trackingId || '-'}</TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell>{order.phoneNumber}</TableCell>
              <TableCell>{order.productName}</TableCell>
              <TableCell>{order.quantity}</TableCell>
              <TableCell>{order.sellingPrice}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Badge variant={order.exportStatus === 'Exported' ? 'confirmed' : 'outline'}>{order.exportStatus}</Badge>
                  {order.confirmationStatus === 'Confirmed' && order.exportStatus !== 'Exported' && (
                    <DeliveryDropdown
                      orderId={order.id}
                      onExport={(companyId, orderId) => {
                        const trackingId = `TRK-${Math.floor(Math.random() * 1000000)}`;
                        onExportOrder(orderId, trackingId);
                      }}
                    />
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" onClick={() => onSendWhatsApp(order.id, order.phoneNumber, order.customerName)}>
                  <MessageSquare size={16} />
                </Button>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon"><MoreHorizontal size={16} /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onPrintLabel(order.id)} disabled={!order.trackingId}>
                      <Printer className="mr-2 h-4 w-4" />
                      Print Label
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onExportOrder(order.id, `TRK-${Math.floor(Math.random() * 1000000)}`)}>
                      <Edit2 className="mr-2 h-4 w-4" />
                      Edit Order
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      )}
    </div>
  );
};

export default OrdersTable;
