
import React, { useState } from 'react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { PlusCircle } from 'lucide-react';

// Mock data - replace with actual data fetched from backend/settings
const wilayas = ["Algiers", "Oran", "Constantine", "Annaba"];
const communes = {
    "Algiers": ["Alger Centre", "Bab Ezzouar", "Hydra"],
    "Oran": ["Oran Ville", "Bir El Djir", "Es Senia"],
    "Constantine": ["Constantine Ville", "El Khroub", "Hamma Bouziane"],
    "Annaba": ["Annaba Ville", "El Bouni", "Sidi Amar"]
};

const AddOrderForm = ({ onOrderAdded }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedWilaya, setSelectedWilaya] = useState('');
  const [selectedCommune, setSelectedCommune] = useState('');
  const [deliveryType, setDeliveryType] = useState('D'); // Default to Domicile
  const [total, setTotal] = useState('');
  const { toast } = useToast();

  const resetForm = () => {
      setCustomerName('');
      setPhoneNumber('');
      setSelectedWilaya('');
      setSelectedCommune('');
      setDeliveryType('D');
      setTotal('');
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic Validation
    if (!customerName || !phoneNumber || !selectedWilaya || !selectedCommune || !total) {
        toast({
            title: "Missing Information",
            description: "Please fill all required fields.",
            variant: "destructive",
        });
        return;
    }

    const newOrder = {
      id: `MANUAL-${Date.now()}`, // Simple unique ID for manual orders
      createdAt: new Date().toISOString(),
      internalStatus: 'Created', // Default status
      alertReason: null,
      customerName,
      phoneNumber,
      wilaya: selectedWilaya,
      commune: selectedCommune,
      deliveryType,
      productName: 'Manual Entry Product', // Placeholder
      variant: 'N/A', // Placeholder
      quantity: 1, // Placeholder
      cogs: 0, // Placeholder - should ideally come from product selection
      sellingPrice: parseFloat(total) || 0,
      note: '', // Placeholder
      courier: null,
      trackingId: null,
      packageStatus: null,
      exportStatus: 'Pending Export',
      whatsappStatus: 'Pending',
      commentary: '',
      // Add other necessary fields with default/null values
    };

    // Call the callback function passed from the parent
    if (onOrderAdded) {
        onOrderAdded(newOrder);
    }

    toast({
        title: "Order Added",
        description: `Order for ${customerName} created successfully.`,
    });

    resetForm();
    setIsOpen(false); // Close the dialog
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Order
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Manual Order</DialogTitle>
          <DialogDescription>
            Enter the details for the new order. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                Name
                </Label>
                <Input id="name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="col-span-3" placeholder="Customer's Full Name" required/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                Phone
                </Label>
                <Input id="phone" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="col-span-3" placeholder="e.g., 5xxxxxxxx" required/>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="wilaya" className="text-right">
                Wilaya
                </Label>
                 <Select value={selectedWilaya} onValueChange={setSelectedWilaya} required>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select Wilaya" />
                    </SelectTrigger>
                    <SelectContent>
                        {wilayas.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="commune" className="text-right">
                Commune
                </Label>
                 <Select value={selectedCommune} onValueChange={setSelectedCommune} disabled={!selectedWilaya} required>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select Commune" />
                    </SelectTrigger>
                    <SelectContent>
                        {(communes[selectedWilaya] || []).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="deliveryType" className="text-right">
                Delivery
                </Label>
                 <Select value={deliveryType} onValueChange={setDeliveryType} required>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="D">Domicile (D)</SelectItem>
                        <SelectItem value="SD">Stopdesk (SD)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="total" className="text-right">
                Total (DA)
                </Label>
                <Input id="total" type="number" value={total} onChange={(e) => setTotal(e.target.value)} className="col-span-3" placeholder="Order total amount" required/>
            </div>
            {/* Add Product/Variant/Quantity fields later for more complexity */}
            </div>
            <DialogFooter>
            <Button type="submit">Save Order</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddOrderForm;
