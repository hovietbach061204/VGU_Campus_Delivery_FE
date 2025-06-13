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
import { cancelOrder } from '@/lib/orders';
import HomeIconNavigation from '@/components/HomeIconNavigation';
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
import { cancelOrder } from '@/app/api/order';

// Order status types
type OrderStatus = 'PENDING' | 'ACCEPTED' | 'IN_TRANSIT' | 'DELIVERED';

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
  const [newUpdates, setNewUpdates] = useState<{ [key: string]: number }>({});
  const [userId, setUserId] = useState<string>('');
  const [loading, setLoading] = useState(true);

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
        pending: liveOrders.filter((o) => o.status === 'PENDING').length,
        assigned: liveOrders.filter((o) => o.status === 'ACCEPTED').length,
        delivering: liveOrders.filter((o) => o.status === 'IN_TRANSIT').length,
        delivered: liveOrders.filter((o) => o.status === 'DELIVERED').length,
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

        setNewUpdates((prev) => ({ ...prev, ...updates }));
        return counts;
      });

      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const handleCancelOrder = async (orderId: string) => {
    const confirmCancel = confirm(
      'Are you sure you want to cancel this order?'
    );
    if (!confirmCancel) return;

    try {
      const auth = ensureAuthenticated();
      await cancelOrder(orderId, auth.token);
      alert('Order cancelled successfully');
    } catch (err: any) {
      alert(`Failed to cancel order: ${err.message}`);
    }
  };

  const handleChatWithDriver = (orderId: string) => {
    window.open(`/Chat?orderId=${orderId}&role=purchaser`, '_blank');
  };

  const handleViewMap = (orderId: string) => {
    window.open(`/Map/OrderTrackingPage?orderId=${orderId}`, '_blank');
  };

  const clearNotification = (tab: string) => {
    setNewUpdates((prev) => ({ ...prev, [tab]: 0 }));
  };

  const getFilteredOrders = () => {
    switch (activeTab) {
      case 'pending':
        return orders.filter((o) => o.status === 'PENDING');
      case 'assigned':
        return orders.filter((o) => o.status === 'ACCEPTED');
      case 'delivering':
        return orders.filter((o) => o.status === 'IN_TRANSIT');
      case 'delivered':
        return orders.filter((o) => o.status === 'DELIVERED');
      default:
        return orders;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-50';
      case 'ACCEPTED':
        return 'text-blue-600 bg-blue-50';
      case 'IN_TRANSIT':
        return 'text-purple-600 bg-purple-50';
      case 'DELIVERED':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatFoodItems = (
    items: ({ name: string; quantity?: number } | string)[]
  ) => {
    return items
      .map((item) => {
        if (typeof item === 'string') {
          return item;
        }
        return `${item.name} ${item.quantity ? `(×${item.quantity})` : ''}`;
      })
      .join(', ');
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading your orders...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-6">
      {/* Home Icon Navigation */}
      <HomeIconNavigation />

      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-[#ff785b]">
            📋 My Orders Dashboard
          </h1>
          <p className="text-gray-600">Track and manage all your food orders</p>
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-yellow-500"></div>
              <span>Pending: Waiting for driver</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-blue-500"></div>
              <span>Assigned: Driver accepted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-purple-500"></div>
              <span>Delivering: On the way</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-green-500"></div>
              <span>Delivered: Completed</span>
            </div>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="mb-6 flex flex-wrap justify-center gap-2 md:gap-4">
          {[
            { key: 'all', label: 'All', count: statusCounts.all },
            { key: 'pending', label: 'Pending', count: statusCounts.pending },
            {
              key: 'assigned',
              label: 'Assigned',
              count: statusCounts.assigned,
            },
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
              onClick={() => {
                setActiveTab(tab.key as any);
                clearNotification(tab.key);
              }}
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
              {newUpdates[tab.key] > 0 && (
                <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {newUpdates[tab.key]}
                </span>
              )}
            </button>
          ))}
        </div>

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
                className="rounded-lg border bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Order #{order.order_id.slice(0, 8)}...
                      </h3>
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="space-y-1 text-sm text-gray-600">
                      <p>
                        <strong>Restaurant:</strong> {order.eateryName}
                      </p>
                      <p>
                        <strong>Items:</strong>{' '}
                        {formatFoodItems(order.foodItems)}
                      </p>
                      <p>
                        <strong>Total:</strong>{' '}
                        {order.total_price?.toLocaleString()}đ
                      </p>{' '}
                      <p>
                        <strong>Order Time:</strong>{' '}
                        {order.created_at?.toDate?.()?.toLocaleString() ||
                          'N/A'}
                      </p>
                      {order.delivery_man_id && (
                        <p>
                          <strong>Driver ID:</strong>{' '}
                          {order.delivery_man_id.slice(0, 8)}...
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 md:flex-row">
                    {/* Pending Status Actions */}
                    {order.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleCancelOrder(order.order_id)}
                          className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                        >
                          Cancel Order
                        </button>
                        <button
                          onClick={() =>
                            window.open(
                              `/OrderStatus?orderId=${order.order_id}`,
                              '_blank'
                            )
                          }
                          className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                        >
                          📋 View Details
                        </button>
                      </>
                    )}

                    {/* Assigned Status Actions */}
                    {order.status === 'ACCEPTED' && (
                      <>
                        <button
                          onClick={() => handleCancelOrder(order.order_id)}
                          className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                        >
                          Cancel Order
                        </button>
                        <button
                          onClick={() => handleChatWithDriver(order.order_id)}
                          className="rounded bg-[#ff785b] px-4 py-2 text-white hover:bg-[#ff5b3b]"
                        >
                          💬 Chat with Driver
                        </button>
                        <button
                          onClick={() =>
                            window.open(
                              `/OrderStatus?orderId=${order.order_id}`,
                              '_blank'
                            )
                          }
                          className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                        >
                          📋 View Details
                        </button>
                      </>
                    )}

                    {/* Delivering Status Actions */}
                    {order.status === 'IN_TRANSIT' && (
                      <>
                        <button
                          onClick={() => handleChatWithDriver(order.order_id)}
                          className="rounded bg-[#ff785b] px-4 py-2 text-white hover:bg-[#ff5b3b]"
                        >
                          💬 Chat with Driver
                        </button>
                        <button
                          onClick={() => handleViewMap(order.order_id)}
                          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                        >
                          🗺️ View on Map
                        </button>
                        <button
                          onClick={() =>
                            window.open(
                              `/OrderStatus?orderId=${order.order_id}`,
                              '_blank'
                            )
                          }
                          className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                        >
                          📋 View Details
                        </button>
                      </>
                    )}

                    {/* Delivered Status Actions */}
                    {order.status === 'DELIVERED' && (
                      <>
                        <button
                          onClick={() => handleChatWithDriver(order.order_id)}
                          className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                        >
                          💬 View Chat History
                        </button>
                        <button
                          onClick={() =>
                            window.open(
                              `/OrderStatus?orderId=${order.order_id}`,
                              '_blank'
                            )
                          }
                          className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                        >
                          📋 Order Summary
                        </button>
                        <button
                          onClick={() => router.push('/Restaurant_Order')}
                          className="rounded bg-[#ff785b] px-4 py-2 text-white hover:bg-[#ff5b3b]"
                        >
                          🔄 Reorder
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/Restaurant_Order')}
            className="rounded bg-[#ff785b] px-8 py-3 font-semibold text-white shadow hover:bg-[#ff5b3b]"
          >
            🍽️ Place New Order
          </button>
        </div>
      </div>
    </main>
  );
}
