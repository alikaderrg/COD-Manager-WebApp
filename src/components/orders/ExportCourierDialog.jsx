import React, { useMemo, useState } from 'react';
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
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const headers = {
  Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
};

export default function ExportCourierDialog({ allOrders = [], onOrdersExported }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const pendingExport = useMemo(
    () => allOrders.filter(o => o.exportStatus !== 'Exported' && ['Confirmed', 'Packed'].includes(o.confirmationStatus)),
    [allOrders]
  );

  const exportedThisSession = useMemo(
    () => allOrders.filter(o => o.exportStatus === 'Exported'),
    [allOrders]
  );

  const handleExportAll = async () => {
    if (!pendingExport.length) return;
    setLoading(true);

    try {
      const response = await axios.post(
        `${baseURL}/api/courier/export`,
        { orders: pendingExport },
        { headers }
      );

      const updatedOrders = response.data.updated || [];

      updatedOrders.forEach(order => {
        if (order.id && order.trackingId) {
          onOrdersExported(order.id, order.trackingId);
        }
      });

      toast({ title: '✅ Orders Exported', description: `${updatedOrders.length} orders exported to courier.` });
      setOpen(false);
    } catch (err) {
      toast({ title: '❌ Export Failed', description: err.response?.data?.error || err.message });
    } finally {
      setLoading(false);
    }
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
            <Button onClick={handleExportAll} disabled={loading || pendingExport.length === 0}>
              {loading ? 'Exporting...' : 'Export All Pending'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
