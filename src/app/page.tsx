
'use client';

import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUp, Lightbulb, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const features = [
    {
      title: 'Seasonal Crop Suggestion',
      icon: Lightbulb,
      description: 'Get AI-powered recommendations for crops to grow based on your location and the season.',
      href: '/crop-suggestion',
    },
    {
      title: 'Crop Identifier',
      icon: ImageUp,
      description: 'Upload an image of a crop to identify it and get an estimated market price in India.',
      href: '/crop-identifier',
    },
    {
      title: 'AI Farming Assistant',
      icon: MessageCircle,
      description: 'Ask anything about crop selection, planting schedules, pest control, or storage techniques.',
      href: '/chatbot',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-headline text-primary mb-2">
            Welcome to CropSense AI
          </h1>
          <p className="text-lg text-muted-foreground">
            Your smart partner in modern agriculture.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Link href={feature.href} key={feature.title} className="block group">
              <Card className="shadow-lg rounded-xl h-full transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 font-headline text-2xl text-primary">
                    <feature.icon className="h-6 w-6" />
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
      <footer className="text-center p-4 text-muted-foreground text-sm">
        © {new Date().getFullYear()} CropSense AI. All rights reserved.
      </footer>
    </div>
  );
}
