'use client';

import {
  ImageUp,
  Lightbulb,
  MessageCircle,
  Users,
  Bot,
  Mic,
  Languages,
  LocateFixed,
  Leaf,
  TrendingUp,
  ShieldCheck
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
        { icon: Leaf, text: 'Detailed information on any suggested crop' },
      ],
      image: {
        src: 'https://images.pexels.com/photos/2252584/pexels-photo-2252584.jpeg',
        alt: 'Lush green field under a sunny sky',
      },
      color: 'bg-emerald-50'
    },
    {
      title: 'Crop Identifier',
      icon: ImageUp,
      description:
        'Upload an image of a crop to have the AI identify it, providing details and an estimated market price.',
      subFeatures: [
        { icon: Bot, text: 'AI-powered image recognition' },
        { icon: TrendingUp, text: 'Get market prices in Indian Rupees (₹)' },
        { icon: ShieldCheck, text: 'Pest and disease information' },
      ],
      image: {
        src: 'https://images.pexels.com/photos/4505168/pexels-photo-4505168.jpeg',
        alt: 'Close-up of a hand holding a smartphone to identify a plant',
      },
      color: 'bg-amber-50'
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
        src: 'https://images.pexels.com/photos/10834351/pexels-photo-10834351.jpeg',
        alt: 'A farmer in a field using a tablet',
      },
      color: 'bg-blue-50'
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
        src: 'https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg',
        alt: 'A diverse group of people talking in a community setting',
      },
      color: 'bg-violet-50'
    },
  ];

  const stats = [
    { value: '10,000+', label: 'Farmers Using Our Platform' },
    { value: '50+', label: 'Crops Supported' },
    { value: '95%', label: 'Accuracy Rate' },
    { value: '24/7', label: 'Support Available' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <LandingHeader />

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-100/20 to-transparent z-0" />
          <div className="container mx-auto flex flex-col items-center justify-center text-center py-20 md:py-32 relative z-10">
            <Logo className="text-5xl md:text-6xl mb-6 text-emerald-600" />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6 max-w-3xl leading-tight">
              <span className="bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
                Smart Farming
              </span>{' '}
              for a Brighter Future
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
              CropSense AI is your intelligent partner in agriculture, providing
              AI-driven insights from crop selection to market analysis.
            </p>
            <div className="flex gap-4">
              <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                <Link href="/signup">Get Started for Free</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-gradient-to-r from-emerald-50 to-green-50">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">
                    {stat.value}
                  </p>
                  <p className="text-sm md:text-base text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                <span className="bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
                  A Complete Toolkit
                </span>{' '}
                for Modern Farmers
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to make informed decisions and grow your success.
              </p>
            </div>
            <div className="space-y-24">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className={`grid md:grid-cols-2 gap-8 items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className={`rounded-2xl overflow-hidden shadow-lg ${feature.color} p-1`}>
                    <Image
                      src={feature.image.src}
                      alt={feature.image.alt}
                      width={600}
                      height={400}
                      className="rounded-xl object-cover w-full h-full"
                    />
                  </div>
                  <div className={index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-3 rounded-lg ${feature.color}`}>
                        <feature.icon className="h-6 w-6 text-emerald-600" />
                      </div>
                      <h3 className="text-2xl font-bold">{feature.title}</h3>
                    </div>
                    <p className="text-muted-foreground mb-6">
                      {feature.description}
                    </p>
                    <ul className="space-y-3">
                      {feature.subFeatures.map((sub, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <sub.icon className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span className="text-foreground">
                            {sub.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="py-20 bg-gradient-to-b from-emerald-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <blockquote className="text-xl md:text-2xl italic text-muted-foreground mb-6">
                "CropSense AI transformed how I manage my farm. The crop suggestions have increased my yield by 30%, and the community support is invaluable."
              </blockquote>
              <div className="flex items-center justify-center gap-4">
                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <span className="text-emerald-600 font-bold">RS</span>
                </div>
                <div className="text-left">
                  <p className="font-medium">Rajesh Singh</p>
                  <p className="text-sm text-muted-foreground">Farmer from Punjab</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-32 bg-gradient-to-b from-white to-emerald-50">
          <div className="container mx-auto text-center">
            <div className="max-w-2xl mx-auto bg-white p-8 md:p-10 rounded-2xl shadow-lg">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Transform Your Farm?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of farmers embracing the future of agriculture.
              </p>
              <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                <Link href="/signup">Sign Up Now - It's Free</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Logo className="text-3xl text-white mb-4" />
              <p className="text-sm">
                Empowering farmers with AI-driven agricultural solutions.
              </p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Features</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm hover:text-white">Crop Suggestions</Link></li>
                <li><Link href="#" className="text-sm hover:text-white">Crop Identifier</Link></li>
                <li><Link href="#" className="text-sm hover:text-white">AI Assistant</Link></li>
                <li><Link href="#" className="text-sm hover:text-white">Community</Link></li>
              </ul>
            </div>


          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          © {new Date().getFullYear()} CropSense AI. All rights reserved.
        </div>
      </footer >
    </div >
  );
}
