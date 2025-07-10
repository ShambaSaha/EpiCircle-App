
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AppLayout } from '@/components/AppLayout'
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar as CalendarIcon, MapPin, Clock, Paperclip, ArrowLeft, Package, Trash2, Cpu, Cog, Archive } from "lucide-react"
import type { PickupRequest } from '@/types'
import { Progress } from '@/components/ui/progress'

const categories = [
  { id: 'paper', label: 'Paper & Cardboard', icon: Trash2 },
  { id: 'plastic', label: 'Plastics', icon: Package },
  { id: 'metal', label: 'Metals', icon: Cog },
  { id: 'ewaste', label: 'E-Waste', icon: Cpu },
  { id: 'other', label: 'Other', icon: Archive },
]

const Steps = {
  CATEGORY: 1,
  QUANTITY: 2,
  SCHEDULE: 3,
  SUMMARY: 4,
}

export default function SchedulePickupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState(Steps.CATEGORY)
  
  const [category, setCategory] = useState('')
  const [quantity, setQuantity] = useState('')
  const [date, setDate] = useState<Date>()
  const [timeSlot, setTimeSlot] = useState('')
  const [address, setAddress] = useState('')
  const [mapLink, setMapLink] = useState('')
  
  const [isLoading, setIsLoading] = useState(false)
  const [minDate, setMinDate] = useState<Date | undefined>(undefined);
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setMinDate(today);
  }, []);

  const handleNext = () => {
    if (step === Steps.CATEGORY && !category) {
        toast({ variant: "destructive", title: "Please select a category." })
        return
    }
    if (step === Steps.QUANTITY && !quantity) {
        toast({ variant: "destructive", title: "Please enter an approximate quantity." })
        return
    }
     if (step === Steps.SCHEDULE && (!date || !timeSlot || !address)) {
        toast({ variant: "destructive", title: "Please fill out all schedule details." })
        return
    }
    setStep(s => s + 1)
  }

  const handleBack = () => {
    setStep(s => s - 1)
  }

  const handleSubmit = () => {
    if (!date) {
        toast({ variant: "destructive", title: "Please select a date." })
        return;
    }
    setIsLoading(true)

    const newRequest: Omit<PickupRequest, 'id' | 'pickupCode' | 'createdAt' | 'status'> = {
      category: categories.find(c => c.id === category)?.label || 'Other',
      quantity,
      date: format(date, "PPP"),
      timeSlot,
      address,
      mapLink,
    }

    const fullRequest: PickupRequest = {
      ...newRequest,
      id: new Date().getTime().toString(),
      status: 'Pending for Approval',
      pickupCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      createdAt: Date.now(),
    }

    const existingRequests: PickupRequest[] = JSON.parse(localStorage.getItem('pickupRequests') || '[]')
    localStorage.setItem('pickupRequests', JSON.stringify([fullRequest, ...existingRequests]))

    toast({
      title: "Request Scheduled!",
      description: "Your pickup request has been successfully scheduled.",
    })
    
    router.push('/order-history')
  }

  const progressValue = (step / Object.keys(Steps).length) * 100
  
  const getDescriptionText = (currentStep: number) => {
    switch (currentStep) {
      case Steps.CATEGORY:
        return "What type of scrap are you selling?";
      case Steps.QUANTITY:
        return "How much of it do you have? (approximate)";
      case Steps.SCHEDULE:
        return "When and where can we pick it up?";
      case Steps.SUMMARY:
        return "Please review and confirm your pickup request.";
      default:
        return "Complete the steps to schedule your pickup.";
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Schedule a Pickup</CardTitle>
            <CardDescription>
                {getDescriptionText(step)}
            </CardDescription>
            <Progress value={progressValue} className="w-full mt-2" />
          </CardHeader>
          <CardContent className="space-y-6">
            {step === Steps.CATEGORY && (
                <RadioGroup value={category} onValueChange={setCategory} className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {categories.map((cat) => (
                        <Label key={cat.id} htmlFor={cat.id} className={`border-2 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-primary ${category === cat.id ? 'border-primary bg-primary/10' : 'border-muted'}`}>
                           <RadioGroupItem value={cat.id} id={cat.id} className="sr-only" />
                           <cat.icon className="h-8 w-8 mb-2" />
                           <span className="text-center font-semibold">{cat.label}</span>
                        </Label>
                    ))}
                </RadioGroup>
            )}

            {step === Steps.QUANTITY && (
                <div className="space-y-2">
                    <Label htmlFor="quantity">Approximate Weight / Quantity</Label>
                    <Input id="quantity" placeholder="e.g., 5 kg, 3 bags, 1 unit" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                </div>
            )}
            
            {step === Steps.SCHEDULE && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                        <Label htmlFor="date">Pickup Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                            <Button
                                id="date"
                                variant={"outline"}
                                className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                {isMounted && minDate && <Calendar mode="single" selected={date} onSelect={setDate} disabled={{ before: minDate }} />}
                            </PopoverContent>
                        </Popover>
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="time-slot">Time Slot</Label>
                        <Select onValueChange={setTimeSlot} value={timeSlot}>
                            <SelectTrigger id="time-slot">
                            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                            <SelectValue placeholder="Select a time slot" />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value="9 AM - 12 PM">9 AM - 12 PM</SelectItem>
                            <SelectItem value="12 PM - 3 PM">12 PM - 3 PM</SelectItem>
                            <SelectItem value="3 PM - 6 PM">3 PM - 6 PM</SelectItem>
                            </SelectContent>
                        </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address">Full Address</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Textarea id="address" placeholder="Enter your full pickup address" value={address} onChange={(e) => setAddress(e.target.value)} className="pl-10"/>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="map-link">Google Maps Link (Optional)</Label>
                        <div className="relative">
                            <Paperclip className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="map-link" placeholder="e.g., https://maps.app.goo.gl/..." value={mapLink} onChange={(e) => setMapLink(e.target.value)} className="pl-10"/>
                        </div>
                    </div>
                </div>
            )}

            {step === Steps.SUMMARY && (
                <div className="space-y-4 text-sm">
                    <h3 className="font-semibold text-lg">Order Summary</h3>
                    <div className="p-4 border rounded-lg space-y-2 bg-muted/50">
                        <p><strong>Category:</strong> {categories.find(c => c.id === category)?.label}</p>
                        <p><strong>Quantity:</strong> {quantity}</p>
                        <p><strong>Date:</strong> {date ? format(date, "PPP") : 'N/A'}</p>
                        <p><strong>Time:</strong> {timeSlot}</p>
                        <p><strong>Address:</strong> {address}</p>
                        {mapLink && <p><strong>Map Link:</strong> <a href={mapLink} target="_blank" rel="noopener noreferrer" className="text-primary underline">View Map</a></p>}
                    </div>
                    <p className="text-xs text-muted-foreground">Please ensure all details are correct before confirming.</p>
                </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {step > Steps.CATEGORY ? (
                <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="mr-2 h-4 w-4"/>
                    Back
                </Button>
            ) : <div />}

            {step < Steps.SUMMARY ? (
                <Button onClick={handleNext}>Next</Button>
            ) : (
                <Button onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? 'Confirming...' : 'Confirm Pickup'}
                </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  )
}
