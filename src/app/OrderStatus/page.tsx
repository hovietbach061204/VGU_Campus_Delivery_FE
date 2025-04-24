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
    // if (!order) return;
    // await deleteDoc(doc(db, 'orders', 'jrttNvupbhUAtyGxfi34'));
    alert('Order has been cancelled.');
    router.push('/'); // Redirect to homepage or restaurant page
  };

  const handleNewOrder = () => {
    router.push('/'); // Redirect to homepage or order page
  };

  // if (!order) {
  //   return (
  //     <main className="min-h-screen p-8 bg-white text-gray-800 flex items-center justify-center">
  //       <p className="text-[#ff785b] text-lg font-medium">Loading order...</p>
  //     </main>
  //   );
  // }

  const statusColor = order.delivery_man_id
    ? 'text-green-600'
    : 'text-yellow-500';

  return (
    <main className="min-h-screen bg-white p-8 text-gray-800">
      <div className="mx-auto max-w-xl rounded border bg-white p-6 shadow-md">
        <h1 className="mb-4 text-2xl font-bold text-[#ff785b]">
          🎉 Your Order Has Been Placed!
        </h1>

        <div className="mb-4 text-sm text-gray-600">
          Thank you for your purchase. Your order is being processed.
        </div>

        <div className="mb-4">
          <p className="text-base">
            <strong>Order ID:</strong>{' '}
            <span className="text-gray-700">{order.order_id}</span>
          </p>
          <p className="text-base">
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
            className="w-full rounded bg-red-500 py-2 font-semibold text-white hover:bg-red-600"
          >
            Cancel Order
          </button>
          <button
            onClick={handleNewOrder}
            className="w-full rounded bg-[#ff785b] py-2 font-semibold text-white hover:bg-[#ff5b3b]"
          >
            Place Another Order
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            You will be notified once your order is on its way!
          </p>
        </div>
      </div>
    </main>
  );
}
