'use client';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const DriverPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter();

  const [filter, setFilter] = useState<
    'PENDING' | 'ACCEPTED' | 'DELIVERING' | 'COMPLETED'
  >('PENDING');
  const [orders, setOrders] = useState<any[]>([
    {
      order_id: 'ORDER_123456',
      status_name: 'PENDING',
      delivery_man_id: null,
      statusChanged: false, // Track if the status has changed
      items: [
        { name: 'BANH MI', quantity: 2, price: 20000 },
        { name: 'TRA SUA', quantity: 1, price: 25000 },
      ],
      total_price: 75000,
      restaurant_name: 'ABO',
    },
    {
      order_id: 'ORDER_789012',
      status_name: 'DELIVERING',
      delivery_man_id: 'SHIPPER_77',
      statusChanged: false,
      items: [
        { name: 'BUN CA', quantity: 1, price: 30000 },
        { name: 'TRA SUA', quantity: 2, price: 25000 },
      ],
      total_price: 120000,
      restaurant_name: 'Milk Tea Heaven',
    },
    {
      order_id: 'ORDER_654321',
      status_name: 'ACCEPTED',
      delivery_man_id: 'SHIPPER_88',
      statusChanged: true,
      items: [
        { name: 'SPRING ROLL', quantity: 3, price: 15000 },
        { name: 'Fried Tofu', quantity: 1, price: 50000 },
      ],
      total_price: 95000,
      restaurant_name: 'Snack Bar',
    },
    {
      order_id: 'ORDER_987654',
      status_name: 'COMPLETED',
      delivery_man_id: 'SHIPPER_99',
      statusChanged: false,
      items: [
        { name: 'VEGETABLE FRIED RICE', quantity: 2, price: 95000 },
        { name: 'SEAFOOD FRIED RICE', quantity: 1, price: 110000 },
      ],
      total_price: 310000,
      restaurant_name: 'Fried Rice Delight',
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-400';
      case 'ACCEPTED':
        return 'bg-blue-400';
      case 'DELIVERING':
        return 'bg-green-400';
      case 'COMPLETED':
        return 'bg-gray-400';
      default:
        return 'bg-[#ff785b]';
    }
  };

  const handleAccept = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.order_id === orderId && order.status_name === 'PENDING') {
          order.status_name = 'ACCEPTED';
        }
        return order;
      })
    );
  };

  const handleCancel = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.order_id === orderId && order.status_name === 'ACCEPTED') {
          order.status_name = 'PENDING';
        }
        return order;
      })
    );
  };

  const handleComplete = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.order_id === orderId && order.status_name === 'DELIVERING') {
          order.status_name = 'COMPLETED';
        }
        return order;
      })
    );
  };

  const handlePickedUp = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.order_id === orderId && order.status_name === 'ACCEPTED') {
          order.status_name = 'DELIVERING';
        }
        return order;
      })
    );
  };

  const filteredOrders = orders.filter((order) => order.status_name === filter);

  const getStatusBadgeCount = (status: string) => {
    return orders.filter((order) => order.status_name === status).length;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-8 text-gray-800">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 flex items-center gap-2 text-3xl font-bold text-[#ff785b]">
          📦 Driver&#39;s Orders
        </h1>

        <div className="mb-6 flex justify-around">
          {['PENDING', 'ACCEPTED', 'DELIVERING', 'COMPLETED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as typeof filter)}
              className={`relative rounded-full px-3 py-1 text-sm font-medium ${
                filter === status
                  ? getStatusColor(status) + ' text-white'
                  : 'border border-[#ff785b] bg-white text-[#ff785b]'
              } hover:bg-[#ff785b]/90 hover:text-white`}
            >
              {status}
              {getStatusBadgeCount(status) > 0 && (
                <span className="absolute right-0 top-0 -mr-2 -mt-2 inline-flex size-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {getStatusBadgeCount(status)}
                </span>
              )}
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center text-center">
            <Image
              src="/images/empty-box.png"
              alt="No orders"
              width={150}
              height={150}
              className="mb-4"
            />
            <p className="text-lg font-semibold text-gray-600">
              No orders available
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredOrders.map((order) => (
              <div
                key={order.order_id}
                className="rounded-lg border bg-white p-5 shadow"
              >
                <h2 className="mb-2 text-lg font-semibold text-[#ff785b]">
                  Order ID: {order.order_id}
                </h2>
                <p>
                  <strong>Status:</strong>{' '}
                  <span
                    className={`font-semibold ${getStatusColor(order.status_name)}`}
                  >
                    {order.status_name}
                  </span>
                </p>
                {order.delivery_man_id && (
                  <p>
                    <strong>Driver ID:</strong>{' '}
                    <span className="text-gray-700">
                      {order.delivery_man_id}
                    </span>
                  </p>
                )}
                <div className="mb-3">
                  <p className="mb-1 text-sm font-medium text-[#ff785b]">
                    Items:
                  </p>
                  <ul className="list-disc pl-4 text-sm text-gray-700">
                    {order.items.map((item: any) => (
                      <li key={item.name}>
                        {item.name} × {item.quantity} —{' '}
                        {(item.price * item.quantity).toLocaleString()}đ
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 flex gap-3">
                  {order.status_name === 'PENDING' && (
                    <Button
                      onClick={() => handleAccept(order.order_id)}
                      className="flex-1 rounded bg-green-600 py-2 font-medium text-white shadow-sm hover:bg-green-700"
                    >
                      Accept Order
                    </Button>
                  )}

                  {order.status_name === 'ACCEPTED' && (
                    <>
                      <Button
                        onClick={() => handlePickedUp(order.order_id)}
                        className="flex-1 rounded bg-blue-600 py-2 font-medium text-white shadow-sm hover:bg-blue-700"
                      >
                        Picked Up
                      </Button>
                      <Button
                        onClick={() => handleCancel(order.order_id)}
                        className="flex-1 rounded bg-red-500 py-2 font-medium text-white shadow-sm hover:bg-red-600"
                      >
                        Cancel Order
                      </Button>
                    </>
                  )}

                  {order.status_name === 'DELIVERING' && (
                    <Button
                      onClick={() => handleComplete(order.order_id)}
                      className="flex-1 rounded bg-blue-600 py-2 font-medium text-white shadow-sm hover:bg-blue-700"
                    >
                      Complete Order
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default DriverPage;
