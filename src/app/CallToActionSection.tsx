import React, { JSX } from 'react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/input';

export default function CallToActionSection(): JSX.Element {
  // Statistics data for mapping
  const stats = [
    { value: '350+', label: 'Order per minute' },
    { value: '10x', label: 'Faster delivery' },
    { value: '10+', label: 'In Country' },
    { value: '99.9%', label: 'Order accuracy' },
  ];

  return (
    <section className="w-full px-4 py-12">
      <Card className="relative mx-auto w-full max-w-7xl overflow-hidden rounded-[30px] p-8">
        <CardContent className="flex flex-col gap-8 p-0 md:flex-row">
          <div className="flex-1">
            <h2 className="mb-12 text-4xl font-bold leading-tight tracking-tight text-[#204944] md:text-5xl lg:text-[70px]">
              We deliver your food all over the school within{' '}
              <span className="text-[#9757d7]">30 minutes</span>
            </h2>

            <div className="mb-12 flex items-center overflow-hidden rounded-[10px] bg-[#9757d71a]">
              <Input
                className="h-[82px] flex-1 border-0 bg-transparent p-6 text-lg text-[#777e90]"
                placeholder="Enter location address"
                defaultValue=""
              />
              <Button className="h-[82px] rounded-[10px] bg-[#fa9f3d] px-12 text-xl font-bold text-white hover:bg-[#fa9f3d]/90">
                Explore
              </Button>
            </div>

            <div className="mt-4 flex flex-wrap gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center md:items-start"
                >
                  <span className="font-['Red_Rose-Bold',Helvetica] text-4xl font-bold text-[#204944]">
                    {stat.value}
                  </span>
                  <span className="mt-2 text-[#777e90]">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="shrink-0 self-end">
            <Image
              className="h-auto w-full max-w-[516px]"
              alt="Delivery person on motorbike"
              src=""
            />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
