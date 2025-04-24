'use client';

import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { acceptOrder } from '@/app/api/order';
import { ensureAuthenticated } from '@/lib/auth';

type FirestoreOrder = {
  order_id: string;
  purchaser_id: string;
  delivery_man_id: string | null;
  status: string;
  total_price: number;
  eateryName: string;
  foodItems: ({ name: string; quantity?: number } | string)[];
};

export default function DriverOrderListener() {
  const [orders, setOrders] = useState<FirestoreOrder[]>([]);
  const [deliveringOrders, setDeliveringOrders] = useState<FirestoreOrder[]>(
    []
  );
  const [sortBy, setSortBy] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const q = query(collection(db, 'orders'), where('status', '==', 'PENDING'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const liveOrders = snapshot.docs.map((doc) => {
        const data = doc.data() as Omit<FirestoreOrder, 'id'>;
        console.log(data);
        return { id: doc.id, ...data };
      });
      setOrders(liveOrders);
    });

    return () => unsubscribe();
  }, []);

  const handleAccept = async (orderId: string) => {
    let token: string;
    let driverId: string;

    try {
      const auth = ensureAuthenticated();
      token = auth.token;
      driverId = auth.userId;
    } catch (err) {
      alert('You must be logged in as a driver to accept orders.');
      console.log(err);
      return;
    }

    try {
      const result = await acceptOrder(orderId, driverId, token);
      alert(result.status);

      setOrders((prev) => {
        const accepted = prev.find((o) => o.order_id === orderId);
        if (!accepted) return prev;

        setDeliveringOrders((prevDelivering) => {
          const alreadyExists = prevDelivering.some(
            (o) => o.order_id === accepted.order_id
          );
          if (alreadyExists) return prevDelivering;
          return [...prevDelivering, accepted];
        });

        return prev.filter((o) => o.order_id !== orderId);
      });
    } catch (err: any) {
      alert(`Failed to accept order: ${err.message}`);
    }
  };

  const handlePass = (orderId: string) => {
    alert(`Passed on order ${orderId}`);
    setOrders((prev) => prev.filter((o) => o.order_id !== orderId));
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-6 text-gray-800">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between border-b pb-3">
          <h1 className="flex items-center gap-2 text-2xl font-bold text-[#ff785b]">
            <span>📦</span> Available Orders
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

        {orders.length === 0 ? (
          <p className="text-center text-sm text-gray-500">
            No available orders.
          </p>
        ) : (
          <ul className="space-y-5">
            {orders
              .sort((a, b) =>
                sortBy === 'asc'
                  ? a.total_price - b.total_price
                  : b.total_price - a.total_price
              )
              .map((order) => (
                <li
                  key={order.order_id}
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
                        {order.eateryName}
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
                      {(order.foodItems ?? []).map((item, idx) => (
                        <li key={idx}>{item.toString()}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => handleAccept(order.order_id)}
                      className="flex-1 rounded bg-green-600 py-2 font-medium text-white shadow-sm hover:bg-green-700"
                    >
                      Accept Order
                    </button>
                    <button
                      onClick={() => handlePass(order.order_id)}
                      className="flex-1 rounded bg-gray-300 py-2 font-medium text-gray-800 shadow-sm hover:bg-gray-400"
                    >
                      Pass
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        )}

        {deliveringOrders.length > 0 && (
          <div className="mt-12 border-t pt-6">
            <h2 className="mb-4 text-xl font-bold text-[#ff785b]">
              🚚 Delivering
            </h2>
            <ul className="space-y-5">
              {deliveringOrders.map((order) => (
                <li
                  key={order.order_id}
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
                        {order.eateryName}
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
                      {(order.foodItems ?? []).map((item, idx) => (
                        <li key={idx}>{item.toString()}</li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
