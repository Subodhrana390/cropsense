'use client';

import { CropSuggestion } from '@/components/crop-suggestion';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, Lightbulb } from 'lucide-react';
import Link from 'next/link';

export default function CropSuggestionPage() {

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

          <Card className="shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 font-headline text-2xl text-primary">
                <Lightbulb className="h-6 w-6" />
                Seasonal Crop Suggestion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Get recommendations for crops to grow based on your location and
                the current season. Our AI considers regional factors to suggest
                the most suitable options for India.
              </p>
              <CropSuggestion />
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
