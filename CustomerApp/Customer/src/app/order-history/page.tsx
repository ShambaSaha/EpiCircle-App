'use client'

import { useState, useEffect } from 'react'
import { AppLayout } from '@/components/AppLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Hourglass, CheckCircle, Truck, XCircle, Calendar, Clock, MapPin, Hash, Newspaper, Weight } from 'lucide-react'
import type { PickupRequest } from '@/types'

const statusConfig = {
  'Pending for Approval': { icon: Hourglass, color: 'bg-yellow-500 hover:bg-yellow-500/90' },
  'Approved': { icon: CheckCircle, color: 'bg-blue-500 hover:bg-blue-500/90' },
  'Picked Up': { icon: Truck, color: 'bg-primary hover:bg-primary/90' },
  'Cancelled': { icon: XCircle, color: 'bg-red-500 hover:bg-red-500/90' },
}

export default function OrderHistoryPage() {
  const [requests, setRequests] = useState<PickupRequest[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const storedRequests: PickupRequest[] = JSON.parse(localStorage.getItem('pickupRequests') || '[]')
    setRequests(storedRequests.sort((a, b) => b.createdAt - a.createdAt))
  }, [])

  const handleApprove = (id: string) => {
    const updatedRequests = requests.map(req => 
      req.id === id ? { ...req, status: 'Approved' as const } : req
    )
    setRequests(updatedRequests)
    localStorage.setItem('pickupRequests', JSON.stringify(updatedRequests))
    toast({
      title: "Request Approved",
      description: "The pickup request has been confirmed.",
    })
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-headline">Order History</h1>
          <p className="text-muted-foreground">
            Here are all your past and current pickup requests.
          </p>
        </div>

        {requests.length === 0 ? (
          <Card className="text-center py-12">
            <CardHeader>
              <CardTitle>No History Found</CardTitle>
              <CardDescription>You haven't scheduled any pickups yet.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={() => window.location.href = '/schedule-pickup'}>Schedule Your First Pickup</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => {
              const StatusIcon = statusConfig[req.status].icon
              const statusColor = statusConfig[req.status].color
              return (
                <Card key={req.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">Pickup for {req.category}</CardTitle>
                        <CardDescription>Request ID: {req.id}</CardDescription>
                      </div>
                      <Badge className={`${statusColor} text-primary-foreground`}>
                        <StatusIcon className="mr-2 h-4 w-4" />
                        {req.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-center">
                      <Newspaper className="mr-3 h-4 w-4 text-muted-foreground" />
                      <span>Category: <strong>{req.category}</strong></span>
                    </div>
                    <div className="flex items-center">
                      <Weight className="mr-3 h-4 w-4 text-muted-foreground" />
                      <span>Quantity: <strong>{req.quantity}</strong></span>
                    </div>
                     <div className="flex items-center">
                      <Calendar className="mr-3 h-4 w-4 text-muted-foreground" />
                      <span>{req.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-3 h-4 w-4 text-muted-foreground" />
                      <span>{req.timeSlot}</span>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="mr-3 h-4 w-4 text-muted-foreground mt-1" />
                      <span className="flex-1">{req.address}</span>
                    </div>
                     <div className="flex items-center">
                      <Hash className="mr-3 h-4 w-4 text-muted-foreground" />
                      <span>Pickup Code: <strong>{req.pickupCode}</strong></span>
                    </div>
                  </CardContent>
                  {req.status === 'Pending for Approval' && (
                    <CardFooter>
                      <Button onClick={() => handleApprove(req.id)} size="sm">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Confirm Request
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
