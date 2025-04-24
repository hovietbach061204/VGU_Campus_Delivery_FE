'use client';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useOrderRealtime } from '../../hooks/useOrderRealTime';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { doc, deleteDoc } from 'firebase/firestore';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function OrderStatus() {
  // const order = useOrderRealtime('jrttNvupbhUAtyGxfi34');
  const router = useRouter();

  // TEMP MOCK ORDER (since no backend)
  const order = {
    order_id: 'ORDER_123456',
    status_name: 'PENDING',
    delivery_man_id: null,
  };

  const handleCancelOrder = async () => {
    alert('Order has been cancelled.');
    router.push('/');
  };

  const handleNewOrder = () => {
    router.push('/');
  };

  const statusColor = order.delivery_man_id
    ? 'text-green-600'
    : 'text-yellow-500';

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-8 text-gray-800">
      <div className="mx-auto max-w-xl rounded-lg border bg-white p-6 shadow-md">
        <h1 className="mb-4 flex items-center gap-2 text-3xl font-bold text-[#ff785b]">
          🧾 Order Confirmation
        </h1>

        <div className="mb-4 text-base text-gray-600">
          <p className="mb-2">
            🎉{' '}
            <span className="font-semibold">
              Your order has been placed successfully!
            </span>
          </p>
          <p className="text-sm">
            We are currently processing your order and will notify you once a
            driver is assigned.
          </p>
        </div>

        <div className="mb-4 text-base">
          <p>
            <strong>Order ID:</strong>{' '}
            <span className="text-gray-700">{order.order_id}</span>
          </p>
          <p>
            <strong>Status:</strong>{' '}
            <span className={`font-semibold ${statusColor}`}>
              {order.status_name}
            </span>
          </p>
          {!order.delivery_man_id && (
            <p className="mt-1 text-sm italic text-gray-500">
              Waiting for a driver to accept your order...
            </p>
          )}
        </div>

        {order.delivery_man_id && (
          <div className="mt-4">
            <p className="text-base">
              <strong>Assigned Driver:</strong>{' '}
              <span className="text-gray-700">{order.delivery_man_id}</span>
            </p>
          </div>
        )}

        <div className="mt-6 flex gap-4">
          <button
            onClick={handleCancelOrder}
            className="w-full rounded bg-red-500 py-2 font-semibold text-white shadow-sm hover:bg-red-600"
          >
            Cancel Order
          </button>
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
