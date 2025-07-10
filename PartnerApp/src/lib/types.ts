export type PickupStatus = 'SCHEDULED' | 'ACCEPTED' | 'IN_PROCESS' | 'PENDING_APPROVAL' | 'COMPLETED' | 'CANCELLED';

export interface ScrapItem {
  id: string;
  name: string;
  quantity: string;
  price: number;
}

export interface Pickup {
  id: string;
  customer: {
    name: string;
    phone: string;
  };
  address: string;
  googleMapsLink?: string;
  scheduledDate: string;
  scheduledTimeSlot: string;
  status: PickupStatus;
  pickupCode: string;
  items: ScrapItem[];
}
