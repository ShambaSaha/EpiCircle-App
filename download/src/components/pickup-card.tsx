import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Pickup } from '@/lib/types';
import { User, Phone, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PickupCardProps {
  pickup: Pickup;
}

const statusVariantMap: { [key in Pickup['status']]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
  SCHEDULED: 'secondary',
  ACCEPTED: 'default',
  IN_PROCESS: 'outline',
  PENDING_APPROVAL: 'outline',
  COMPLETED: 'default',
  CANCELLED: 'destructive',
};

export function PickupCard({ pickup }: PickupCardProps) {
  const variant = statusVariantMap[pickup.status] || 'default';
  
  return (
    <Card className="flex flex-col h-full transition-all hover:shadow-lg hover:-translate-y-1">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{pickup.customer.name}</CardTitle>
          <Badge variant={variant} className={cn(
            "capitalize",
            pickup.status === 'ACCEPTED' && 'bg-accent text-accent-foreground',
            pickup.status === 'COMPLETED' && 'bg-green-500 text-white'
          )}>
            {pickup.status.replace('_', ' ').toLowerCase()}
          </Badge>
        </div>
        <CardDescription>Pickup ID: {pickup.id}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div className="flex items-center text-sm">
          <Phone className="w-4 h-4 mr-3 text-muted-foreground" />
          <span>{pickup.customer.phone}</span>
        </div>
        <div className="flex items-start text-sm">
          <MapPin className="w-4 h-4 mr-3 mt-1 text-muted-foreground flex-shrink-0" />
          <span>{pickup.address}</span>
        </div>
        <div className="flex items-center text-sm">
          <Calendar className="w-4 h-4 mr-3 text-muted-foreground" />
          <span>{new Date(pickup.scheduledDate).toLocaleDateString()} @ {pickup.scheduledTimeSlot}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/dashboard/pickups/${pickup.id}`}>
            View Details <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
