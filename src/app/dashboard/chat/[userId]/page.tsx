'use client';

import { Header } from '@/components/layout/header';
import { UserChat } from '@/components/user-chat';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function ChatPage({ params }: { params: { userId: string } }) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
         <div className="max-w-3xl mx-auto">
            <Button asChild variant="outline" className="mb-6">
                <Link href="/dashboard/chat">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to User List
                </Link>
            </Button>
            <UserChat recipientId={params.userId} />
         </div>
      </main>
      <footer className="text-center p-4 text-muted-foreground text-sm">
        © {new Date().getFullYear()} CropSense AI. All rights reserved.
      </footer>
    </div>
  );
}
