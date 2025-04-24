'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/NavigationMenu';

export const TestimonialsSection = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const navItems = [
    { label: 'Home', isBold: true, href: '#' },
    { label: 'Tracking', isBold: false, href: '#' },
    { label: 'Shipping', isBold: false, href: '#' },
    { label: 'Locations', isBold: false, href: '#' },
    { label: 'Support', isBold: false, href: '#' },
  ];

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    setIsLoggedIn(false);
    router.push('/SignIn'); // redirect after logout
  };

  return (
    <header className="w-full bg-[#ff785b] px-4 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row md:gap-8">
        <div className="flex w-full flex-col items-center justify-between gap-6 md:flex-row md:gap-12">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-white sm:text-[22px]">
              Food Delivery
            </span>
          </div>

          {/* Navigation */}
          <nav>
            <NavigationMenu>
              <NavigationMenuList className="flex items-center gap-6 sm:gap-[30px] md:gap-[45px]">
                {navItems.map((item, index) => (
                  <NavigationMenuItem key={index}>
                    <NavigationMenuLink
                      href={item.href}
                      className={`text-base text-white sm:text-lg md:text-xl ${
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

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            {!isLoggedIn ? (
              <Link href="/SignIn">
                <Button
                  variant="outline"
                  className="h-[44px] w-[110px] rounded-[10px] border-2 border-white bg-transparent text-base font-medium text-white hover:bg-white/10 sm:h-[47px] sm:w-[129px] sm:text-xl"
                >
                  Sign In
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/UserProfile">
                  <Button
                    variant="outline"
                    className="h-[44px] w-[110px] rounded-[10px] border-2 border-white bg-transparent text-base font-medium text-white hover:bg-white/10 sm:h-[47px] sm:w-[129px] sm:text-xl"
                  >
                    Profile
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  className="h-[44px] w-[110px] rounded-[10px] border-2 border-white bg-transparent text-base font-medium text-white hover:bg-white/10 sm:h-[47px] sm:w-[129px] sm:text-xl"
                >
                  Sign Out
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TestimonialsSection;
