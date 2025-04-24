'use client';

import React, { useState } from 'react';

const mockOrders = [
  {
    id: 'order1',
    order_id: 'ORDER_001',
    purchaser_id: 'USER123',
    delivery_man_id: '',
    status: 'PENDING',
    total_price: 75000,
    restaurant_name: 'ABO',
    items: [
      { name: 'BANH MI', quantity: 2, price: 20000 },
      { name: 'TRA SUA', quantity: 1, price: 25000 },
    ],
  },
  {
    id: 'order2',
    order_id: 'ORDER_002',
    purchaser_id: 'USER456',
    delivery_man_id: '',
    status: 'PENDING',
    total_price: 120000,
    restaurant_name: 'Milk Tea Heaven',
    items: [
      { name: 'BUN CA', quantity: 1, price: 30000 },
      { name: 'TRA SUA', quantity: 2, price: 25000 },
      { name: 'FRIED TOFU', quantity: 1, price: 40000 },
    ],
  },
];

export default function DriverOrderListener() {
  const [orders, setOrders] = useState(mockOrders);
  const [sortBy, setSortBy] = useState<'asc' | 'desc'>('asc');

  const sortedOrders = [...orders].sort((a, b) =>
    sortBy === 'asc'
      ? a.total_price - b.total_price
      : b.total_price - a.total_price
  );

  const handleAccept = (orderId: string) => {
    alert(`Accepted order ${orderId}`);
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  const handlePass = (orderId: string) => {
    alert(`Passed on order ${orderId}`);
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-6 text-gray-800">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between border-b pb-3">
          <h1 className="flex items-center gap-2 text-2xl font-bold text-[#ff785b]">
            <span>📦</span> Incoming Orders
          </h1>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'asc' | 'desc')}
            className="rounded border border-[#ff785b] px-2 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#ff785b]"
          >
            <option value="asc">Sort by Price: Low to High</option>
            <option value="desc">Sort by Price: High to Low</option>
          </select>
        </div>

        {sortedOrders.length === 0 ? (
          <p className="text-center text-sm text-gray-500">
            No orders available at the moment.
          </p>
        ) : (
          <ul className="space-y-5">
            {sortedOrders.map((order) => (
              <li
                key={order.id}
                className="rounded-xl border bg-white p-5 shadow"
              >
                <div className="mb-2">
                  <p className="font-semibold text-gray-700">
                    Order ID: {order.order_id}
                  </p>
                  <p className="text-sm text-gray-600">
                    Customer ID: {order.purchaser_id}
                  </p>
                  <p className="text-sm text-gray-600">
                    Restaurant:{' '}
                    <span className="font-semibold text-[#ff785b]">
                      {order.restaurant_name}
                    </span>
                  </p>
                  <p className="mb-2 text-sm text-gray-600">
                    Total:{' '}
                    <span className="font-semibold text-black">
                      {order.total_price.toLocaleString()}đ
                    </span>
                  </p>
                </div>

                <div className="mb-3">
                  <p className="mb-1 text-sm font-medium text-[#ff785b]">
                    Items:
                  </p>
                  <ul className="list-disc pl-4 text-sm text-gray-700">
                    {order.items.map((item, idx) => (
                      <li key={idx}>
                        {item.name} × {item.quantity} —{' '}
                        {(item.price * item.quantity).toLocaleString()}đ
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => handleAccept(order.id)}
                    className="flex-1 rounded bg-green-600 py-2 font-medium text-white shadow-sm hover:bg-green-700"
                  >
                    Accept Order
                  </button>
                  <button
                    onClick={() => handlePass(order.id)}
                    className="flex-1 rounded bg-gray-300 py-2 font-medium text-gray-800 shadow-sm hover:bg-gray-400"
                  >
                    Pass
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
