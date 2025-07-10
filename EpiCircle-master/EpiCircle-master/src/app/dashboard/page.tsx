
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AppLayout } from '@/components/AppLayout'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, History, ArrowRight, Hourglass, CheckCircle, Truck, XCircle } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import type { User, PickupRequest } from '@/types'

const statusConfig = {
  'Pending for Approval': { icon: Hourglass, color: 'bg-yellow-500 hover:bg-yellow-500/90' },
  'Approved': { icon: CheckCircle, color: 'bg-blue-500 hover:bg-blue-500/90' },
  'Picked Up': { icon: Truck, color: 'bg-primary hover:bg-primary/90' },
  'Cancelled': { icon: XCircle, color: 'bg-red-500 hover:bg-red-500/90' },
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [recentRequests, setRecentRequests] = useState<PickupRequest[]>([])

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
    const storedRequests: PickupRequest[] = JSON.parse(localStorage.getItem('pickupRequests') || '[]')
    setRecentRequests(storedRequests.sort((a, b) => b.createdAt - a.createdAt).slice(0, 3))
  }, [])

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="space-y-2">
            <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
            <p className="text-muted-foreground">
                Welcome back{user?.phone ? `, ${user.phone}` : ''}! What would you like to do today?
            </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Schedule a Pickup</CardTitle>
              <Calendar className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <CardDescription>Find a convenient date and time for us to collect your scrap.</CardDescription>
              <Button asChild className="mt-4">
                <Link href="/schedule-pickup">
                  Schedule Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">View Order History</CardTitle>
              <History className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <CardDescription>Check the status of your past and current pickup requests.</CardDescription>
              <Button asChild className="mt-4">
                <Link href="/order-history">
                  View History <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold font-headline">Recent Activity</h2>
          {recentRequests.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recentRequests.map((req) => {
                const StatusIcon = statusConfig[req.status].icon
                const statusColor = statusConfig[req.status].color
                return (
                  <Card key={req.id} className="flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <div className="flex justify-between items-start gap-2">
                         <CardTitle className="text-base font-medium">{req.category}</CardTitle>
                         <Badge className={`${statusColor} text-primary-foreground`}>
                            <StatusIcon className="mr-1.5 h-4 w-4" />
                            {req.status}
                          </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>{req.date}</span>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground py-8">You have no recent pickup requests.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
