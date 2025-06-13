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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const NavigationHeader = (): React.JSX.Element => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const role = localStorage.getItem('userRole');
    setIsLoggedIn(!!token);
    setUserRole(role);

    // Listen for new orders
    const handleNewOrder = () => {
      const count = parseInt(localStorage.getItem('newOrdersCount') || '0');
      setNewOrdersCount(count);
    };

    // Load initial count
    handleNewOrder();

    // Listen for storage changes
    window.addEventListener('storage', handleNewOrder);
    window.addEventListener('newOrderCreated', handleNewOrder);

    return () => {
      window.removeEventListener('storage', handleNewOrder);
      window.removeEventListener('newOrderCreated', handleNewOrder);
    };
  }, []);

  const handleBellClick = () => {
    // Clear the notification count
    localStorage.setItem('newOrdersCount', '0');
    setNewOrdersCount(0);
    // Navigate to OrderDashboard
    router.push('/OrderDashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('userRole');
    setIsLoggedIn(false);
    setUserRole(null);
    router.push('/SignIn');
  };

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
          {isLoggedIn && (
            <button
              onClick={handleBellClick}
              className="relative rounded-full border border-white bg-transparent p-2 text-white transition-colors hover:bg-white/20"
              title="View Orders"
            >
              <svg
                className="size-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {newOrdersCount > 0 && (
                <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {newOrdersCount > 9 ? '9+' : newOrdersCount}
                </span>
              )}
            </button>
          )}

          {!isLoggedIn ? (
            <Link href="/SignIn">
              <Button
                variant="outline"
                className="rounded-full border-white bg-transparent text-white hover:bg-white/20"
              >
                Sign in
              </Button>
            </Link>
          ) : (
            <>
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
                      👤 User Profile
                    </Link>
                  </DropdownMenuItem>

                  {/* Purchaser-specific options */}
                  {(!userRole || userRole === 'Purchaser') && (
                    <>
                      <DropdownMenuItem>
                        <Link href="/OrderDashboard" className="block w-full">
                          📋 My Orders
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/Restaurant_Order" className="block w-full">
                          🍽️ Place Order
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  {/* Deliveryman-specific options */}
                  {userRole === 'Deliveryman' && (
                    <>
                      <DropdownMenuItem>
                        <Link href="/DriverProfile" className="block w-full">
                          🚗 Driver Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/Driver" className="block w-full">
                          🚚 Driver Dashboard
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                onClick={handleLogout}
                variant="outline"
                className="rounded-full border-white bg-transparent text-white hover:bg-white/20"
              >
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavigationHeader;
