'use client';

import React from 'react';
import { ShoppingCartIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/Card';

export default function MenuSection() {
  const menuItems = [
    {
      id: 1,
      name: 'Stewed cabbage with sauce',
      price: '$5.90',
      featured: false,
    },
    {
      id: 2,
      name: 'Puree soup with turkey pieces',
      price: '$7.55',
      featured: false,
    },
    {
      id: 3,
      name: 'Chicken with vegetables',
      price: '$3.39',
      featured: false,
    },
    {
      id: 4,
      name: 'Chicken with vegetables',
      price: '$3.39',
      featured: false,
    },
    {
      id: 5,
      name: 'Traditional Greek salad',
      price: '$4.99',
      featured: false,
    },
    {
      id: 6,
      name: 'Three-Meat Special Lasagna',
      price: '$5.10',
      featured: false,
    },
    {
      id: 7,
      name: 'Veggie Tagliatelle Bolognese',
      price: '$4.80',
      featured: false,
    },
    {
      id: 8,
      name: 'Veggie Tagliatelle Bolognese',
      price: '$4.80',
      featured: false,
    },
  ];

  return (
    <section className="w-full bg-[#29b0671a] px-4 py-16 sm:px-8 lg:rounded-bl-[250px] lg:px-16 xl:px-[170px]">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-12">
        {/* Heading */}
        <h2 className="text-center text-3xl font-bold leading-tight tracking-tight text-[#2e2c49] [font-family:'Red_Rose-Bold',Helvetica] sm:text-4xl lg:text-[50px]">
          Popular dishes with delivery
        </h2>

        {/* Description */}
        <p className="max-w-2xl text-center text-base leading-7 text-[#777e90] [font-family:'Red_Hat_Text-Regular',Helvetica] sm:text-lg">
          The most delicious and healthy dishes from our chefs. You can order
          this meal separately or as part of a meal plan.
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {menuItems.map((item) => (
            <Card
              key={item.id}
              className={`mx-auto flex h-[458px] w-full max-w-[350px] flex-col justify-between rounded-[28px] border-2 ${
                item.featured
                  ? 'bg-[#fa9f3d] shadow-[0px_28px_63px_-13px_#fa9f3d4c]'
                  : 'border-[#e5efff] bg-white'
              }`}
            >
              <CardContent className="flex h-full flex-col items-center p-4">
                {/* Image Placeholder */}
                <div className="mb-4 flex size-[230px] items-center justify-center rounded-xl bg-gray-200 text-gray-500 sm:size-[250px]">
                  <span className="text-sm">Image Disabled</span>
                </div>

                {/* Name */}
                <div
                  className={`mb-4 w-[90%] text-center text-xl font-bold leading-snug sm:text-2xl ${
                    item.featured ? 'text-white' : 'text-[#4d4c66]'
                  } [font-family:'Red_Rose-Bold',Helvetica]`}
                >
                  {item.name}
                </div>

                {/* Bottom Row (Price + Button) */}
                <div className="mt-auto flex w-full items-center justify-between px-2">
                  <span className="text-xl font-normal text-[#2e2c49] [font-family:'Red_Rose-Regular',Helvetica] sm:text-2xl">
                    {item.price}
                  </span>
                  <Button
                    className={`size-[38px] p-0 ${
                      item.featured && item.id === 2
                        ? 'bg-[#fffefc]'
                        : 'bg-[#fa9f3d]'
                    } rounded-lg`}
                    size="icon"
                  >
                    <ShoppingCartIcon className="size-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Button */}
        <Button className="h-[52px] w-[180px] rounded-[10px] bg-[#fdad00] text-lg font-bold text-white shadow-[0px_8px_12px_#ffeaa273] [font-family:'Red_Rose-Bold',Helvetica] hover:bg-[#fdad00]/90 sm:text-[22px]">
          See all menu
        </Button>
      </div>
    </section>
  );
}
