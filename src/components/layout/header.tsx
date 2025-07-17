
'use client';

import { logout } from '@/app/actions';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Home, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useTransition } from 'react';

export function Header() {
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      await logout();
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
        <Logo />
        <div className='flex items-center gap-2'>
          <Button asChild variant="ghost" size="icon">
            <Link href="/dashboard">
              <Home className="h-5 w-5" />
              <span className="sr-only">Dashboard</span>
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            disabled={isPending}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {isPending ? 'Signing out...' : 'Sign Out'}
          </Button>
        </div>
      </div>
    </header>
  );
}
