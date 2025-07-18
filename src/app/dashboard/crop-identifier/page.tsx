'use client';

import { CropIdentifier } from '@/components/crop-identifier';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ImageUp } from 'lucide-react';
import Link from 'next/link';

export default function CropIdentifierPage() {
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
                <ImageUp className="h-6 w-6" />
                Crop Identifier
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Upload an image of a crop, and our AI will identify it and
                provide an estimated market price in India.
              </p>
              <CropIdentifier />
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
