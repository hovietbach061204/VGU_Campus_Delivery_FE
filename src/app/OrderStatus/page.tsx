'use client';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function OrderStatus() {
  const router = useRouter();

  const [filter, setFilter] = useState<
    'PENDING' | 'ACCEPTED' | 'DELIVERING' | 'COMPLETED'
  >('PENDING');
  const [orders, setOrders] = useState<any[]>([
    {
      order_id: 'ORDER_123456',
      status_name: 'PENDING',
      delivery_man_id: null,
      statusChanged: false,
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

  const [selectedOrder, setSelectedOrder] = useState<any>(null); // Store the selected order for the modal

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

  const handleCancelOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((order) => order.order_id !== orderId));
  };

  const handleNewOrder = () => {
    router.push('/Restaurant_Order');
  };

  const filteredOrders = orders.filter((order) => order.status_name === filter);

  const getStatusBadgeCount = (status: string) => {
    return orders.filter(
      (order) => order.status_name === status && order.statusChanged
    ).length;
  };

  // Function to open the modal with order details
  const openOrderDetails = (order: any) => {
    setSelectedOrder(order);
  };

  // Function to close the modal
  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-8 text-gray-800">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 flex items-center gap-2 text-3xl font-bold text-[#ff785b]">
          📦 Your Orders
        </h1>

        <div className="mb-6 flex justify-around">
          {['PENDING', 'ACCEPTED', 'DELIVERING', 'COMPLETED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as typeof filter)}
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                filter === status
                  ? getStatusColor(status) + ' text-white'
                  : 'border border-[#ff785b] bg-white text-[#ff785b]'
              } relative hover:bg-[#ff785b]/90 hover:text-white`}
            >
              {status}
              {getStatusBadgeCount(status) > 0 && (
                <span className="absolute right-0 top-0 inline-flex size-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
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
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => openOrderDetails(order)} // Open order details modal
                      className="flex-1 rounded bg-blue-600 py-2 font-medium text-white shadow-sm hover:bg-blue-700"
                    >
                      View Details
                    </button>
                    {order.status_name !== 'DELIVERING' &&
                      order.status_name !== 'COMPLETED' && (
                        <button
                          onClick={() => handleCancelOrder(order.order_id)}
                          className="flex-1 rounded bg-red-500 py-2 font-medium text-white shadow-sm hover:bg-red-600"
                        >
                          Cancel Order
                        </button>
                      )}
                  </div>
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

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-lg">
            <h3 className="mb-4 text-xl font-semibold text-[#ff785b]">
              Order Details: {selectedOrder.order_id}
            </h3>
            <p>
              <strong>Status:</strong> {selectedOrder.status_name}
            </p>
            <p>
              <strong>Restaurant:</strong> {selectedOrder.restaurant_name}
            </p>
            <div className="mt-4">
              <strong>Items:</strong>
              <ul className="list-disc pl-4">
                {selectedOrder.items.map((item: any, idx: number) => (
                  <li key={idx}>
                    {item.name} × {item.quantity} —{' '}
                    {(item.price * item.quantity).toLocaleString()}đ
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4 text-right">
              <button
                onClick={closeOrderDetails} // Close the modal
                className="rounded-lg bg-gray-500 px-6 py-2 text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
