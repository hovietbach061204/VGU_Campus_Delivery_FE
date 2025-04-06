import React from 'react';
import { ShoppingCartIcon } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/Card';

export default function MenuSection() {
  // Menu items data for mapping
  const menuItems = [
    {
      id: 1,
      name: 'Stewed cabbage with sauce',
      price: '$5.90',
      image: '',
      featured: false,
    },
    {
      id: 2,
      name: 'Puree soup with turkey pieces',
      price: '$7.55',
      image: '',
      featured: true,
    },
    {
      id: 3,
      name: 'Chicken with vegetables',
      price: '$3.39',
      image: '',
      featured: false,
    },
    {
      id: 4,
      name: 'Chicken with vegetables',
      price: '$3.39',
      image: '',
      featured: false,
    },
    {
      id: 5,
      name: 'Traditional Greek salad',
      price: '$4.99',
      image: '',
      featured: false,
    },
    {
      id: 6,
      name: 'Three-Meat Special Lasagna',
      price: '$5.10',
      image: '',
      featured: false,
    },
    {
      id: 7,
      name: 'Veggie Tagliatelle Bolognese',
      price: '$4.80',
      image: '',
      featured: false,
    },
    {
      id: 8,
      name: 'Veggie Tagliatelle Bolognese',
      price: '$4.80',
      image: '',
      featured: false,
    },
  ];

  return (
    <section className="w-full rounded-[0px_0px_0px_250px] bg-[#29b0674c] px-[170px] py-[109px]">
      <div className="flex flex-col items-center gap-[65px]">
        <h2 className="text-center text-[50px] font-bold leading-[58px] tracking-[0.25px] text-[#2e2c49] [font-family:'Red_Rose-Bold',Helvetica]">
          Popular dishes with delivery
        </h2>

        <p className="w-[663px] text-center text-lg font-normal leading-7 tracking-[0.09px] text-[#777e90] [font-family:'Red_Hat_Text-Regular',Helvetica]">
          The most delicious and healthy dishes from our chefs. You can order
          this meal separately or as part of a meal plan.
        </p>

        <div className="flex w-full flex-col items-center gap-[104px]">
          <div className="flex w-full flex-wrap items-start gap-[79px_60px]">
            {menuItems.map((item) => (
              <div key={item.id} className="w-[350px]">
                <Card
                  className={`h-[458px] w-[350px] rounded-[28px] border-2 ${
                    item.featured
                      ? 'bg-[#fa9f3d] shadow-[0px_28px_63px_-13px_#fa9f3d4c]'
                      : 'border-[#e5efff] bg-white'
                  }`}
                >
                  <CardContent className="relative h-full p-0">
                    <div className="mx-auto mt-px size-[296px]">
                      <Image
                        className="size-full object-cover"
                        alt={item.name}
                        src={item.image}
                      />
                    </div>

                    <div
                      className={`mx-auto mt-4 w-[267px] text-center text-2xl font-bold leading-[34px] tracking-normal ${
                        item.featured ? 'text-white' : 'text-[#4d4c66]'
                      } [font-family:'Red_Rose-Bold',Helvetica]`}
                    >
                      {item.name}
                    </div>

                    <div className="absolute bottom-[30px] left-8 whitespace-nowrap text-3xl font-normal leading-6 tracking-normal text-[#2e2c49] [font-family:'Red_Rose-Regular',Helvetica]">
                      {item.price}
                    </div>

                    <Button
                      className={`absolute bottom-[24px] right-[36px] size-[38px] p-0 ${
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
              </div>
            ))}
          </div>

          <Button className="h-[60px] w-[205px] rounded-[10px] bg-[#fdad00] text-[22px] font-bold leading-[26px] tracking-normal shadow-[0px_8px_12px_#ffeaa273] [font-family:'Red_Rose-Bold',Helvetica] hover:bg-[#fdad00]/90">
            See all menu
          </Button>
        </div>
      </div>
    </section>
  );
}
