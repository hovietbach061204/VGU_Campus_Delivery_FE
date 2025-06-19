'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useOrderRealtime } from '@/hooks/useOrderRealTime';
import OrderChat from '@/components/OrderChat';

export default function DeliveryStatus() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams?.get('orderId') ?? '';

  const order = useOrderRealtime(orderId);

  const handleBackToOrders = () => {
    router.push('/Driver');
  };

  if (!order) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading delivery status...</p>
      </main>
    );
  }

  const statusColor =
    order.status === 'DELIVERED'
      ? 'text-green-600'
      : order.status === 'IN_TRANSIT'
        ? 'text-blue-600'
        : 'text-yellow-500';

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-8 text-gray-800">
      <div className="mx-auto max-w-xl rounded border bg-white p-6 shadow">
        <h1 className="mb-6 flex items-center gap-2 text-3xl font-bold text-[#ff785b]">
          🚚 Delivery Status
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
          <p>
            <strong>Customer ID:</strong>{' '}
            <span className="text-gray-700">{order.purchaser_id}</span>
          </p>
          <p>
            <strong>Restaurant:</strong>{' '}
            <span className="font-semibold text-[#ff785b]">
              {order.eateryName || 'N/A'}
            </span>
          </p>
          <p>
            <strong>Total:</strong>{' '}
            <span className="font-semibold text-black">
              {order.total_price?.toLocaleString()}đ
            </span>
          </p>
        </div>

        {/* Order Items */}
        {order.foodItems && order.foodItems.length > 0 && (
          <div className="mb-6">
            <p className="mb-2 font-semibold text-[#ff785b]">Order Items:</p>
            <ul className="list-disc pl-4 text-sm text-gray-700">
              {order.foodItems.map((item: any, idx: number) => (
                <li key={idx}>{item.toString()}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Chat Section - Enhanced with bigger size and center layout */}
        <div className="mt-8">
          <div className="mb-4 text-center">
            <h2 className="mb-2 text-xl font-bold text-[#ff785b]">
              💬 Chat with Customer
            </h2>
            <p className="text-sm text-gray-600">
              Real-time messaging with your customer
            </p>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-4xl">
              <OrderChat
                orderId={order.order_id}
                userId={order.delivery_man_id || ''}
                userRole="deliveryman"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleBackToOrders}
            className="w-full rounded bg-[#ff785b] py-2 font-semibold text-white shadow-sm hover:bg-[#ff5b3b]"
          >
            Back to Orders
          </button>
          <p className="mt-4 text-sm text-gray-500">
            🚚 Keep the customer updated on delivery progress.
          </p>
        </div>
      </div>
    </main>
  );
}
