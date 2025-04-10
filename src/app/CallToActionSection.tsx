import React, { JSX } from 'react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/input';

export default function CallToActionSection(): JSX.Element {
  const stats = [
    { value: '350+', label: 'Order per minute' },
    { value: '10x', label: 'Faster delivery' },
    { value: '10+', label: 'In Country' },
    { value: '99.9%', label: 'Order accuracy' },
  ];

  return (
    <section className="w-full px-4 py-12">
      <Card className="relative mx-auto w-full max-w-7xl overflow-hidden rounded-[30px] p-6 sm:p-8">
        <CardContent className="flex flex-col gap-10 p-0 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <h2 className="mb-8 text-3xl font-bold leading-tight tracking-tight text-[#204944] sm:text-4xl md:text-5xl lg:text-[64px]">
              We deliver your food all over the school within{' '}
              <span className="text-[#9757d7]">30 minutes</span>
            </h2>

            <div className="mb-10 flex flex-col gap-4 overflow-hidden rounded-[10px] bg-[#9757d71a] sm:flex-row sm:items-center">
              <Input
                className="h-[60px] flex-1 border-0 bg-transparent px-4 text-base text-[#777e90] sm:h-[70px]"
                placeholder="Enter location address"
                defaultValue=""
              />
              <Button className="h-[60px] rounded-[10px] bg-[#fa9f3d] px-8 text-lg font-bold text-white hover:bg-[#fa9f3d]/90 sm:h-[70px] sm:px-12 sm:text-xl">
                Explore
              </Button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-6 sm:flex sm:flex-wrap sm:gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center sm:items-start"
                >
                  <span className="font-['Red_Rose-Bold',Helvetica] text-2xl font-bold text-[#204944] sm:text-3xl md:text-4xl">
                    {stat.value}
                  </span>
                  <span className="mt-1 text-sm text-[#777e90] sm:text-base">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Image section - hidden on very small screens for space */}
          <div className="mt-10 hidden sm:block md:mt-0 md:shrink-0 md:self-end">
            <Image
              className="h-auto w-full max-w-[300px] md:max-w-[400px] lg:max-w-[516px]"
              alt="Delivery person on motorbike"
              src="/images/Motorbikeman.png" // <-- put your actual image path here
              width={516}
              height={516}
            />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
