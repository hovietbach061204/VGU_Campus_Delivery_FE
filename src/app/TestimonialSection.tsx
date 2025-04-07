import React, { JSX } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button'; // Updated import for Button
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/NavigationMenu'; // Import necessary NavigationMenu components
export const TestimonialsSection = (): JSX.Element => {
  // Navigation menu items with `href` added to each item
  const navItems = [
    { label: 'Home', isBold: true, href: '#' },
    { label: 'Tracking', isBold: false, href: '#' },
    { label: 'Shipping', isBold: false, href: '#' },
    { label: 'Locations', isBold: false, href: '#' },
    { label: 'Support', isBold: false, href: '#' },
  ];

  return (
    <header className="relative w-full bg-[#ff785b] py-10">
      <div className="relative overflow-hidden">
        {/* Decorative vectors */}
        <div className="absolute left-0 top-[5px] h-[194px] w-[627px]">
          <Image className="size-full" alt="Decorative vector" src="" />
        </div>

        <div className="absolute bottom-0 right-0 h-[152px] w-[627px]">
          <Image className="size-full" alt="Decorative vector" src="" />
        </div>

        {/* Main navigation container */}
        <div className="container mx-auto flex items-center justify-between px-4">
          {/* Logo and brand name */}
          <div className="flex items-center gap-5">
            <Image
              className="size-[54px] object-cover"
              alt="Food Delivery Logo"
              src=""
            />
            <div className="text-[22px] font-bold leading-7 text-white [font-family:'Red_Rose-Bold',Helvetica]">
              Food Delivery
            </div>
          </div>

          {/* Navigation and auth section */}
          <div className="flex items-center gap-[275px]">
            {/* Main navigation */}
            <NavigationMenu>
              <NavigationMenuList className="flex items-center gap-[45px]">
                {navItems.map((item, index) => (
                  <NavigationMenuItem key={index}>
                    <NavigationMenuLink
                      href={item.href} // Ensure href is passed to NavigationMenuLink
                      className={`text-[22px] leading-[26px] text-white ${
                        item.isBold
                          ? "font-bold [font-family:'Red_Hat_Text-Bold',Helvetica]"
                          : "font-medium [font-family:'Red_Hat_Text-Medium',Helvetica]"
                      }`}
                    >
                      {item.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            {/* Auth section */}
            <div className="flex items-center gap-[35px]">
              <Link href="/SignIn">
                <div className="text-xl font-medium leading-[26px] text-white [font-family:'Red_Hat_Text-Medium',Helvetica]">
                  Sign in
                </div>
              </Link>
              <Button
                variant="outline"
                className="h-[47px] w-[129px] rounded-[10px] border-2 border-solid border-white bg-transparent text-xl font-medium text-white [font-family:'Red_Hat_Text-Medium',Helvetica]"
              >
                Register
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TestimonialsSection;
