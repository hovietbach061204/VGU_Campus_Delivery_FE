'use client';

import React from 'react';

import { Button } from '@/components/ui/button';
import Separator from '@/components/ui/Separator';

export default function ChooseDishes() {
  const dishes = [
    'Fried Rice',
    'Spaghetti Bolognese',
    'Grilled Chicken',
    'Jollof Rice',
    'Spring Rolls',
    'Salmon Bowl',
    'Burger Supreme',
    'Miso Ramen',
    'Beef Stew',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#ffe5dc] to-[#fff8f6] text-[#2e2c49]">
      {/* Decorative Header */}
      <div className="relative rounded-b-[50px] bg-[#ff785b] px-6 py-12 text-white shadow-md">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold sm:text-5xl">
            🍛 Choose Your Dish
          </h1>
          <p className="mt-3 text-sm sm:text-base">
            Select from our freshly made meals. All dishes are served hot and
            delicious!
          </p>

          {/* Search Bar */}
          <div className="mx-auto mt-6 w-full max-w-md">
            <input
              type="text"
              placeholder="Search Dishes..."
              className="w-full rounded-full border-none bg-white px-6 py-2 text-[#333] shadow placeholder:text-[#aaa] focus:outline-none focus:ring-2 focus:ring-[#fff]/40"
            />
          </div>
        </div>
      </div>

      {/* Decorative Label */}
      <div className="mb-6 mt-12 text-center text-sm uppercase tracking-wide text-[#aaa]">
        Available Dishes
        <Separator className="mx-auto mt-2 h-0.5 w-24 bg-[#ff785b]" />
      </div>

      {/* Grid of Dishes */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 pb-20 sm:grid-cols-2 lg:grid-cols-3">
        {dishes.map((dish, index) => (
          <div
            key={index}
            className="group flex flex-col items-center justify-between rounded-2xl bg-white p-6 text-center shadow-md transition hover:scale-105 hover:shadow-lg"
          >
            {/* Decorative Image Placeholder */}
            <div className="mb-4 flex size-40 items-center justify-center rounded-full bg-gray-200 text-4xl">
              🍽️
            </div>

            {/* Dish Name */}
            <h3 className="mb-2 text-xl font-bold text-[#2e2c49]">{dish}</h3>

            {/* Order Button */}
            <Button className="rounded-full bg-[#ff785b] px-6 py-2 text-white transition hover:bg-[#e96c4e]">
              Order Now
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
