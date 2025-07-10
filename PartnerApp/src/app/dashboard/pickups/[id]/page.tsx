
'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { mockPickups } from '@/lib/mock-data';
import type { Pickup, ScrapItem } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  User, Phone, MapPin, Calendar, Hash, CheckCircle, PackageCheck, Send, Trash2, PlusCircle, Lightbulb, Bot, CircleDollarSign, Loader
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getPriceSuggestion } from './actions';
import { Separator } from '@/components/ui/separator';

const StatusInfo = ({ status, pickupCode }: { status: Pickup['status'], pickupCode: string }) => {
  const infoMap = {
    SCHEDULED: { icon: Calendar, text: 'This pickup is scheduled. Accept it to proceed.', color: 'bg-gray-500' },
    ACCEPTED: { icon: CheckCircle, text: 'Pickup accepted. Enter the customer\'s code to start.', color: 'bg-blue-500' },
    IN_PROCESS: { icon: PackageCheck, text: 'Pickup in process. Add items and submit for approval.', color: 'bg-yellow-500' },
    PENDING_APPROVAL: { icon: Send, text: 'Waiting for customer approval.', color: 'bg-orange-500' },
    COMPLETED: { icon: CheckCircle, text: 'This pickup has been successfully completed.', color: 'bg-green-500' },
    CANCELLED: { icon: Trash2, text: 'This pickup was cancelled.', color: 'bg-red-500' }
  };
  const currentInfo = infoMap[status];

  return (
    <div className="bg-muted/50 p-4 rounded-lg flex items-center mb-6">
      <div className={`p-2 rounded-full text-white mr-4 ${currentInfo.color}`}>
        <currentInfo.icon className="w-5 h-5" />
      </div>
      <div>
        <p className="font-semibold">{status.replace('_', ' ')}</p>
        <p className="text-sm text-muted-foreground">{currentInfo.text}</p>
        {status === 'IN_PROCESS' && <p className="text-sm text-muted-foreground mt-1">Customer Code: <span className="font-mono bg-muted p-1 rounded">{pickupCode}</span></p>}
      </div>
    </div>
  );
};

export default function PickupDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { toast } = useToast();
  const [pickup, setPickup] = useState<Pickup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pickupCode, setPickupCode] = useState('');
  const [newItem, setNewItem] = useState({ name: '', quantity: '', price: '' });
  const [isSuggestingPrice, setIsSuggestingPrice] = useState(false);

  useEffect(() => {
    const foundPickup = mockPickups.find((p) => p.id === id);
    if (foundPickup) {
        // Create a deep copy to prevent modifying the original mock data
        setPickup(JSON.parse(JSON.stringify(foundPickup)));
    }
    setIsLoading(false);
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-2">
          <Loader className="h-6 w-6 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading pickup details...</p>
        </div>
      </div>
    );
  }

  if (!pickup) {
    return notFound();
  }

  const handleAccept = () => {
    setPickup({ ...pickup, status: 'ACCEPTED' });
    toast({ title: 'Pickup Accepted', description: 'You can now start the pickup process.' });
  };

  const handleStartPickup = () => {
    if (pickupCode === pickup.pickupCode) {
      setPickup({ ...pickup, status: 'IN_PROCESS' });
      toast({ title: 'Pickup Started', description: 'You may now add scrap items.' });
    } else {
      toast({ variant: 'destructive', title: 'Invalid Code', description: 'The pickup code is incorrect.' });
    }
  };
  
  const handleAddItem = () => {
    if (!newItem.name || !newItem.quantity || !newItem.price) {
      toast({ variant: 'destructive', title: 'Missing fields', description: 'Please fill out all item details.' });
      return;
    }
    const newScrapItem: ScrapItem = {
      id: `item-${Date.now()}`,
      name: newItem.name,
      quantity: newItem.quantity,
      price: parseFloat(newItem.price),
    };
    setPickup({ ...pickup, items: [...pickup.items, newScrapItem] });
    setNewItem({ name: '', quantity: '', price: '' });
  };
  
  const handleDeleteItem = (itemId: string) => {
    setPickup({ ...pickup, items: pickup.items.filter(item => item.id !== itemId) });
  };
  
  const handleSubmitForApproval = () => {
    if (pickup.items.length === 0) {
        toast({ variant: 'destructive', title: 'No Items Added', description: 'Please add at least one item before submitting.' });
        return;
    }
    setPickup({ ...pickup, status: 'PENDING_APPROVAL' });
    toast({ title: 'Submitted for Approval', description: 'The customer has been notified.' });
  };

  const handleSuggestPrice = async () => {
    if (!newItem.name) {
      toast({ variant: 'destructive', title: 'Item Name Required', description: 'Please enter an item name to suggest a price.' });
      return;
    }
    setIsSuggestingPrice(true);
    const result = await getPriceSuggestion(newItem.name);
    if (result.success && result.price) {
      setNewItem({ ...newItem, price: result.price.toString() });
      toast({ title: 'Price Suggested!', description: `AI suggested price: $${result.price}` });
    } else {
      toast({ variant: 'destructive', title: 'Suggestion Failed', description: result.error });
    }
    setIsSuggestingPrice(false);
  };

  const totalAmount = pickup.items.reduce((acc, item) => acc + item.price, 0).toFixed(2);

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-2xl">Pickup Details</CardTitle>
            <Badge className="capitalize text-base" variant={pickup.status === 'COMPLETED' ? 'default' : 'secondary'}>{pickup.status.replace('_', ' ').toLowerCase()}</Badge>
          </div>
          <CardDescription>Manage the pickup workflow for {pickup.customer.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <StatusInfo status={pickup.status} pickupCode={pickup.pickupCode} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <div className="flex items-center"><User className="w-4 h-4 mr-3 text-muted-foreground" /> <strong>Customer:</strong> <span className="ml-2">{pickup.customer.name}</span></div>
              <div className="flex items-center"><MapPin className="w-4 h-4 mr-3 text-muted-foreground" /> <strong>Address:</strong> <span className="ml-2">{pickup.address}</span></div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center"><Phone className="w-4 h-4 mr-3 text-muted-foreground" /> <strong>Phone:</strong> <span className="ml-2">{pickup.customer.phone}</span></div>
              <div className="flex items-center"><Calendar className="w-4 h-4 mr-3 text-muted-foreground" /> <strong>Schedule:</strong> <span className="ml-2">{new Date(pickup.scheduledDate).toLocaleDateString()} @ {pickup.scheduledTimeSlot}</span></div>
            </div>
          </div>
          
          <Separator className="my-6"/>

          {pickup.status === 'ACCEPTED' && (
            <div className="space-y-4">
              <Label htmlFor="pickup-code">Enter Pickup Code</Label>
              <div className="flex gap-2">
                <Input id="pickup-code" value={pickupCode} onChange={(e) => setPickupCode(e.target.value)} placeholder="Enter 4-digit code" />
                <Button onClick={handleStartPickup}><Hash className="w-4 h-4 mr-2" /> Start Pickup</Button>
              </div>
            </div>
          )}

          {(pickup.status === 'IN_PROCESS' || pickup.status === 'PENDING_APPROVAL' || pickup.status === 'COMPLETED') && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Scrap Items</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    {pickup.status === 'IN_PROCESS' && <TableHead>Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pickup.items.length > 0 ? (
                    pickup.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                        {pickup.status === 'IN_PROCESS' && <TableCell><Button variant="ghost" size="icon" onClick={() => handleDeleteItem(item.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button></TableCell>}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No items added yet.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
              <div className="flex justify-end mt-4 font-bold text-lg">
                Total: ${totalAmount}
              </div>
            </div>
          )}

          {pickup.status === 'IN_PROCESS' && (
            <div className="mt-6 border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Add New Item</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="item-name">Item Name</Label>
                        <Input id="item-name" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} placeholder="e.g. Copper Wire" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="item-quantity">Quantity</Label>
                        <Input id="item-quantity" value={newItem.quantity} onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })} placeholder="e.g. 5 kg" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="item-price">Price ($)</Label>
                        <Input id="item-price" type="number" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} placeholder="e.g. 25.50" />
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <Button onClick={handleAddItem}><PlusCircle className="w-4 h-4 mr-2" />Add Item</Button>
                  <Button variant="outline" onClick={handleSuggestPrice} disabled={isSuggestingPrice}>
                    {isSuggestingPrice ? <Bot className="w-4 h-4 mr-2 animate-spin" /> : <Lightbulb className="w-4 h-4 mr-2" />}
                    {isSuggestingPrice ? 'Thinking...' : 'Suggest Price'}
                  </Button>
                </div>
            </div>
          )}
        </CardContent>

        <CardFooter>
          {pickup.status === 'SCHEDULED' && <Button className="w-full" onClick={handleAccept} variant="accent">Accept Pickup</Button>}
          {pickup.status === 'IN_PROCESS' && <Button className="w-full" onClick={handleSubmitForApproval} variant="accent">Submit for Approval</Button>}
        </CardFooter>
      </Card>
    </div>
  );
}
