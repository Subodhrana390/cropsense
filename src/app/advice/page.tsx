'use client';

import { getChatbotResponse } from '@/app/actions';
import { Header } from '@/components/layout/header';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Bot, ChevronLeft, User } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function AdviceContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const language = searchParams.get('lang');
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!query) {
      setError('No query provided.');
      setLoading(false);
      return;
    }

    const fetchResponse = async () => {
      setLoading(true);
      setError('');
      const result = await getChatbotResponse({ query, language: language || 'English' });
      if (result.success && result.data) {
        setAnswer(result.data.answer);
      } else {
        setError(
          result.error ||
            'An unexpected error occurred. Please try again later.'
        );
        toast({
          variant: 'destructive',
          title: 'Error',
          description:
            result.error || 'Failed to get a response from the AI assistant.',
        });
      }
      setLoading(false);
    };

    fetchResponse();
  }, [query, language, toast]);

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

          <div className="space-y-8">
            {query && (
              <Card className="shadow-lg rounded-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 font-headline text-xl">
                    <User className="h-6 w-6 text-primary" />
                    Your Question
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{query}</p>
                </CardContent>
              </Card>
            )}

            <Card className="shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 font-headline text-xl">
                  <Bot className="h-6 w-6 text-primary" />
                  AI Farming Assistant's Advice
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading && (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                )}
                {error && (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {!loading && !error && answer && (
                  <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">
                    {answer}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-muted-foreground text-sm">
        © {new Date().getFullYear()} CropSense AI. All rights reserved.
      </footer>
    </div>
  );
}

export default function AdvicePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdviceContent />
    </Suspense>
  );
}
