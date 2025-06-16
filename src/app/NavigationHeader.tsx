'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/NavigationMenu';

export const NavigationHeader = (): React.JSX.Element => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userName, setUserName] = useState<string>(''); // Store the signed-in user's name

  // Check user sign-in status on load
  useEffect(() => {
    const userToken = localStorage.getItem('userToken'); // Check if user is signed in
    const storedUserName = localStorage.getItem('userName'); // Get the username
    setIsSignedIn(!!userToken); // Set sign-in status
    setUserName(storedUserName || ''); // Set the username if available
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('userToken'); // Clear user token
    localStorage.removeItem('userName'); // Clear username
    setIsSignedIn(false); // Update sign-in status
    setUserName(''); // Clear username
  };

  const navItems = [
    { label: 'Home', isBold: true, href: '/' },
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
          {!isSignedIn ? (
            <>
              <Link href="/SignIn">
                <Button
                  variant="outline"
                  className="rounded-full border-white bg-transparent text-white hover:bg-white/20"
                >
                  Sign in
                </Button>
              </Link>

              <Link href="/Register">
                <Button
                  variant="outline"
                  className="rounded-full border-white bg-transparent text-white hover:bg-white/20"
                >
                  Sign Up
                </Button>
              </Link>
            </>
          ) : (
            <>
              <span className="font-medium text-white">
                Welcome, {userName}
              </span>
              <Link href="/UserProfile">
                <Button
                  variant="outline"
                  className="rounded-full border-white bg-transparent text-white hover:bg-white/20"
                >
                  Profile
                </Button>
              </Link>

              <Button
                onClick={handleSignOut}
                variant="outline"
                className="rounded-full border-white bg-transparent text-white hover:bg-white/20"
              >
                Sign Out
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavigationHeader;
