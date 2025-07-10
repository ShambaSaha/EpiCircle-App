'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Recycle, Phone, KeyRound, User as UserIcon } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import type { User } from '@/types'

export default function AuthPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSignUp, setIsSignUp] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        const user: User = JSON.parse(storedUser);
        if(isSignUp || user.name) {
             router.replace('/dashboard');
        }
    }
  }, [router, isSignUp]);

  const handleSendOtp = () => {
    if (phone.length < 10) {
      toast({
        variant: "destructive",
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number.",
      })
      return
    }
    if (isSignUp && !name) {
        toast({
            variant: "destructive",
            title: "Name is required",
            description: "Please enter your name to sign up.",
        })
        return
    }
    setOtpSent(true)
    toast({
      title: "OTP Sent",
      description: "An OTP has been sent to your phone (use 123456).",
    })
  }

  const handleAuth = () => {
    setIsLoading(true)
    // Mock OTP verification
    if (otp === '123456') {
      const user: User = { name, phone }
      localStorage.setItem('user', JSON.stringify(user))
      toast({
        title: isSignUp ? "Sign Up Successful" : "Login Successful",
        description: `Welcome to EpiCircle${name ? `, ${name}`: ''}!`,
      })
      router.push('/dashboard')
    } else {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: "The OTP you entered is incorrect.",
      })
      setIsLoading(false)
    }
  }
  
  if (!isMounted) {
      return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-5xl grid md:grid-cols-5 overflow-hidden rounded-2xl shadow-xl">
        <div className="relative hidden h-full md:block md:col-span-3">
            <Image
                src="/recycle.png"
                alt="Eco-friendly recycling pattern"
                width={1200}
                height={1200}
                className="h-full w-full object-cover"
                data-ai-hint="recycling pattern"
            />
        </div>

        <div className="flex w-full flex-col justify-center p-8 sm:p-12 md:col-span-2">
            <CardHeader className="p-0 text-center mb-6">
              <div className="flex justify-center items-center mb-4">
                <Recycle className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-2xl font-headline">Welcome to EpiCircle</CardTitle>
              <CardDescription>{isSignUp ? "Create an account to get started" : "Turning Trash to Treasure"}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-0">
              {isSignUp && (
                 <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="name" type="text" placeholder="Enter your full name" value={name} onChange={(e) => setName(e.target.value)} disabled={otpSent} className="pl-10"/>
                    </div>
                  </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="phone" type="tel" placeholder="Enter your phone number" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={otpSent} className="pl-10"/>
                </div>
              </div>
              {otpSent && (
                <div className="space-y-2">
                  <Label htmlFor="otp">One-Time Password (OTP)</Label>
                   <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="otp" type="text" placeholder="Enter your OTP" value={otp} onChange={(e) => setOtp(e.target.value)} className="pl-10"/>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex-col gap-4 p-0 mt-6">
              {otpSent ? (
                <Button className="w-full" onClick={handleAuth} disabled={isLoading}>
                  {isLoading ? 'Verifying...' : isSignUp ? 'Sign Up' : 'Login'}
                </Button>
              ) : (
                <Button className="w-full" onClick={handleSendOtp}>Send OTP</Button>
              )}
               <Button variant="link" onClick={() => {
                   setIsSignUp(!isSignUp)
                   setOtpSent(false)
                   setOtp('')
                }}>
                    {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
                </Button>
            </CardFooter>
        </div>
      </Card>
    </div>
  )
}
