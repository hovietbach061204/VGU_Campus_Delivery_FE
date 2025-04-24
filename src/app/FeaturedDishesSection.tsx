import React, { JSX } from 'react';
import Image from 'next/image';

import { Card, CardContent } from '@/components/ui/Card';

export default function FeaturedDishesSection(): JSX.Element {
  return (
    <section className="w-full px-4 py-16">
      <div className="flex flex-col-reverse items-center justify-between gap-12 lg:flex-row">
        {/* Left text content */}
        <div className="w-full max-w-xl text-center lg:text-left">
          <h2 className="font-['Red_Rose-Bold',Helvetica] text-3xl font-bold leading-snug tracking-tight text-[#2e2c49] sm:text-4xl lg:text-5xl">
            Delicious and healthy food for your body
          </h2>
          <p className="mt-6 font-['Red_Hat_Text-Regular',Helvetica] text-base leading-relaxed text-[#777e90] sm:text-lg">
            This is normally where we put a message to encourage people to buy
            more food, but I do not have anything to put here
          </p>
        </div>

        {/* Right image */}
        <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-[615px]">
          <Card className="border-none shadow-none">
            <CardContent className="p-0">
              <div className="relative aspect-[615/533] w-full">
                <Image
                  src="/images/Motorblend.png" // Update this to your actual image path
                  alt="Delivery person on a scooter carrying food"
                  className="object-contain"
                  fill
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
