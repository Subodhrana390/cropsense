
import { Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className="inline-block">
        <div
        className={cn(
            'flex items-center gap-2 text-3xl font-bold text-primary font-headline',
            className
        )}
        >
        <Leaf className="h-8 w-8" />
        <span>CropSense AI</span>
        </div>
    </Link>
  );
}
