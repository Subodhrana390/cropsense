'use client';

import { Chatbot } from '@/components/chatbot';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function ChatbotPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <Button asChild variant="outline" className="mb-6">
            <Link href="/dashboard">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <Card className="shadow-lg rounded-xl flex flex-col h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 font-headline text-2xl text-primary">
                <MessageCircle className="h-6 w-6" />
                AI Farming Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
              <Chatbot />
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="text-center p-4 text-muted-foreground text-sm">
        © {new Date().getFullYear()} CropSense AI. All rights reserved.
      </footer>
    </div>
  );
}
