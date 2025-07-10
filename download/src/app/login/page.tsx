'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Recycle, LogIn } from 'lucide-react';

const LoginSchema = z.object({
  phone: z.string().optional(),
  otp: z.string().optional(),
});

type LoginFormValues = z.infer<typeof LoginSchema>;

export default function LoginPage() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const router = useRouter();
  const { toast } = useToast();
  const otpInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      phone: '',
      otp: '',
    },
  });

  const handleSendOtp = (data: LoginFormValues) => {
    if (data.phone) {
      setPhoneNumber(data.phone);
      toast({
        title: 'OTP Sent',
        description: 'A mock OTP has been sent. Use 123456 to log in.',
      });
      setStep('otp');
    }
  };
  
  useEffect(() => {
    if (step === 'otp') {
       // A short timeout ensures the input is rendered before we try to focus it.
      setTimeout(() => {
        form.reset({ otp: '' });
        otpInputRef.current?.focus();
      }, 0);
    }
  }, [step, form]);

  const handleLogin = (data: LoginFormValues) => {
    if (data.otp === '123456') {
      toast({
        title: 'Login Successful',
        description: 'Welcome back!',
      });
      localStorage.setItem('partner-auth-token', 'mock-token');
      router.push('/dashboard');
    } else {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Invalid OTP. Please try again.',
      });
      form.setError('otp', {
        type: 'manual',
        message: 'Invalid OTP. Please try again.',
      });
    }
  };
  
  const onSubmit = (data: LoginFormValues) => {
    if (step === 'phone') {
      handleSendOtp(data);
    } else {
      handleLogin(data);
    }
  };


  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary text-primary-foreground rounded-full p-3 w-fit mb-4">
            <Recycle className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Scrap Pickup Partner
          </CardTitle>
          <CardDescription>
            {step === 'otp'
              ? `Enter the OTP sent to ${phoneNumber}.`
              : 'Log in to manage your pickups.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {step === 'phone' ? (
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., (123) 456-7890"
                          type="tel"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>One-Time Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter 6-digit OTP"
                          type="text"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          maxLength={6}
                          {...field}
                          value={field.value ?? ''}
                          ref={otpInputRef}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {step === 'phone' ? 'Send OTP' : <><LogIn className="mr-2 h-4 w-4" /> Login</>}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-xs text-muted-foreground">
            Secure and Efficient Partner Portal
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
