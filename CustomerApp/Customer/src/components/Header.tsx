'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { Recycle, LogOut } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function Header() {
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = () => {
    localStorage.removeItem('user')
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })
    router.replace('/')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Recycle className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold font-headline text-primary">EpiCircle</span>
        </Link>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  )
}
