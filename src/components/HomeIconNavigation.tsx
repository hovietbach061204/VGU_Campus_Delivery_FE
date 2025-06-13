'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HomeIconNavigationProps {
  className?: string;
}

export default function HomeIconNavigation({
  className = '',
}: HomeIconNavigationProps) {
  const router = useRouter();

  const handleHomeClick = () => {
    router.push('/');
  };

  return (
    <Button
      onClick={handleHomeClick}
      variant="outline"
      size="icon"
      className={`fixed right-4 top-4 z-50 size-12 rounded-full border-2 border-[#ff785b] bg-white text-[#ff785b] shadow-lg transition-all hover:bg-[#ff785b] hover:text-white ${className}`}
      title="Go to Home"
    >
      <Home className="size-5" />
    </Button>
  );
}
