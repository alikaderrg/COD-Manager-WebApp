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
import { Badge } from '@/components/ui/badge';
import StatusBadge from './StatusBadge';
import { format } from 'date-fns';
import { MoreHorizontal, MessageSquare, Printer, ExternalLink, ChevronLeft, ChevronRight, Edit2, Save } from 'lucide-react';
import EditOrderModal from './EditOrderModal'; // You'll need to create this component

const internalStatuses = [
  "Created", "Confirmed","Cancelled", "Deleted"
];
const alertReasons = ["No Response", "Injoignable", "Faux numéro", "Client Cancelled"];
const couriers = ["ZR Express", "Maystro", "Yalidine", "Noest Express"];

const OrdersTable = ({ orders = [], onUpdateOrder, onExportOrder, onSendWhatsApp, onPrintLabel }) => {
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [editingOrder, setEditingOrder] = useState(null);
  const rowsPerPage = 20;

  const totalPages = Math.ceil(orders.length / rowsPerPage);
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return orders.slice(startIndex, startIndex + rowsPerPage);
  }, [orders, currentPage]);

  const handleSelectAll = (e) => {
    setSelectedRows(e.target.checked ? new Set(paginatedOrders.map(o => o.id)) : new Set());
  };

  const handleSelectRow = (id) => {
    const updated = new Set(selectedRows);
    updated.has(id) ? updated.delete(id) : updated.add(id);
    setSelectedRows(updated);
  };

  const handleStatusChange = (id, status, reason = null) => {
    onUpdateOrder(id, { internalStatus: status, alertReason: reason });
  };

  const handleCourierChange = (id, courier) => {
    onUpdateOrder(id, { courier });
  };

  return (
    <div className="w-full">
      <div className="rounded-md border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead><Checkbox checked={selectedRows.size === paginatedOrders.length} onChange={handleSelectAll} /></TableHead>
              {['ID', 'Created At', 'Warehouse', 'Internal Status', 'Customer', 'Phone', 'Wilaya', 'Commune', 'Delivery Type', 'Product', 'Variant', 'Qty', 'COGS', 'Price', 'Note', 'Courier', 'Tracking ID', 'Courier Status', 'Export', 'WhatsApp', 'Commentary', 'Actions'].map(h => <TableHead key={h}>{h}</TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOrders.map(order => (
              <TableRow key={order.id}>
                <TableCell><Checkbox checked={selectedRows.has(order.id)} onChange={() => handleSelectRow(order.id)} /></TableCell>
                <TableCell className="text-xs">{order.id}</TableCell>
                <TableCell className="text-xs">{format(new Date(order.createdAt), 'Pp')}</TableCell>
                <TableCell className="text-xs">{order.warehouseId}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="p-0 h-auto"><StatusBadge status={order.internalStatus} /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                      <DropdownMenuRadioGroup value={order.internalStatus} onValueChange={(s) => handleStatusChange(order.id, s)}>
                        {internalStatuses.map(s => <DropdownMenuRadioItem key={s} value={s}>{s}</DropdownMenuRadioItem>)}
                      </DropdownMenuRadioGroup>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Alert Reason</DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          <DropdownMenuRadioGroup value={order.alertReason || ''} onValueChange={(r) => handleStatusChange(order.id, order.internalStatus, r)}>
                            {alertReasons.map(r => <DropdownMenuRadioItem key={r} value={r}>{r}</DropdownMenuRadioItem>)}
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioItem value={null}>Clear</DropdownMenuRadioItem>
                          </DropdownMenuRadioGroup>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell className="text-xs cursor-pointer" onClick={() => setEditingOrder(order)}>{order.customerName}</TableCell>
                <TableCell className="text-xs cursor-pointer" onClick={() => setEditingOrder(order)}>{order.phoneNumber}</TableCell>
                <TableCell className="text-xs cursor-pointer" onClick={() => setEditingOrder(order)}>{order.wilaya}</TableCell>
                <TableCell className="text-xs cursor-pointer" onClick={() => setEditingOrder(order)}>{order.commune}</TableCell>
                <TableCell className="text-xs cursor-pointer" onClick={() => setEditingOrder(order)}>{order.deliveryType}</TableCell>
                <TableCell className="text-xs truncate max-w-[100px]">{order.productName}</TableCell>
                <TableCell className="text-xs">{order.variant}</TableCell>
                <TableCell className="text-xs text-center">{order.quantity}</TableCell>
                <TableCell className="text-xs text-right">{order.cogs}</TableCell>
                <TableCell className="text-xs text-right font-semibold">{order.sellingPrice}</TableCell>
                <TableCell className="text-xs">{order.note}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="text-xs h-7 px-2">{order.courier || 'Select'}</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuRadioGroup value={order.courier || ''} onValueChange={(c) => handleCourierChange(order.id, c)}>
                        {couriers.map(c => <DropdownMenuRadioItem key={c} value={c}>{c}</DropdownMenuRadioItem>)}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell className="text-xs">{order.trackingId}</TableCell>
                <TableCell className="text-xs">{order.packageStatus || '-'}</TableCell>
                <TableCell><Badge variant={order.exportStatus === 'Exported' ? 'confirmed' : 'outline'} className="text-xs">{order.exportStatus}</Badge></TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onSendWhatsApp(order.id, order.phoneNumber, order.customerName)}>
                    <MessageSquare size={16} className={order.whatsappStatus === 'Contacted' ? 'text-green-500' : 'text-muted-foreground'} />
                  </Button>
                </TableCell>
                <TableCell className="text-xs">{order.commentary}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingOrder(order)}><Edit2 className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onExportOrder(order.id)} disabled={order.exportStatus === 'Exported'}><ExternalLink className="mr-2 h-4 w-4" /> Export</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onPrintLabel(order.id)} disabled={!order.trackingId}><Printer className="mr-2 h-4 w-4" /> Print</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end items-center gap-2 p-4">
        <span className="text-sm">Page {currentPage} of {totalPages}</span>
        <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}><ChevronLeft className="w-4 h-4 mr-1" />Prev</Button>
        <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}>Next<ChevronRight className="w-4 h-4 ml-1" /></Button>
      </div>

      {editingOrder && (
        <EditOrderModal
          order={editingOrder}
          onSave={(updated) => {
            onUpdateOrder(editingOrder.id, updated);
            setEditingOrder(null);
          }}
          onClose={() => setEditingOrder(null)}
        />
      )}
    </div>
  );
};

export default OrdersTable;
