import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'CropSense AI',
  description: 'Connecting Fields to Families',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌿</text></svg>"
        />
      </head>
      <body className={cn('min-h-screen bg-background font-body antialiased')}>
        {/* Suspense boundary for any children that might use server-side hooks */}
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center">Loading...</div>}>
           {children}
        </Suspense>
        <Toaster />
      </body>
    </html>
  );
}
