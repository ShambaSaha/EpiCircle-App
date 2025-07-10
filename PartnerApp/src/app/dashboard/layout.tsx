'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Recycle, LogOut, Loader } from 'lucide-react';
import Link from 'next/link';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authStatus, setAuthStatus] = useState<AuthStatus>('loading');

  useEffect(() => {
    // This check will only run on the client side.
    const token = localStorage.getItem('partner-auth-token');
    if (token) {
      setAuthStatus('authenticated');
    } else {
      setAuthStatus('unauthenticated');
    }
  }, []);

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.replace('/login');
    }
  }, [authStatus, router]);

  const handleLogout = () => {
    localStorage.removeItem('partner-auth-token');
    router.replace('/login');
  };

  if (authStatus === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-2">
          <Loader className="h-6 w-6 animate-spin text-primary" />
          <p className="text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (authStatus === 'authenticated') {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Recycle className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">Scrap Pickup Partner</span>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </header>
        <main className="flex-1 bg-background">
          {children}
        </main>
      </div>
    );
  }

  // This will render nothing while it's redirecting for the 'unauthenticated' case.
  return null;
}
