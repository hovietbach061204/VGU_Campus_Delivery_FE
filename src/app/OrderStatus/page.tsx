'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useOrderRealtime } from '@/hooks/useOrderRealTime';
import OrderChat from '@/components/OrderChat';
import HomeIconNavigation from '@/components/HomeIconNavigation';

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
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading order status...</p>
      </main>
    );
  }

  const statusColor = order.delivery_man_id
    ? 'text-green-600'
    : 'text-yellow-500';

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-8 text-gray-800">
      {/* Home Icon Navigation */}
      <HomeIconNavigation />

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

        {/* Chat Section - Enhanced with bigger size and center layout */}
        {order.delivery_man_id && (
          <div className="mt-8">
            <div className="mb-4 text-center">
              <h2 className="mb-2 text-xl font-bold text-[#ff785b]">
                💬 Chat with Driver
              </h2>
              <p className="text-sm text-gray-600">
                Real-time messaging with your delivery person
              </p>
            </div>
            <div className="mb-4 flex justify-center">
              <button
                onClick={() =>
                  window.open(
                    `/Chat?orderId=${order.order_id}&role=purchaser`,
                    '_blank'
                  )
                }
                className="rounded bg-[#ff785b] px-6 py-2 font-semibold text-white shadow-sm transition-colors hover:bg-[#ff5b3b]"
              >
                🔗 Open Full-Screen Chat
              </button>
            </div>
            <div className="flex justify-center">
              <div className="w-full max-w-4xl">
                <OrderChat
                  orderId={order.order_id}
                  userId={order.purchaser_id}
                  userRole="purchaser"
                />
              </div>
            </div>
          </div>
        )}

        {/* Show chat button even if no delivery person yet */}
        {!order.delivery_man_id && (
          <div className="mt-6 rounded-lg border border-orange-200 bg-orange-50 p-4 text-center">
            <h3 className="mb-2 font-semibold text-gray-700">
              📱 Chat Coming Soon
            </h3>
            <p className="text-sm text-gray-600">
              You&apos;ll be able to chat with your driver once they accept your
              order
            </p>
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={handleNewOrder}
            className="w-full rounded bg-[#ff785b] py-2 font-semibold text-white shadow-sm hover:bg-[#ff5b3b]"
          >
            Place Another Order
          </button>
          <p className="mt-4 text-sm text-gray-500">
            📦 You will be updated on the order progress shortly.
          </p>
        </div>
      </div>
    </main>
  );
}
