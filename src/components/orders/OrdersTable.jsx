
import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import StatusBadge from './StatusBadge';
import { Badge } from '@/components/ui/badge'; // Added missing import
import { format } from 'date-fns';
import { MoreHorizontal, MessageSquare, Printer, ExternalLink, ChevronLeft, ChevronRight, Edit2 } from 'lucide-react';

const internalStatuses = [
    "Created", "No Response", "Injoignable", "Faux numéro", "Confirmed",
    "Pick Listed", "Packed", "Ready to Ship", "Shipped To Courier",
    "Delivered", "Returned", "Cancelled", "Deleted"
];
const alertReasons = ["No Response", "Injoignable", "Faux numéro", "Client Cancelled"]; // Example reasons
const couriers = ["ZR Express", "Maystro", "Yalidine", "Noest Express"]; // Example couriers

const OrdersTable = ({ orders = [], onUpdateOrder, onExportOrder, onSendWhatsApp, onPrintLabel }) => {
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelecteds = new Set(paginatedOrders.map((order) => order.id));
      setSelectedRows(newSelecteds);
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (orderId) => {
    const newSelecteds = new Set(selectedRows);
    if (newSelecteds.has(orderId)) {
      newSelecteds.delete(orderId);
    } else {
      newSelecteds.add(orderId);
    }
    setSelectedRows(newSelecteds);
  };

  const handleStatusChange = (orderId, newStatus, alertReason = null) => {
      onUpdateOrder(orderId, { internalStatus: newStatus, alertReason: alertReason });
  };

  const handleCourierChange = (orderId, newCourier) => {
      onUpdateOrder(orderId, { courier: newCourier });
  };

  // Pagination Logic
  const totalPages = Math.ceil(orders.length / rowsPerPage);
  const paginatedOrders = useMemo(() => {
     const startIndex = (currentPage - 1) * rowsPerPage;
     const endIndex = startIndex + rowsPerPage;
     return orders.slice(startIndex, endIndex);
  }, [orders, currentPage, rowsPerPage]);

  const handlePreviousPage = () => {
      setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
      setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Placeholder for editable fields - requires more complex state management
  const handleFieldEdit = (orderId, field, value) => {
    console.log(`Editing ${field} for order ${orderId} to ${value}`);
    // Ideally, open a modal or inline editor and call onUpdateOrder on save
    alert(`Editing ${field} is not fully implemented yet.`);
  };


  return (
    <div className="w-full">
      <div className="rounded-md border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead padding="checkbox">
                <Checkbox
                  indeterminate={selectedRows.size > 0 && selectedRows.size < paginatedOrders.length}
                  checked={selectedRows.size === paginatedOrders.length && paginatedOrders.length > 0}
                  onChange={handleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Internal Status</TableHead>
              <TableHead>Customer's Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Wilaya</TableHead>
              <TableHead>Commune</TableHead>
              <TableHead>Delivery Type</TableHead>
              <TableHead>Product</TableHead>
              {/* <TableHead>Variant</TableHead> */}
              <TableHead>Quantity</TableHead>
              <TableHead>COGS</TableHead>
              <TableHead>Selling Price</TableHead>
              {/* <TableHead>Note</TableHead> */}
              <TableHead>Courier</TableHead>
              <TableHead>Tracking ID</TableHead>
              <TableHead>Pkg Status</TableHead>
              <TableHead>Export Status</TableHead>
              <TableHead>WhatsApp</TableHead>
              {/* <TableHead>Commentary</TableHead> */}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOrders.length > 0 ? (
              paginatedOrders.map((order) => (
                <TableRow
                  key={order.id}
                  data-state={selectedRows.has(order.id) ? 'selected' : undefined}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedRows.has(order.id)}
                      onChange={() => handleSelectRow(order.id)}
                      aria-label={`Select row ${order.id}`}
                    />
                  </TableCell>
                  <TableCell className="text-xs font-medium">{order.id}</TableCell>
                  <TableCell className="text-xs">{format(new Date(order.createdAt), 'Pp')}</TableCell>
                  <TableCell>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <Button variant="ghost" size="sm" className="p-0 h-auto">
                              <StatusBadge status={order.internalStatus} />
                           </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                           <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                            <DropdownMenuRadioGroup value={order.internalStatus} onValueChange={(newStatus) => handleStatusChange(order.id, newStatus)}>
                                {internalStatuses.map((status) => (
                                    <DropdownMenuRadioItem key={status} value={status}>
                                        <StatusBadge status={status} className="mr-2"/> {status}
                                    </DropdownMenuRadioItem>
                                ))}
                            </DropdownMenuRadioGroup>
                             {/* Submenu for Alert Reasons */}
                              <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                  Set Alert Reason
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent>
                                   <DropdownMenuRadioGroup value={order.alertReason || ''} onValueChange={(reason) => handleStatusChange(order.id, order.internalStatus, reason)}>
                                        {alertReasons.map((reason) => (
                                        <DropdownMenuRadioItem key={reason} value={reason}>{reason}</DropdownMenuRadioItem>
                                        ))}
                                         <DropdownMenuSeparator />
                                         <DropdownMenuRadioItem value={null}>Clear Reason</DropdownMenuRadioItem>
                                   </DropdownMenuRadioGroup>
                                </DropdownMenuSubContent>
                              </DropdownMenuSub>
                        </DropdownMenuContent>
                     </DropdownMenu>
                      {order.alertReason && <div className="text-xs text-red-500 mt-1">({order.alertReason})</div>}
                  </TableCell>
                  <TableCell className="text-xs">{order.customerName}</TableCell>
                  <TableCell className="text-xs">{order.phoneNumber}</TableCell>
                  <TableCell className="text-xs">{order.wilaya}</TableCell>
                  <TableCell className="text-xs">{order.commune}</TableCell>
                  <TableCell className="text-xs">{order.deliveryType}</TableCell>
                  <TableCell className="text-xs truncate max-w-[100px]">{order.productName}</TableCell>
                  {/* <TableCell className="text-xs">{order.variant}</TableCell> */}
                  <TableCell className="text-xs text-center">{order.quantity}</TableCell>
                  <TableCell className="text-xs text-right">{order.cogs?.toFixed(2) ?? 'N/A'}</TableCell>
                  <TableCell className="text-xs text-right font-semibold">{order.sellingPrice?.toFixed(2)}</TableCell>
                  {/* <TableCell className="text-xs truncate max-w-[100px]">{order.note}</TableCell> */}
                  <TableCell>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <Button variant="outline" size="sm" className="text-xs h-7 px-2">
                             {order.courier || 'Select'}
                           </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuRadioGroup value={order.courier || ''} onValueChange={(newCourier) => handleCourierChange(order.id, newCourier)}>
                                {couriers.map((courier) => (
                                    <DropdownMenuRadioItem key={courier} value={courier}>{courier}</DropdownMenuRadioItem>
                                ))}
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioItem value={null}>Clear Courier</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  </TableCell>
                  <TableCell className="text-xs">{order.trackingId || '-'}</TableCell>
                  <TableCell className="text-xs">
                    {order.packageStatus ? <StatusBadge status={order.packageStatus} /> : '-'}
                  </TableCell>
                  <TableCell>
                     <Badge variant={order.exportStatus === 'Exported' ? 'confirmed' : 'outline'} className="text-xs">
                        {order.exportStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                     <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onSendWhatsApp(order.id, order.phoneNumber, order.customerName)}>
                        <MessageSquare size={16} className={order.whatsappStatus === 'Contacted' ? 'text-green-500' : 'text-muted-foreground'}/>
                     </Button>
                  </TableCell>
                   {/* <TableCell className="text-xs truncate max-w-[100px]">{order.commentary}</TableCell> */}
                   <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleFieldEdit(order.id, 'details', {})}>
                          <Edit2 className="mr-2 h-4 w-4" /> Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onExportOrder(order.id)} disabled={order.exportStatus === 'Exported'}>
                          <ExternalLink className="mr-2 h-4 w-4" /> Export Order
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onPrintLabel(order.id)} disabled={order.exportStatus !== 'Exported' || !order.trackingId}>
                          <Printer className="mr-2 h-4 w-4" /> Print Label
                        </DropdownMenuItem>
                         <DropdownMenuItem onClick={() => onSendWhatsApp(order.id, order.phoneNumber, order.customerName)}>
                          <MessageSquare className="mr-2 h-4 w-4" /> Send WhatsApp
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                         <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                           Delete Order
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={18} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
       {/* Pagination Controls */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages} ({orders.length} total orders)
        </div>
        <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
        >
            <ChevronLeft className="h-4 w-4 mr-1"/> Previous
        </Button>
        <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
        >
            Next <ChevronRight className="h-4 w-4 ml-1"/>
        </Button>
       </div>
    </div>
  );
};

export default OrdersTable;
