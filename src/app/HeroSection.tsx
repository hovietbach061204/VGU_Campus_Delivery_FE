'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function HeroSection() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter();
  const [isDelivering, setIsDelivering] = useState(false); // Track if user is delivering

  const handleStartDelivering = () => {
    const confirmDelivery = confirm(
      'Are you sure you want to start delivering?'
    );
    if (confirmDelivery) {
      setIsDelivering(true);
      localStorage.setItem('isDelivering', 'true'); // Save delivering status to localStorage
    }
  };

  const handleTimeToOrder = () => {
    setIsDelivering(false);
    localStorage.setItem('isDelivering', 'false'); // Reset delivering status
  };

  return (
    <section className="container mx-auto flex flex-col-reverse items-center justify-between gap-10 px-4 py-16 md:flex-row md:gap-8">
      {/* Left side image */}
      <div className="w-full md:w-1/2">
        <Image
          className="h-auto w-full max-w-md object-contain sm:max-w-lg md:max-w-[560px]"
          alt="Restaurant illustration"
          src="/images/restaurant-hero.png" // Replace with actual image path
          width={560}
          height={400}
        />
      </div>

      {/* Right side content */}
      <div className="w-full text-center md:w-1/2 md:text-left">
        <h2 className="font-['Red_Rose-Bold',Helvetica] text-3xl font-bold leading-tight tracking-tight text-[#204944] sm:text-4xl md:text-5xl">
          We have the somewhat Modest <br className="hidden sm:inline" />
          Restaurant Chain
        </h2>

        <p className="mt-4 font-['Red_Hat_Text-Regular',Helvetica] text-base leading-relaxed text-[#777e90] sm:text-lg">
          If you want to deliver instead, we got you
        </p>

        <div className="mt-6">
          {!isDelivering ? (
            <Button
              onClick={handleStartDelivering}
              className="rounded-[10px] bg-[#fdad00] px-6 py-4 font-['Red_Rose-Bold',Helvetica] text-base font-bold text-white shadow-[0px_8px_12px_#ffeaa273] hover:bg-[#e69d00] sm:text-lg md:text-xl"
            >
              Start Delivering
            </Button>
          ) : (
            <Button
              onClick={handleTimeToOrder}
              className="rounded-[10px] bg-[#ff785b] px-6 py-4 font-['Red_Rose-Bold',Helvetica] text-base font-bold text-white shadow-[0px_8px_12px_#ffeaa273] hover:bg-[#e69d00] sm:text-lg md:text-xl"
            >
              Time to Order
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
