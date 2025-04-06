import React, { JSX } from 'react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';

export default function HeroSection(): JSX.Element {
  return (
    <section className="container mx-auto flex flex-col items-center justify-between gap-8 py-16 md:flex-row">
      {/* Left side image */}
      <div className="w-full md:w-1/2">
        <Image
          className="h-auto w-full max-w-[560px]"
          alt="Restaurant illustration"
          src=""
          // This would be replaced with the actual image path in a real implementation
        />
      </div>

      {/* Right side content */}
      <div className="flex w-full flex-col gap-6 md:w-1/2">
        <h2 className="font-['Red_Rose-Bold',Helvetica] text-4xl font-bold leading-tight tracking-tight text-[#204944] md:text-5xl">
          We have the Largest <br />
          Restaurant Chain
        </h2>

        <p className="font-['Red_Hat_Text-Regular',Helvetica] text-lg leading-7 text-[#777e90]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>

        <div className="mt-4">
          <Button className="h-auto rounded-[10px] bg-[#fdad00] px-8 py-6 font-['Red_Rose-Bold',Helvetica] text-xl font-bold text-white shadow-[0px_8px_12px_#ffeaa273] hover:bg-[#e69d00]">
            Learn more
          </Button>
        </div>
      </div>
    </section>
  );
}
