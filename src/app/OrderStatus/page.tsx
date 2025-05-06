'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Image from 'next/image';

export default function OrderStatus() {
  const router = useRouter();

  const [filter, setFilter] = useState<
    'ALL' | 'PENDING' | 'ACCEPTED' | 'DELIVERING' | 'COMPLETED'
  >('ALL');
  const [orders, setOrders] = useState([
    {
      order_id: 'ORDER_123456',
      status_name: 'PENDING',
      delivery_man_id: null,
    },
    {
      order_id: 'ORDER_789012',
      status_name: 'DELIVERING',
      delivery_man_id: 'SHIPPER_77',
    },
    {
      order_id: 'ORDER_654321',
      status_name: 'ACCEPTED',
      delivery_man_id: 'SHIPPER_88',
    },
    {
      order_id: 'ORDER_987654',
      status_name: 'COMPLETED',
      delivery_man_id: 'SHIPPER_99',
    },
  ]);

  const handleCancelOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((order) => order.order_id !== orderId));
  };

  const handleNewOrder = () => {
    router.push('/Restaurant_Order');
  };

  const filteredOrders =
    filter === 'ALL'
      ? orders
      : orders.filter((order) => order.status_name === filter);

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

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-8 text-gray-800">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 flex items-center gap-2 text-3xl font-bold text-[#ff785b]">
          📦 Your Orders
        </h1>

        <div className="mb-6 flex justify-around">
          {['ALL', 'PENDING', 'ACCEPTED', 'DELIVERING', 'COMPLETED'].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status as typeof filter)}
                className={`rounded-full px-3 py-1 text-sm font-medium ${filter === status ? getStatusColor(status) + ' text-white' : 'border border-[#ff785b] bg-white text-[#ff785b]'} hover:bg-[#ff785b]/90 hover:text-white`}
              >
                {status}
              </button>
            )
          )}
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
            <p className="text-lg font-semibold text-gray-600">No orders yet</p>
            <p className="text-sm text-gray-500">
              Start shopping and place your first order!
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredOrders.map((order, idx) => {
              const statusColor = order.delivery_man_id
                ? 'text-green-600'
                : 'text-yellow-500';
              return (
                <div
                  key={order.order_id}
                  className="rounded-lg border bg-white p-5 shadow"
                >
                  <h2 className="mb-2 text-lg font-semibold text-[#ff785b]">
                    Order #{idx + 1}
                  </h2>
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
                  {order.delivery_man_id && (
                    <p>
                      <strong>Driver ID:</strong>{' '}
                      <span className="text-gray-700">
                        {order.delivery_man_id}
                      </span>
                    </p>
                  )}
                  {order.status_name !== 'DELIVERING' &&
                    order.status_name !== 'COMPLETED' && (
                      <div className="mt-4 text-right">
                        <button
                          onClick={() => handleCancelOrder(order.order_id)}
                          className="rounded bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-600"
                        >
                          Cancel Order
                        </button>
                      </div>
                    )}
                </div>
              );
            })}
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
