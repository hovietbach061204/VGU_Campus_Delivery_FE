import React, { JSX } from 'react';
import Image from 'next/image';

import { Card, CardContent } from '@/components/ui/Card';

export default function FeaturedDishesSection(): JSX.Element {
  return (
    <section className="flex w-full flex-row items-center justify-between gap-8 py-16">
      <div className="flex max-w-[645px] flex-col space-y-6">
        <h2 className="font-['Red_Rose-Bold',Helvetica] text-[50px] font-bold leading-[58px] tracking-[0.25px] text-[#2e2c49]">
          Delicious and healthy food for your body
        </h2>
        <p className="font-['Red_Hat_Text-Regular',Helvetica] text-lg leading-7 text-[#777e90]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>
      </div>

      <div className="relative">
        <Card className="border-none shadow-none">
          <CardContent className="p-0">
            {/* Delivery person illustration */}
            <div className="relative h-[533px] w-[615px]">
              {/* This is a simplified representation of the complex illustration */}
              <Image
                src=""
                alt="Delivery person on a scooter carrying food"
                className="size-full object-contain"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
