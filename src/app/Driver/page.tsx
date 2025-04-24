// src/app/(driver)/DriverOrderListener.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type Order = {
  id: string;
  order_id: string;
  purchaser_id: string;
  delivery_man_id: string;
  status: string;
  total_price: number;
};

export default function DriverOrderListener() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'orders'), where('status', '==', 'PENDING'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newOrders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as any),
      })) as Order[];
      setOrders(newOrders);
    });

    return () => unsubscribe();
  }, []);

  const handleAccept = async (orderId: string) => {
    const driverId = 'HARDCODED_DRIVER_ID'; // Replace with auth logic
    const res = await fetch(`/api/order/${orderId}/accept?driverId=${driverId}`, {
      method: 'POST',
    });
    const result = await res.json();
    alert(result.status);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">📦 New Orders</h1>
      {orders.length === 0 ? (
        <p>No orders available.</p>
      ) : (
        <ul className="space-y-3">
          {orders.map(order => (
            <li key={order.id} className="border p-4 rounded shadow bg-white">
              <div>Order ID: {order.order_id}</div>
              <div>Total: ${order.total_price}</div>
              <button
                className="mt-2 px-4 py-1 bg-green-600 text-white rounded"
                onClick={() => handleAccept(order.id)}
              >
                Accept Order
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
