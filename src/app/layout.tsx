import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { cookies } from 'next/headers';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'CropSense AI',
  description: 'Connecting Fields to Families',
};

function AuthProvider({
  authenticated,
  unauthenticated,
}: {
  authenticated: React.ReactNode;
  unauthenticated: React.ReactNode;
}) {
  const token = cookies().get('token')?.value;

  // Since we use middleware, we can assume if a token exists, it's valid for this layout render.
  // The middleware handles the actual verification and redirection.
  return <>{token ? authenticated : unauthenticated}</>;
}

export default function RootLayout({
  children,
  auth,
}: Readonly<{
  children: React.ReactNode;
  auth: React.ReactNode;
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
      </head>
      <body className={cn('min-h-screen bg-background font-body antialiased')}>
        {/* We use a Suspense boundary to allow AuthProvider to use cookies() */}
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center">Loading...</div>}>
           <AuthProvider authenticated={children} unauthenticated={auth} />
        </Suspense>
        <Toaster />
      </body>
    </html>
  );
}
