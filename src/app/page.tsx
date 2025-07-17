'use client';

import { Chatbot } from '@/components/chatbot';
import { CropIdentifier } from '@/components/crop-identifier';
import { CropSuggestion } from '@/components/crop-suggestion';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUp, Lightbulb, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleSuggestionClick = (crop: string) => {
    const query = `Tell me more about growing ${crop}. What are the best practices for planting and harvesting it?`;
    router.push(`/advice?q=${encodeURIComponent(query)}`);
  };

  const handleChatSubmit = (query: string) => {
    router.push(`/advice?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid gap-8 lg:grid-cols-3 items-start">
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
              <CropSuggestion onSuggestionClick={handleSuggestionClick} />
            </CardContent>
          </Card>

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

          <Card className="shadow-lg rounded-xl flex flex-col h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 font-headline text-2xl text-primary">
                <MessageCircle className="h-6 w-6" />
                AI Farming Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
              <Chatbot onSubmit={handleChatSubmit} />
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
