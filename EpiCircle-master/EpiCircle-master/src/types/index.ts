export type User = {
  name: string;
  phone: string;
};

export type PickupRequest = {
  id: string;
  category: string;
  quantity: string;
  date: string;
  timeSlot: string;
  address: string;
  mapLink?: string;
  status: 'Pending for Approval' | 'Approved' | 'Picked Up' | 'Cancelled';
  pickupCode: string;
  createdAt: number;
};
