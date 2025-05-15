import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function EditOrderModal({ order, onSave, onClose }) {
  const [formData, setFormData] = useState({ ...order });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Order: {order.id}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <Input name="customerName" label="Customer Name" value={formData.customerName} onChange={handleChange} placeholder="Customer Name" />
            <Input name="phoneNumber" label="Phone Number" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone" />
            <Input name="wilaya" label="Wilaya" value={formData.wilaya} onChange={handleChange} placeholder="Wilaya" />
            <Input name="commune" label="Commune" value={formData.commune} onChange={handleChange} placeholder="Commune" />
            <Input name="deliveryType" label="Delivery Type" value={formData.deliveryType} onChange={handleChange} placeholder="D or SD" />
            <Input name="productName" label="Product" value={formData.productName} onChange={handleChange} placeholder="Product Name" />
            <Input name="variant" label="Variant" value={formData.variant} onChange={handleChange} placeholder="Variant" />
            <Input name="quantity" type="number" label="Qty" value={formData.quantity} onChange={handleChange} />
            <Input name="cogs" type="number" label="COGS" value={formData.cogs} onChange={handleChange} />
            <Input name="sellingPrice" type="number" label="Selling Price" value={formData.sellingPrice} onChange={handleChange} />
          </div>
          <Textarea name="note" value={formData.note} onChange={handleChange} placeholder="Order note (optional)" />
          <Textarea name="commentary" value={formData.commentary} onChange={handleChange} placeholder="Internal commentary (optional)" />
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
