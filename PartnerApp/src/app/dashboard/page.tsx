import { mockPickups } from '@/lib/mock-data';
import { PickupCard } from '@/components/pickup-card';

export default function DashboardPage() {
  const pickups = mockPickups;

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Assigned Pickups</h1>
      {pickups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pickups.map((pickup) => (
            <PickupCard key={pickup.id} pickup={pickup} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h2 className="text-xl font-medium">No pickups assigned</h2>
          <p className="text-muted-foreground">Check back later for new assignments.</p>
        </div>
      )}
    </div>
  );
}
