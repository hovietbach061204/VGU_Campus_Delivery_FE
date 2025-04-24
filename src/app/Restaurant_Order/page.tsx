/* File: app/page.tsx (Next.js 15 App Router)
   Description: Main order page component in React for a restaurant UI */

'use client';

import { useState } from 'react';
import clsx from 'clsx';

const categories = [
  {
    name: 'Abo',
    items: [
      { name: 'Beef Abo', price: 100 },
      { name: 'Chicken Abo', price: 90 },
    ],
  },
  {
    name: 'Snack',
    items: [
      { name: 'Spring Roll', price: 60 },
      { name: 'Fried Tofu', price: 50 },
    ],
  },
  {
    name: 'Fried rice',
    items: [
      { name: 'Seafood Fried Rice', price: 110 },
      { name: 'Vegetable Fried Rice', price: 95 },
    ],
  },
  {
    name: 'Milk Tea',
    items: [
      { name: 'Classic Milk Tea', price: 40 },
      { name: 'Matcha Milk Tea', price: 45 },
    ],
  },
];

interface OrderItem {
  name: string;
  qty: number;
  price: number;
  portion: string;
  customization: string;
  category: string;
}

export default function Page() {
  const [order, setOrder] = useState<OrderItem[]>([]);
  const currentCategory = order.length > 0 ? order[0].category : null;

  const addToOrder = (
    item: { name: string; price: number },
    category: string
  ) => {
    if (currentCategory && currentCategory !== category) return;

    const portion =
      prompt(
        `Choose portion size for ${item.name} (e.g., Small, Medium, Large):`,
        'Medium'
      ) || 'Medium';
    const customization =
      prompt(`Any customizations for ${item.name}?`, '') || '';

    setOrder((prev) => {
      const existing = prev.find(
        (i) =>
          i.name === item.name &&
          i.portion === portion &&
          i.customization === customization
      );
      if (existing) {
        return prev.map((i) => (i === existing ? { ...i, qty: i.qty + 1 } : i));
      } else {
        return [
          ...prev,
          {
            name: item.name,
            qty: 1,
            price: item.price,
            portion,
            customization,
            category,
          },
        ];
      }
    });
  };

  const removeItem = (index: number) => {
    setOrder((prev) => prev.filter((_, i) => i !== index));
  };

  const decrementQty = (index: number) => {
    setOrder((prev) => {
      const item = prev[index];
      if (item.qty > 1) {
        return prev.map((i, idx) =>
          idx === index ? { ...i, qty: i.qty - 1 } : i
        );
      } else {
        return prev.filter((_, i) => i !== index);
      }
    });
  };

  const getTotal = () => {
    return order.reduce((sum, item) => sum + item.price * item.qty, 0);
  };

  return (
    <main className="min-h-screen bg-white p-4 text-gray-800">
      <header className="rounded bg-[#ff785b] p-4 text-xl font-bold text-white shadow">
        Choose Your Food
      </header>
      <p className="mt-2 text-center text-sm font-medium text-red-500">
        Note: You can only order from one restaurant at a time.
      </p>

      <div className="mt-4 flex flex-col gap-4 md:flex-row">
        <section className="flex-1 space-y-6">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className={clsx(
                'border rounded p-4 transition-all duration-300',
                currentCategory &&
                  currentCategory !== cat.name &&
                  'opacity-30 pointer-events-none'
              )}
            >
              <h3 className="mb-2 border-b pb-2 text-lg font-semibold text-[#ff785b]">
                {cat.name}
              </h3>
              {cat.items.map((item) => (
                <div
                  key={item.name}
                  className="mb-2 flex items-center justify-between"
                >
                  <span className="text-sm">
                    {item.name}{' '}
                    <span className="text-gray-500">({item.price}k)</span>
                  </span>
                  <button
                    onClick={() => addToOrder(item, cat.name)}
                    className="flex size-7 items-center justify-center rounded-full bg-[#ff785b] text-white transition hover:bg-[#ff5b3b]"
                  >
                    +
                  </button>
                </div>
              ))}
            </div>
          ))}
        </section>

        <aside className="w-full rounded border p-4 shadow-sm md:w-1/3">
          <h3 className="mb-2 text-lg font-semibold text-[#ff785b]">
            Your Order
          </h3>
          {order.length === 0 ? (
            <p className="text-sm text-gray-500">No item added yet!</p>
          ) : (
            <div className="space-y-4">
              {order.map((item, index) => (
                <div key={index} className="border-b pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">
                        {item.name} ({item.portion})
                      </div>
                      <div className="text-sm italic text-gray-500">
                        {item.customization}
                      </div>
                      <div className="text-sm">
                        {item.price}k × {item.qty} = {item.price * item.qty}k
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => decrementQty(index)}
                        className="rounded bg-gray-200 px-2 text-gray-700 hover:bg-gray-300"
                      >
                        -
                      </button>
                      <button
                        onClick={() => removeItem(index)}
                        className="rounded bg-red-400 px-2 text-white hover:bg-red-500"
                      >
                        x
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="mt-2 text-right text-lg font-semibold">
                Total: {getTotal()}k
              </div>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
