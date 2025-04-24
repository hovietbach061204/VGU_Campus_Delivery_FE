'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useOrderRealtime } from '@/hooks/useOrderRealTime';

export default function OrderStatus() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const order = useOrderRealtime(orderId ?? '');

  const handleNewOrder = () => {
    router.push('/Restaurant_Order');
  };

  if (!order) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading order status...</p>
      </main>
    );
  }

  const statusColor = order.delivery_man_id
    ? 'text-green-600'
    : 'text-yellow-500';

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-8 text-gray-800">
      <div className="mx-auto max-w-xl rounded border bg-white p-6 shadow">
        <h1 className="mb-6 flex items-center gap-2 text-3xl font-bold text-[#ff785b]">
          🧾 Order Status
        </h1>

        <div className="mb-4 text-base">
          <p>
            <strong>Order ID:</strong>{' '}
            <span className="text-gray-700">{order.order_id}</span>
          </p>
          <p>
            <strong>Status:</strong>{' '}
            <span className={`font-semibold ${statusColor}`}>
              {order.status}
            </span>
          </p>
          {!order.delivery_man_id && (
            <p className="mt-1 text-sm italic text-gray-500">
              Waiting for a driver to accept your order...
            </p>
          )}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={handleNewOrder}
            className="w-full rounded bg-[#ff785b] py-2 font-semibold text-white shadow-sm hover:bg-[#ff5b3b]"
          >
            Place Another Order
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            📦 You will be updated on the order progress shortly.
          </p>
        </div>
      </div>
    </main>
  );
}
