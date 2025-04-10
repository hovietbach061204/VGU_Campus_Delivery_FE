import React from 'react';
import { ShoppingCartIcon } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/Card';

export default function MenuSection() {
  const menuItems = [
    {
      id: 1,
      name: 'Stewed cabbage with sauce',
      price: '$5.90',
      image: '/images/cabbage.png',
      featured: false,
    },
    {
      id: 2,
      name: 'Puree soup with turkey pieces',
      price: '$7.55',
      image: '/images/soup.png',
      featured: true,
    },
    {
      id: 3,
      name: 'Chicken with vegetables',
      price: '$3.39',
      image: '/images/chicken.png',
      featured: false,
    },
    {
      id: 4,
      name: 'Chicken with vegetables',
      price: '$3.39',
      image: '/images/chicken.png',
      featured: false,
    },
    {
      id: 5,
      name: 'Traditional Greek salad',
      price: '$4.99',
      image: '/images/greek-salad.png',
      featured: false,
    },
    {
      id: 6,
      name: 'Three-Meat Special Lasagna',
      price: '$5.10',
      image: '/images/lasagna.png',
      featured: false,
    },
    {
      id: 7,
      name: 'Veggie Tagliatelle Bolognese',
      price: '$4.80',
      image: '/images/veggie.png',
      featured: false,
    },
    {
      id: 8,
      name: 'Veggie Tagliatelle Bolognese',
      price: '$4.80',
      image: '/images/veggie.png',
      featured: false,
    },
  ];

  return (
    <section className="w-full bg-[#29b0674c] px-4 py-16 lg:rounded-bl-[250px] lg:px-[80px] xl:px-[170px]">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-12">
        {/* Heading */}
        <h2 className="text-center text-3xl font-bold leading-tight tracking-tight text-[#2e2c49] [font-family:'Red_Rose-Bold',Helvetica] sm:text-4xl lg:text-[50px]">
          Popular dishes with delivery
        </h2>

        {/* Description */}
        <p className="max-w-xl text-center text-base leading-7 text-[#777e90] [font-family:'Red_Hat_Text-Regular',Helvetica] sm:text-lg">
          The most delicious and healthy dishes from our chefs. You can order
          this meal separately or as part of a meal plan.
        </p>

        {/* Menu Items */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-14 xl:grid-cols-4">
          {menuItems.map((item) => (
            <Card
              key={item.id}
              className={`mx-auto h-[458px] w-full max-w-[350px] rounded-[28px] border-2 ${
                item.featured
                  ? 'bg-[#fa9f3d] shadow-[0px_28px_63px_-13px_#fa9f3d4c]'
                  : 'border-[#e5efff] bg-white'
              }`}
            >
              <CardContent className="relative flex h-full flex-col items-center p-0">
                <div className="mt-4 size-[230px] sm:size-[250px]">
                  <Image
                    className="size-full rounded-xl object-cover"
                    alt={item.name}
                    src={item.image}
                    width={250}
                    height={250}
                  />
                </div>

                <div
                  className={`mt-4 w-[90%] text-center text-xl font-bold leading-snug sm:text-2xl ${
                    item.featured ? 'text-white' : 'text-[#4d4c66]'
                  } [font-family:'Red_Rose-Bold',Helvetica]`}
                >
                  {item.name}
                </div>

                <div className="absolute bottom-[30px] left-6 text-xl font-normal text-[#2e2c49] [font-family:'Red_Rose-Regular',Helvetica] sm:text-2xl">
                  {item.price}
                </div>

                <Button
                  className={`absolute bottom-[24px] right-[24px] size-[38px] p-0 ${
                    item.featured && item.id === 2
                      ? 'bg-[#fffefc]'
                      : 'bg-[#fa9f3d]'
                  } rounded-lg`}
                  size="icon"
                >
                  <ShoppingCartIcon className="size-5" />
                </Button>
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
