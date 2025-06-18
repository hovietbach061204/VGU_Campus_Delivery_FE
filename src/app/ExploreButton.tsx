'use client';
import { Button } from '@/components/ui/button';

interface ExploreButtonProps {
  eateryName?: string;
}

export function ExploreButton({ eateryName }: ExploreButtonProps) {
  return (
    <Button
      className="h-[60px] rounded-[10px] bg-[#fa9f3d] px-8 text-lg font-bold text-white hover:bg-[#fa9f3d]/90 sm:h-[70px] sm:px-12 sm:text-xl"
      onClick={() => {
        const token =
          typeof window !== 'undefined'
            ? localStorage.getItem('access_token')
            : null;
        if (!token) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          window.dispatchEvent(new CustomEvent('show-auth-prompt'));
          return;
        }
        if (eateryName && eateryName.trim() !== '') {
          window.location.href = `/Restaurant_Order?eatery=${encodeURIComponent(
            eateryName.trim()
          )}`;
        } else {
          window.location.href = '/Restaurant_Order';
        }
      }}
    >
      Explore
    </Button>
  );
}
