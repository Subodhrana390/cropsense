
import { Logo } from '@/components/logo';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
        <Logo />
      </div>
    </header>
  );
}
