import React, { JSX } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/NavigationMenu';

export const TestimonialsSection = (): JSX.Element => {
  const navItems = [
    { label: 'Home', isBold: true, href: '#' },
    { label: 'Tracking', isBold: false, href: '#' },
    { label: 'Shipping', isBold: false, href: '#' },
    { label: 'Locations', isBold: false, href: '#' },
    { label: 'Support', isBold: false, href: '#' },
  ];

  return (
    <header className="relative w-full bg-[#ff785b] px-4 py-8">
      <div className="relative overflow-hidden">
        {/* Decorative vectors */}
        <div className="absolute left-0 top-[5px] hidden h-[194px] w-[627px] lg:block">
          <Image
            className="size-full"
            alt="Decorative vector"
            src="/images/vector-left.png"
          />
        </div>
        <div className="absolute bottom-0 right-0 hidden h-[152px] w-[627px] lg:block">
          <Image
            className="size-full"
            alt="Decorative vector"
            src="/images/vector-right.png"
          />
        </div>

        {/* Navigation content */}
        <div className="container mx-auto flex flex-col items-center justify-between gap-6 md:flex-row md:gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image
              className="size-[48px] object-cover sm:size-[54px]"
              alt="Food Delivery Logo"
              src="/images/Pizza ico.png"
              width={54}
              height={54}
            />
            <span className="text-xl font-bold text-white [font-family:'Red_Rose-Bold',Helvetica] sm:text-[22px]">
              Food Delivery
            </span>
          </div>

          {/* Navigation + Auth combined in one row */}
          <div className="flex flex-col items-center gap-4 md:flex-row md:gap-12">
            {/* Navigation Menu */}
            <NavigationMenu>
              <NavigationMenuList className="flex items-center gap-6 sm:gap-[30px] md:gap-[45px]">
                {navItems.map((item, index) => (
                  <NavigationMenuItem key={index}>
                    <NavigationMenuLink
                      href={item.href}
                      className={`text-base text-white sm:text-lg md:text-xl ${
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

            {/* Auth Buttons side by side */}
            <div className="flex items-center gap-4">
              <Link href="/SignIn">
                <Button
                  variant="outline"
                  className="h-[44px] w-[110px] rounded-[10px] border-2 border-white bg-transparent text-base font-medium text-white [font-family:'Red_Hat_Text-Medium',Helvetica] hover:bg-white/10 sm:h-[47px] sm:w-[129px] sm:text-xl"
                >
                  Sign in
                </Button>
              </Link>

              <Link href="/Userprofile">
                <Button
                  variant="outline"
                  className="h-[44px] w-[110px] rounded-[10px] border-2 border-white bg-transparent text-base font-medium text-white [font-family:'Red_Hat_Text-Medium',Helvetica] hover:bg-white/10 sm:h-[47px] sm:w-[129px] sm:text-xl"
                >
                  Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TestimonialsSection;
