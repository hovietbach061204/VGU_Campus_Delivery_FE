'use client';

import React from 'react';

import { Button } from '@/components/ui/button';
import Separator from '@/components/ui/Separator';

export default function ChooseRestaurant() {
  const restaurants = [
    'Restaurant 1',
    'Restaurant 2',
    'Restaurant 3',
    'Restaurant 4',
    'Restaurant 5',
    'Restaurant 6',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#ffe5dc] to-[#fff8f6] text-[#2e2c49]">
      {/* Decorative Top Banner */}
      <div className="relative rounded-b-[40px] bg-[#ff785b] px-6 py-10 text-white shadow-md">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold sm:text-5xl">Restaurants</h1>
          <p className="mt-3 text-sm sm:text-base">
            Find the best places to eat around you. Meals prepared fresh and
            fast.
          </p>

          {/* Search Bar */}
          <div className="mx-auto mt-6 w-full max-w-md">
            <input
              type="text"
              placeholder="Search Restaurants..."
              className="w-full rounded-full border-none bg-white px-6 py-2 text-[#333] shadow placeholder:text-[#aaa] focus:outline-none focus:ring-2 focus:ring-[#fff]/40"
            />
          </div>
        </div>
      </div>

      {/* Decorative separator */}
      <div className="mb-6 mt-12 text-center text-sm uppercase tracking-wide text-[#aaa]">
        Available Restaurants
        <Separator className="mx-auto mt-2 h-0.5 w-24 bg-[#ff785b]" />
      </div>

      {/* Grid */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 pb-20 sm:grid-cols-2 lg:grid-cols-3">
        {restaurants.map((name, index) => (
          <div
            key={index}
            className="group flex flex-col items-center justify-between rounded-2xl bg-white p-6 text-center shadow-md transition hover:scale-105 hover:shadow-lg"
          >
            {/* Decorative Placeholder */}
            <div className="mb-4 flex size-40 items-center justify-center rounded-full bg-gray-200 text-4xl">
              🍽️
            </div>

            {/* Restaurant Name */}
            <h3 className="mb-2 text-xl font-bold text-[#2e2c49]">{name}</h3>

            {/* CTA Button */}
            <Button className="rounded-full bg-[#ff785b] px-6 py-2 text-white transition hover:bg-[#e96c4e]">
              Enter
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
