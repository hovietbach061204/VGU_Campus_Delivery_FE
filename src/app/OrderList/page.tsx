'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ensureAuthenticated } from '@/lib/auth';
import { fetchPendingOrders } from '@/app/api/order';

type FoodItemResponse = {
  name: string;
  description: string;
  price: number;
  quantity: number;
};

type Order = {
  orderId: string;
  purchaserId: string;
  deliverymanResponse: any;
  orderStatus: string;
  totalPrice: number;
  createdAt: string;
  foodItemResponses: FoodItemResponse[];
};

export default function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const { token, userId } = ensureAuthenticated();
        const data = await fetchPendingOrders(userId, token);
        console.log(data);
        setOrders(data);
      } catch (err) {
        console.error('Fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const handleNewOrder = () => router.push('/Restaurant_Order');

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading pending orders...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-8 text-gray-800">
      <div className="mx-auto max-w-xl space-y-6">
        <h1 className="mb-4 text-3xl font-bold text-[#ff785b]">
          🧾 Your Pending Orders
        </h1>

        {orders.length === 0 ? (
          <p className="text-center text-gray-500">No pending orders found.</p>
        ) : (
          orders.map((order) => {
            return (
              <div
                key={order.orderId}
                className="space-y-2 rounded border bg-white p-6 shadow-sm"
              >
                <p>
                  <strong>Order ID:</strong>{' '}
                  <span className="text-gray-700">{order.orderId}</span>
                </p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span
                    className={`font-semibold ${order.deliverymanResponse ? 'text-green-600' : 'text-yellow-500'}`}
                  >
                    {order.orderStatus}
                  </span>
                </p>

                <div className="mb-3">
                  <p className="mb-1 text-sm font-medium text-[#ff785b]">
                    Items:
                  </p>
                  <ul className="list-disc pl-4 text-sm text-gray-700">
                    {order.foodItemResponses?.map((item, idx) => (
                      <li key={item.name + idx}>
                        {item.name} — {item.price.toLocaleString()}đ
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })
        )}

        <div className="pt-4 text-center">
          <button
            onClick={handleNewOrder}
            className="w-full rounded bg-[#ff785b] py-2 font-semibold text-white shadow-sm hover:bg-[#ff5b3b]"
          >
            Place Another Order
          </button>
        </div>
      </div>
    </main>
  );
}
