
'use client';

import {
  ImageUp,
  Lightbulb,
  MessageCircle,
  Users,
  Bot,
  Mic,
  Languages,
  LocateFixed
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Logo } from './logo';
import Image from 'next/image';
import { LandingHeader } from './layout/landing-header';

export function LandingPage() {
  const features = [
    {
      title: 'Seasonal Crop Suggestion',
      icon: Lightbulb,
      description:
        'Get AI-powered recommendations for crops based on location, season, and soil type.',
      subFeatures: [
        { icon: LocateFixed, text: 'Automatic location detection' },
        { icon: Languages, text: 'Advice in multiple Indian languages' },
        { icon: Bot, text: 'Detailed information on any suggested crop' },
      ],
      image: {
        src: 'https://placehold.co/600x400.png',
        alt: 'Lush green field under a sunny sky',
        "data-ai-hint": "farm field"
      },
    },
    {
      title: 'Crop Identifier',
      icon: ImageUp,
      description:
        'Upload an image of a crop to have the AI identify it, providing details and an estimated market price.',
      subFeatures: [
        { icon: Bot, text: 'AI-powered image recognition' },
        { icon: Languages, text: 'Get market prices in Indian Rupees (₹)' },
        { icon: Bot, text: 'Pest and disease information' },
      ],
      image: {
        src: 'https://placehold.co/600x400.png',
        alt: 'Close-up of a hand holding a smartphone to identify a plant',
        "data-ai-hint": "phone plant"
      },
    },
    {
      title: 'AI Farming Assistant',
      icon: MessageCircle,
      description:
        'An interactive chatbot to answer all your farming-related questions, anytime.',
      subFeatures: [
        { icon: Mic, text: 'Supports voice and text input' },
        { icon: Languages, text: 'Get answers in multiple Indian languages' },
        { icon: Bot, text: 'Text-to-speech for audible responses' },
      ],
      image: {
        src: 'https://placehold.co/600x400.png',
        alt: 'A farmer in a field using a tablet',
        "data-ai-hint": "farmer tablet"
      },
    },
    {
      title: 'Community Chat',
      icon: Users,
      description:
        'Connect with fellow farmers and agricultural experts in a real-time chat community.',
      subFeatures: [
        { icon: Users, text: 'Message other users directly' },
        { icon: Bot, text: 'Share knowledge and experiences' },
        { icon: Bot, text: 'Build your farming network' },
      ],
      image: {
        src: 'https://placehold.co/600x400.png',
        alt: 'A diverse group of people talking in a community setting',
        "data-ai-hint": "community talk"
      },
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <LandingHeader />

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="container mx-auto flex flex-col items-center justify-center text-center py-20 md:py-32">
          <Logo className="text-5xl md:text-6xl mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
            Smart Farming for a Brighter Future
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
            CropSense AI is your intelligent partner in agriculture, providing
            AI-driven insights from crop selection to market analysis.
          </p>
          <Button asChild size="lg">
            <Link href="/signup">Get Started for Free</Link>
          </Button>
        </section>

        {/* Features Section */}
        <section className="bg-muted py-20 md:py-32">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">
                A Complete Toolkit for Modern Farmers
              </h2>
              <p className="text-lg text-muted-foreground mt-2">
                Everything you need to make informed decisions and grow your success.
              </p>
            </div>
            <div className="space-y-20">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="grid md:grid-cols-2 gap-12 items-center"
                >
                  <div
                    className={
                      index % 2 === 0 ? 'order-1' : 'order-1 md:order-2'
                    }
                  >
                    <Card className="shadow-lg rounded-xl overflow-hidden">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3 font-headline text-2xl text-primary">
                          <feature.icon className="h-6 w-6" />
                          {feature.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-6">
                          {feature.description}
                        </p>
                        <ul className="space-y-3">
                          {feature.subFeatures.map((sub, i) => (
                            <li key={i} className="flex items-center gap-3">
                              <sub.icon className="h-5 w-5 text-accent" />
                              <span className="text-foreground">
                                {sub.text}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                  <div
                    className={
                      index % 2 === 0 ? 'order-2' : 'order-2 md:order-1'
                    }
                  >
                    <Image
                      src={feature.image.src}
                      alt={feature.image.alt}
                      width={600}
                      height={400}
                      className="rounded-xl shadow-2xl object-cover"
                      data-ai-hint={feature.image['data-ai-hint']}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto text-center py-20 md:py-32">
           <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary mb-4">
            Ready to Transform Your Farm?
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-8">
            Join thousands of farmers embracing the future of agriculture. Sign up now and get immediate access to our full suite of AI tools.
          </p>
          <Button asChild size="lg">
            <Link href="/signup">Sign Up Now</Link>
          </Button>
        </section>
      </main>

      <footer className="text-center p-4 text-muted-foreground text-sm border-t">
        © {new Date().getFullYear()} CropSense AI. All rights reserved.
      </footer>
    </div>
  );
}
