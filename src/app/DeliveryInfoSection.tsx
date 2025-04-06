import React, { JSX } from 'react';
import { Bike, MapPin, Store, Utensils } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/Card';

export default function DeliveryInfoSection(): JSX.Element {
  // Data for delivery steps
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
    <div className="w-full py-12">
      <div className="flex flex-wrap justify-between gap-5">
        {deliverySteps.map((step) => (
          <div key={step.id} className="flex flex-col items-start">
            <div className="relative mb-6">
              <div className="flex size-[74px] items-center justify-center rounded-full bg-white">
                {step.icon}
              </div>
            </div>

            <Card className="h-[341px] w-[385px] rounded-[17px] border-none bg-[#ffedd1]">
              <CardContent className="px-8 pt-8">
                <h3 className="mb-6 font-['Red_Rose-Bold',Helvetica] text-[22px] font-bold leading-6 text-[#204944]">
                  {step.title}
                </h3>
                <p className="font-['Red_Hat_Text-Regular',Helvetica] text-lg leading-[26px] text-[#777e90]">
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
