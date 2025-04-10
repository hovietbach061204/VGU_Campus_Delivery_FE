import React, { JSX } from 'react';
import { Bike, MapPin, Store, Utensils } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/Card';

export default function DeliveryInfoSection(): JSX.Element {
  const deliverySteps = [
    {
      id: 1,
      title: 'Choose your location',
      description:
        'Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      icon: <MapPin size={42} className="text-[#204944]" />,
    },
    {
      id: 2,
      title: 'Select Restaurant',
      description:
        'Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      icon: <Store size={42} className="text-[#204944]" />,
    },
    {
      id: 3,
      title: 'Make your order',
      description:
        'Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      icon: <Utensils size={42} className="text-[#204944]" />,
    },
    {
      id: 4,
      title: 'Food is on the way',
      description:
        'Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      icon: <Bike size={42} className="text-[#204944]" />,
    },
  ];

  return (
    <div className="w-full px-4 py-12">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {deliverySteps.map((step) => (
          <div key={step.id} className="flex flex-col items-start">
            <div className="relative mb-4 sm:mb-6">
              <div className="flex size-[64px] items-center justify-center rounded-full bg-white shadow-md sm:size-[74px]">
                {step.icon}
              </div>
            </div>

            <Card className="w-full rounded-[17px] border-none bg-[#ffedd1]">
              <CardContent className="px-6 pb-4 pt-6 sm:px-8 sm:pb-6 sm:pt-8">
                <h3 className="mb-4 font-['Red_Rose-Bold',Helvetica] text-lg font-bold leading-snug text-[#204944] sm:mb-6 sm:text-xl">
                  {step.title}
                </h3>
                <p className="font-['Red_Hat_Text-Regular',Helvetica] text-sm leading-relaxed text-[#777e90] sm:text-base">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
