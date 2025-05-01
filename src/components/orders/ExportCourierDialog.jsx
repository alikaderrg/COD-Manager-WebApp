import React, { useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ExportCourierDialog({ allOrders = [], onOrdersExported }) {
  const [open, setOpen] = React.useState(false);

  const pendingExport = useMemo(
    () => allOrders.filter(o => o.exportStatus !== 'Exported' && ['Confirmed', 'Packed'].includes(o.internalStatus)),
    [allOrders]
  );

  const exportedThisSession = useMemo(
    () => allOrders.filter(o => o.exportStatus === 'Exported'),
    [allOrders]
  );

  const handleExportAll = () => {
    pendingExport.forEach(order => {
      // Simulate fetching tracking ID from courier API here
      const fakeTrackingId = `TRK${Math.floor(Math.random() * 1000000)}`;
      onOrdersExported(order.id, fakeTrackingId);
    });
    setOpen(false);
  };

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>Export to Courier</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Export Orders to Courier</DialogTitle>
            <p className="text-sm text-muted-foreground">This will automatically assign tracking IDs from courier system.</p>
          </DialogHeader>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            <div>
              <h4 className="text-sm font-medium mb-2">Pending Export ({pendingExport.length})</h4>
              {pendingExport.length > 0 ? (
                <ul className="space-y-2">
                  {pendingExport.map((order) => (
                    <li key={order.id} className="flex items-center justify-between border rounded px-3 py-2 bg-muted">
                      <span className="text-sm">ID: <strong>{order.id}</strong> ({order.customerName})</span>
                      <Badge variant="secondary">Will fetch tracking ID</Badge>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No orders pending export.</p>
              )}
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Exported in this Session ({exportedThisSession.length})</h4>
              {exportedThisSession.length > 0 ? (
                <ul className="space-y-2">
                  {exportedThisSession.map((order) => (
                    <li key={order.id} className="flex items-center justify-between border rounded px-3 py-2">
                      <span className="text-sm">{order.id} ({order.customerName})</span>
                      <span className="text-xs text-muted-foreground">{order.trackingId || 'Fetching...'}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No orders in this list.</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
            <Button onClick={handleExportAll} disabled={pendingExport.length === 0}>Export All Pending</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
