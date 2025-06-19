'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ensureAuthenticated } from '@/lib/auth';
import { deleteOrder } from '@/app/api/order';
import HomeIconNavigation from '@/components/HomeIconNavigation';
import { ORDER_STATUSES } from '@/lib/constant';
import OrderChat from '@/components/OrderChat';
import { getUserProfile } from '@/app/api/user';

// Order status types
type OrderStatus = 'PENDING' | 'ASSIGNED' | 'DELIVERING' | 'DELIVERED';

interface Order {
  order_id: string;
  purchaser_id: string;
  delivery_man_id?: string | null;
  status: OrderStatus;
  total_price: string;
  eateryName: string;
  foodItems: ({ name: string; quantity?: number } | string)[];
  created_at: any;
}

interface StatusCount {
  all: number;
  pending: number;
  assigned: number;
  delivering: number;
  delivered: number;
}

export default function OrderDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    'all' | 'pending' | 'assigned' | 'delivering' | 'delivered'
  >('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusCounts, setStatusCounts] = useState<StatusCount>({
    all: 0,
    pending: 0,
    assigned: 0,
    delivering: 0,
    delivered: 0,
  });
  // const [newUpdates, setNewUpdates] = useState<{ [key: string]: number }>({});
  const [userId, setUserId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);
  const [showSuccessPrompt, setShowSuccessPrompt] = useState(false);
  const [driverNames, setDriverNames] = useState<{ [id: string]: string }>({});
  const [driverPhones, setDriverPhones] = useState<{ [id: string]: string }>(
    {}
  );

  useEffect(() => {
    try {
      const auth = ensureAuthenticated();
      setUserId(auth.userId);
    } catch {
      router.push('/SignIn');
      return;
    }
  }, [router]);

  // Real-time order listener
  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, 'orders'),
      where('purchaser_id', '==', userId),
      orderBy('created_at', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const liveOrders: Order[] = [];
      snapshot.forEach((doc) => {
        liveOrders.push({ ...doc.data() } as Order);
      });

      setOrders(liveOrders);

      // Calculate status counts
      const counts = {
        all: liveOrders.length,
        pending: liveOrders.filter((o) => o.status === ORDER_STATUSES.PENDING)
          .length,
        assigned: liveOrders.filter((o) => o.status === ORDER_STATUSES.ASSIGNED)
          .length,
        delivering: liveOrders.filter(
          (o) => o.status === ORDER_STATUSES.DELIVERING
        ).length,
        delivered: liveOrders.filter(
          (o) => o.status === ORDER_STATUSES.DELIVERED
        ).length,
      };

      // Detect new updates (simplified logic)
      setStatusCounts((prevCounts) => {
        const updates: { [key: string]: number } = {};
        if (counts.assigned > prevCounts.assigned) {
          updates.assigned = counts.assigned - prevCounts.assigned;
        }
        if (counts.delivering > prevCounts.delivering) {
          updates.delivering = counts.delivering - prevCounts.delivering;
        }
        if (counts.delivered > prevCounts.delivered) {
          updates.delivered = counts.delivered - prevCounts.delivered;
        }

        // setNewUpdates((prev) => ({ ...prev, ...updates }));
        return counts;
      });

      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  // Fetch driver names and phone numbers for all orders with a delivery_man_id
  useEffect(() => {
    const fetchDriverInfo = async () => {
      const auth = ensureAuthenticated();
      const ids = Array.from(
        new Set(
          orders
            .map((o) => o.delivery_man_id)
            .filter((id): id is string => !!id)
        )
      );
      const names: { [id: string]: string } = {};
      const phones: { [id: string]: string } = {};
      await Promise.all(
        ids.map(async (id) => {
          try {
            const profile = await getUserProfile(id, auth.token);
            names[id] = profile?.firstName
              ? `${profile.firstName} ${profile.lastName || ''}`
              : id.slice(0, 8) + '...';
            phones[id] = profile?.phoneNumber || '';
          } catch {
            names[id] = id.slice(0, 8) + '...';
            phones[id] = '';
          }
        })
      );
      setDriverNames(names);
      setDriverPhones(phones);
    };
    if (orders.some((o) => o.delivery_man_id)) fetchDriverInfo();
  }, [orders]);

  const handleCancelOrder = (orderId: string) => {
    setOrderToCancel(orderId);
    setShowCancelDialog(true);
  };

  const confirmCancelOrder = async () => {
    if (!orderToCancel) return;
    try {
      const auth = ensureAuthenticated();
      await deleteOrder(orderToCancel, auth.token);
      setShowCancelDialog(false);
      setShowSuccessPrompt(true);
      setOrderToCancel(null);
    } catch (err: any) {
      setShowCancelDialog(false);
      setOrderToCancel(null);
      alert(`Failed to cancel order: ${err.message}`);
    }
  };

  // const clearNotification = (tab: string) => {
  //   // setNewUpdates((prev) => ({ ...prev, [tab]: 0 }));
  // };

  const getFilteredOrders = () => {
    switch (activeTab) {
      case 'pending':
        // Strictly show only PENDING orders
        return orders.filter((o) => o.status === ORDER_STATUSES.PENDING);
      case 'assigned':
        // Strictly show only ASSIGNED orders
        return orders.filter((o) => o.status === ORDER_STATUSES.ASSIGNED);
      case 'delivering':
        return orders.filter((o) => o.status === ORDER_STATUSES.DELIVERING);
      case 'delivered':
        return orders.filter((o) => o.status === ORDER_STATUSES.DELIVERED);
      default:
        return orders;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-50';
      case 'ASSIGNED':
        return 'text-blue-600 bg-blue-50';
      case 'DELIVERING':
        return 'text-purple-600 bg-purple-50';
      case 'DELIVERED':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading your orders...</p>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-orange-50 to-white p-6 text-gray-800">
      {/* Decorative SVG background top left */}
      <svg
        className="absolute left-0 top-0 -z-10 opacity-20"
        width="300"
        height="300"
        viewBox="0 0 300 300"
        fill="none"
      >
        <circle cx="150" cy="150" r="120" fill="#ff785b" />
      </svg>
      {/* Decorative SVG background bottom right */}
      <svg
        className="absolute bottom-0 right-0 -z-10 opacity-10"
        width="300"
        height="300"
        viewBox="0 0 300 300"
        fill="none"
      >
        <rect x="50" y="50" width="200" height="200" rx="100" fill="#ff785b" />
      </svg>
      {/* Page Title */}
      <div className="mb-8 flex flex-col items-center text-center">
        <span className="mb-2 animate-bounce text-5xl">📋</span>
        <h1 className="mb-2 text-3xl font-bold text-[#ff785b] drop-shadow">
          My Orders Dashboard
        </h1>
        <p className="text-gray-600">Track and manage all your food orders</p>
      </div>
      {/* Home Icon Navigation */}
      <HomeIconNavigation />
      {/* Status Tabs */}
      <div className="mb-6 flex flex-wrap justify-center gap-2 md:gap-4">
        {[
          { key: 'all', label: 'All', count: statusCounts.all },
          { key: 'pending', label: 'Pending', count: statusCounts.pending },
          { key: 'assigned', label: 'Assigned', count: statusCounts.assigned },
          {
            key: 'delivering',
            label: 'Delivering',
            count: statusCounts.delivering,
          },
          {
            key: 'delivered',
            label: 'Delivered',
            count: statusCounts.delivered,
          },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`relative rounded-lg px-4 py-3 font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-[#ff785b] text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span
                className={`ml-2 rounded-full px-2 py-1 text-xs ${
                  activeTab === tab.key
                    ? 'bg-white text-[#ff785b]'
                    : 'bg-[#ff785b] text-white'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="mx-auto max-w-2xl">
        {/* Orders List */}
        <div className="space-y-4">
          {getFilteredOrders().length === 0 ? (
            <div className="py-12 text-center">
              <div className="mb-4 text-6xl">🍽️</div>
              <p className="text-gray-500">
                No orders found for {activeTab} status
              </p>
              <button
                onClick={() => router.push('/Restaurant_Order')}
                className="mt-4 rounded bg-[#ff785b] px-6 py-2 font-semibold text-white hover:bg-[#ff5b3b]"
              >
                Place New Order
              </button>
            </div>
          ) : (
            getFilteredOrders().map((order) => (
              <div
                key={order.order_id}
                className="rounded-xl border bg-white p-5 shadow"
              >
                <div className="mb-2 flex items-center gap-3">
                  <p className="font-semibold text-gray-700">
                    Order ID: {order.order_id}
                  </p>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="mb-2">
                  <p className="text-sm text-gray-600">
                    Restaurant:{' '}
                    <span className="font-semibold text-[#ff785b]">
                      {order.eateryName}
                    </span>
                  </p>
                  <p className="mb-2 text-sm text-gray-600">
                    Total:{' '}
                    <span className="font-semibold text-black">
                      {order.total_price?.toLocaleString()}đ
                    </span>
                  </p>
                </div>
                <div className="mb-3">
                  <p className="mb-1 text-sm font-medium text-[#ff785b]">
                    Items:
                  </p>
                  <ul className="list-disc pl-4 text-sm text-gray-700">
                    {(order.foodItems ?? []).map((item, idx) => {
                      const name = typeof item === 'string' ? item : item.name;
                      const quantity =
                        typeof item === 'string' ? 1 : item.quantity || 1;
                      const description =
                        typeof item === 'object' &&
                        'description' in item &&
                        typeof item.description === 'string'
                          ? item.description
                          : '';
                      return (
                        <li
                          key={idx}
                          className="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div>
                            <span className="font-medium">{name}</span>
                            {description && (
                              <span className="ml-2 text-xs italic text-gray-500">
                                {description}
                              </span>
                            )}
                          </div>
                          <span className="ml-2 rounded-full bg-[#ff785b] px-2 py-0.5 text-xs text-white">
                            x{quantity}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                {/* Driver Info for all statuses except Pending */}
                {order.delivery_man_id && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600">
                      Driver Name:{' '}
                      <span className="font-semibold">
                        {driverNames[order.delivery_man_id] ||
                          order.delivery_man_id.slice(0, 8) + '...'}
                      </span>
                    </p>
                    {driverPhones[order.delivery_man_id] && (
                      <p className="text-sm text-gray-600">
                        Driver Phone:{' '}
                        <span className="font-semibold">
                          {driverPhones[order.delivery_man_id]}
                        </span>
                      </p>
                    )}
                  </div>
                )}
                {/* Order Time */}
                <div className="mb-3">
                  <p className="text-sm text-gray-600">
                    Order Time:{' '}
                    <span className="font-semibold">
                      {order.created_at?.toDate?.()?.toLocaleString() || 'N/A'}
                    </span>
                  </p>
                </div>
                {/* Chat Section for ASSIGNED and DELIVERING orders */}
                {(order.status === ORDER_STATUSES.ASSIGNED ||
                  order.status === ORDER_STATUSES.DELIVERING) && (
                  <div className="mt-6">
                    <OrderChat
                      orderId={order.order_id}
                      userId={userId}
                      userRole="purchaser"
                      className="mb-4 h-80"
                    />
                  </div>
                )}
                {/* Cancel Button for Pending, Assigned */}
                {['PENDING', 'ASSIGNED'].includes(order.status) && (
                  <button
                    onClick={() => handleCancelOrder(order.order_id)}
                    className="mt-2 w-full rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      {/* Confirmation Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-80 rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">Confirm Cancellation</h2>
            <p className="mb-6">Are you sure you want to cancel this order?</p>
            <div className="flex justify-end gap-2">
              <button
                className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
                onClick={() => {
                  setShowCancelDialog(false);
                  setOrderToCancel(null);
                }}
              >
                Cancel
              </button>
              <button
                className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                onClick={confirmCancelOrder}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Success Prompt */}
      {showSuccessPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-80 rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">Order Cancelled</h2>
            <p className="mb-6">You have successfully cancelled the order.</p>
            <div className="flex justify-end">
              <button
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                onClick={() => setShowSuccessPrompt(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
