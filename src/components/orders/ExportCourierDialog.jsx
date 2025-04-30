
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area"; // Now exists
import { useToast } from "@/components/ui/use-toast";
import { ExternalLink } from 'lucide-react';
import StatusBadge from './StatusBadge';

// Mock Function to get orders eligible for export (Confirmed or Packed)
// In reality, this would likely filter the main orders list based on status
const getExportableOrders = (allOrders) => {
    return allOrders.filter(order =>
        (order.internalStatus === 'Confirmed' || order.internalStatus === 'Packed') && order.exportStatus !== 'Exported'
    );
};


const ExportCourierDialog = ({ allOrders = [], onOrdersExported }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [exportableOrders, setExportableOrders] = useState([]);
  const [pendingExport, setPendingExport] = useState([]);
  const [exportedList, setExportedList] = useState([]); // Orders successfully exported in this session
  const [trackingInputs, setTrackingInputs] = useState({});
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      const ordersToExport = getExportableOrders(allOrders);
      setExportableOrders(ordersToExport);
      setPendingExport(ordersToExport.map(o => o.id)); // Initially, all are pending
      setExportedList([]);
      setTrackingInputs({}); // Reset inputs on open
    }
  }, [isOpen, allOrders]);

  const handleTrackingChange = (orderId, trackingId) => {
    setTrackingInputs(prev => ({ ...prev, [orderId]: trackingId }));
  };

  const handleExportOrder = (orderId) => {
      const trackingId = trackingInputs[orderId];
      if (!trackingId) {
          toast({ title: "Missing Tracking ID", description: `Please enter a tracking ID for order ${orderId}.`, variant: "destructive" });
          return;
      }

      // --- Placeholder for actual API call to courier ---
      console.log(`Exporting Order ${orderId} with Tracking ID: ${trackingId}`);
      // --- End Placeholder ---

      // Simulate successful export
      setPendingExport(prev => prev.filter(id => id !== orderId));
      setExportedList(prev => [...prev, orderId]);
      toast({ title: "Order Exported", description: `Order ${orderId} marked as exported.` });

      // Update the main order list (via callback)
      if (onOrdersExported) {
          onOrdersExported(orderId, trackingId);
      }
  };

  const handleBulkExport = () => {
     let successCount = 0;
     let failCount = 0;
     pendingExport.forEach(orderId => {
        const trackingId = trackingInputs[orderId];
        if (trackingId) {
             // --- Placeholder for actual API call ---
             console.log(`Bulk Exporting Order ${orderId} with Tracking ID: ${trackingId}`);
             // --- End Placeholder ---
             successCount++;
             setExportedList(prev => [...prev, orderId]);
             if (onOrdersExported) {
                onOrdersExported(orderId, trackingId);
             }
        } else {
            failCount++;
        }
     });

     setPendingExport([]); // Clear pending list after attempt

     if (successCount > 0) {
        toast({ title: "Bulk Export Complete", description: `${successCount} orders exported.` });
     }
     if (failCount > 0) {
         toast({ title: "Bulk Export Incomplete", description: `${failCount} orders skipped due to missing tracking IDs.`, variant: "destructive" });
     }
  }

  const renderOrderList = (orderIds, title) => (
    <div className="mb-4">
        <h4 className="font-semibold mb-2 text-sm">{title} ({orderIds.length})</h4>
         <ScrollArea className="h-40 border rounded-md p-2">
         <div className="space-y-2">
            {orderIds.length > 0 ? orderIds.map(orderId => {
                const order = exportableOrders.find(o => o.id === orderId);
                if (!order) return null;
                const isPending = pendingExport.includes(orderId);
                return (
                <div key={orderId} className="flex items-center justify-between text-xs p-1 bg-muted/50 rounded">
                    <span>ID: {order.id} ({order.customerName})</span>
                    {isPending ? (
                        <div className="flex items-center gap-1">
                             <Input
                                type="text"
                                placeholder="Tracking ID"
                                className="h-6 text-xs w-24"
                                value={trackingInputs[orderId] || ''}
                                onChange={(e) => handleTrackingChange(orderId, e.target.value)}
                             />
                            <Button size="sm" variant="outline" className="h-6 px-1.5" onClick={() => handleExportOrder(orderId)} title="Export This Order">
                                <ExternalLink size={12}/>
                            </Button>
                        </div>
                    ) : (
                       <span className="text-green-600 font-medium">Exported ({trackingInputs[orderId]})</span>
                    )}
                </div>
                );
            }) : <p className="text-xs text-muted-foreground">No orders in this list.</p>}
        </div>
         </ScrollArea>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
            <ExternalLink className="mr-2 h-4 w-4" /> Export to Courier
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Export Orders to Courier</DialogTitle>
          <DialogDescription>
            Enter tracking IDs and export confirmed/packed orders.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 max-h-[60vh] overflow-y-auto">
            {renderOrderList(pendingExport, "Pending Export")}
            {renderOrderList(exportedList, "Exported in this Session")}
        </div>
        <DialogFooter>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>Close</Button>
            <Button onClick={handleBulkExport} disabled={pendingExport.length === 0}>
                Export All Pending
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportCourierDialog;
