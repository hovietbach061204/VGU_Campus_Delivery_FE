import React, { JSX } from 'react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';

export default function HeroSection(): JSX.Element {
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
          We have the Largest <br className="hidden sm:inline" />
          Restaurant Chain
        </h2>

        <p className="mt-4 font-['Red_Hat_Text-Regular',Helvetica] text-base leading-relaxed text-[#777e90] sm:text-lg">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>

        <div className="mt-6">
          <Button className="rounded-[10px] bg-[#fdad00] px-6 py-4 font-['Red_Rose-Bold',Helvetica] text-base font-bold text-white shadow-[0px_8px_12px_#ffeaa273] hover:bg-[#e69d00] sm:text-lg md:text-xl">
            Learn more
          </Button>
        </div>
      </div>
    </section>
  );
}
