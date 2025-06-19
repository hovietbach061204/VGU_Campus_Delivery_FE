'use client';

import React, { JSX, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

export default function HeroSection(): JSX.Element {
  const router = useRouter();

  useEffect(() => {
    const handler = () => {};
    window.addEventListener('clear-auth-prompt', handler);
    return () => window.removeEventListener('clear-auth-prompt', handler);
  }, []);

  const handleStartDelivering = () => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('access_token')
        : null;
    if (!token) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.dispatchEvent(new CustomEvent('show-auth-prompt'));
      return;
    }
    router.push('/Driver');
  };
  return (
    <section className="container mx-auto flex flex-col-reverse items-center justify-between gap-10 px-4 py-16 md:flex-row md:gap-8">
      {/* Left side image */}
      <div className="w-full md:w-1/2">
        <Image
          className="h-auto w-full max-w-md object-contain sm:max-w-lg md:max-w-[560px]"
          alt="Delivery driver illustration"
          src="/images/Motorbikeman.png" // Delivery driver image
          width={560}
          height={400}
        />
      </div>

      {/* Right side content */}
      <div className="w-full text-center md:w-1/2 md:text-left">
        <h2 className="font-['Red_Rose-Bold',Helvetica] text-3xl font-bold leading-tight tracking-tight text-[#204944] sm:text-4xl md:text-5xl">
          Join Our Reliable <br className="hidden sm:inline" />
          Delivery Network
        </h2>

        <p className="mt-4 font-['Red_Hat_Text-Regular',Helvetica] text-base leading-relaxed text-[#777e90] sm:text-lg">
          Ready to start earning? Join our delivery team and begin delivering
          food to customers today!
        </p>

        <div className="mt-6">
          <Button
            onClick={handleStartDelivering}
            className="rounded-[10px] bg-[#ff785b] px-6 py-4 font-['Red_Rose-Bold',Helvetica] text-base font-bold text-white shadow-[0px_8px_12px_#ff785b73] hover:bg-[#ff5b3b] sm:text-lg md:text-xl"
          >
            Start Delivering
          </Button>
        </div>
      </div>
    </section>
  );
}
