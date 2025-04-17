'use client';

import React from 'react';
import { Minus, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
/*import Input from '@/components/ui/input'; */

export default function DishDetail() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#ffe5dc] to-[#fff8f6] pb-20">
      {/* Dish Image */}
      <div className="h-[300px] w-full overflow-hidden rounded-b-[40px] bg-gray-300 sm:h-[400px]">
        <div className="flex size-full items-center justify-center text-3xl text-white">
          🍽️ Dish Image Placeholder
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 pt-8 sm:px-6 lg:px-10">
        {/* Dish Title */}
        <h1 className="text-3xl font-bold text-[#2e2c49] sm:text-4xl">
          Fried Rice
        </h1>

        {/* Description */}
        <div className="mt-4 space-y-2">
          <h2 className="text-lg font-semibold text-[#ff785b]">Description</h2>
          <p className="text-[#555]">
            Our Fried Rice is made from basmati rice, stir-fried with carrots,
            sweet corn, peas, onions, and savory soy sauce. Served with sides of
            your choice.
          </p>
        </div>

        {/* Ingredients */}
        <div className="mt-6 space-y-2">
          <h2 className="text-lg font-semibold text-[#ff785b]">Ingredients</h2>
          <div className="flex flex-wrap gap-4">
            {['🍚', '🥕', '🌽', '🧅', '🧄'].map((emoji, idx) => (
              <div
                key={idx}
                className="flex size-14 items-center justify-center rounded-xl bg-white text-2xl shadow-md"
              >
                {emoji}
              </div>
            ))}
          </div>
        </div>

        {/* Additions */}
        <div className="mt-6 space-y-2">
          <h2 className="text-lg font-semibold text-[#ff785b]">Additions</h2>
          <select className="w-full rounded-xl border border-[#ff785b] bg-white px-4 py-2 text-[#2e2c49] shadow focus:outline-none focus:ring-2 focus:ring-[#ff785b]/40">
            <option>Select addition...</option>
            <option>Extra Chicken</option>
            <option>Extra Sauce</option>
            <option>Extra Veggies</option>
          </select>
        </div>

        {/* Price and Quantity */}
        <div className="mt-8 flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Price & Quantity Selector */}
          <div className="flex items-center gap-4">
            <span className="rounded-full bg-[#ff785b] px-6 py-3 text-lg font-bold text-white shadow-md">
              ₦500
            </span>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="size-8 rounded-full border border-[#ff785b] p-0 text-[#ff785b]"
              >
                <Minus size={16} />
              </Button>
              <span className="px-2 text-lg font-medium text-[#2e2c49]">1</span>
              <Button
                variant="outline"
                className="size-8 rounded-full border border-[#ff785b] p-0 text-[#ff785b]"
              >
                <Plus size={16} />
              </Button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button className="mt-2 h-[45px] w-full rounded-[33px] bg-[#ff785b] text-white hover:bg-[#e96c4e] sm:mt-0 sm:w-[200px]">
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
