'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/NavigationMenu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const NavigationHeader = (): React.JSX.Element => {
  const navItems = [
    { label: 'Home', isBold: true, href: '#' },
    { label: 'Tracking', isBold: false, href: '#' },
    { label: 'Shipping', isBold: false, href: '#' },
    { label: 'Locations', isBold: false, href: '#' },
    { label: 'Support', isBold: false, href: '#' },
  ];

  return (
    <header className="w-full rounded-b-xl bg-[#ff785b] p-4 shadow-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold tracking-tight text-white">
            Food Delivery
          </span>
        </div>

        <nav className="hidden flex-1 justify-center md:flex">
          <NavigationMenu>
            <NavigationMenuList className="flex gap-8">
              {navItems.map((item, index) => (
                <NavigationMenuItem key={index}>
                  <NavigationMenuLink
                    href={item.href}
                    className={`text-base text-white transition hover:underline ${
                      item.isBold ? 'font-bold' : 'font-medium'
                    }`}
                  >
                    {item.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/SignIn">
            <Button
              variant="outline"
              className="rounded-full border-white bg-transparent text-white hover:bg-white/20"
            >
              Sign in
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="rounded-full border-white bg-transparent text-white hover:bg-white/20"
              >
                Profile
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="rounded-md bg-white text-black shadow-lg"
            >
              <DropdownMenuItem>
                <Link href="/UserProfile" className="block w-full">
                  User
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/DriverProfile" className="block w-full">
                  Driver
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default NavigationHeader;
