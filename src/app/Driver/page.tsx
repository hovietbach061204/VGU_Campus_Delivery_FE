'use client';

import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  acceptOrder,
  advanceOrderStatus,
  revertOrderToPending,
} from '@/app/api/order';
import { ensureAuthenticated } from '@/lib/auth';
import { useLiveLocation } from '@/hooks/useLiveLocation';
import HomeIconNavigation from '@/components/HomeIconNavigation';
import {
  diagnoseLocationAccess,
  getLocationErrorMessage,
} from '@/utils/locationDiagnostic';
import OrderChat from '@/components/OrderChat';
import { getUserProfile } from '@/app/api/user';

type FirestoreOrder = {
  order_id: string;
  purchaser_id: string;
  purchaser_name?: string; // Add optional purchaser_name
  purchaser_lat: number;
  purchaser_lon: number;
  delivery_man_id: string | null;
  status: string;
  total_price: string;
  eateryName: string;
  foodItems: ({ name: string; quantity?: number } | string)[];
};

const MAX_LOCATION_RETRIES = 3;

export default function DriverOrderListener() {
  const [orders, setOrders] = useState<FirestoreOrder[]>([]);
  const [availableOrders, setAvailableOrders] = useState<FirestoreOrder[]>([]);
  const [deliveringOrders, setDeliveringOrders] = useState<FirestoreOrder[]>(
    []
  );
  const [activeTab, setActiveTab] = useState<
    'pending' | 'assigned' | 'delivering' | 'delivered' | 'all'
  >('pending');

  const [sortBy, setSortBy] = useState<'asc' | 'desc'>('asc');
  const [locationPreloaded, setLocationPreloaded] = useState(false);
  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    pending: 0,
    assigned: 0,
    delivering: 0,
    delivered: 0,
  });
  const [purchaserNames, setPurchaserNames] = useState<{
    [id: string]: string;
  }>({});
  const [purchaserPhones, setPurchaserPhones] = useState<{
    [id: string]: string;
  }>({});
  const [promptMessage, setPromptMessage] = useState<string | null>(null);
  const [promptType, setPromptType] = useState<
    'success' | 'error' | 'warning' | 'info'
  >('info');
  const [isPromptVisible, setIsPromptVisible] = useState(false);
  const [confirmAction, setConfirmAction] = useState<null | {
    message: string;
    onConfirm: () => void;
  }>(null);

  // Preload driver location when component mounts
  useEffect(() => {
    const preloadLocation = async () => {
      try {
        await attemptDriverLocation(0);
        setLocationPreloaded(true);
        console.log('📍 Driver location preloaded successfully');
      } catch {
        console.log(
          '⚠️ Could not preload location, will try when accepting orders'
        );
      }
    };

    preloadLocation();
  }, []);

  useEffect(() => {
    const auth = ensureAuthenticated();
    const driverId = auth.userId;

    const q = query(
      collection(db, 'orders'),
      where('delivery_man_id', '==', driverId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allOrders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as FirestoreOrder),
      }));
      setOrders(allOrders);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'orders'), where('status', '==', 'PENDING'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const available = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as FirestoreOrder),
      }));
      setAvailableOrders(available); // <-- use a separate state
    });

    return () => unsubscribe();
  }, []);

  // Update statusCounts in real-time
  useEffect(() => {
    const allOrders = [...availableOrders, ...orders];
    const all = allOrders.length;
    const pending = allOrders.filter((o) => o.status === 'PENDING').length;
    const assigned = allOrders.filter((o) => o.status === 'ASSIGNED').length;
    const delivering = allOrders.filter(
      (o) => o.status === 'DELIVERING'
    ).length;
    const delivered = allOrders.filter((o) => o.status === 'DELIVERED').length;
    setStatusCounts({ all, pending, assigned, delivering, delivered });
  }, [orders, availableOrders]);

  // Enable live location tracking for the first active delivery order (if any)
  const activeDeliveryOrderId =
    deliveringOrders.length > 0 ? deliveringOrders[0].order_id : null;
  useLiveLocation(
    activeDeliveryOrderId ?? '',
    'deliveryman',
    !!activeDeliveryOrderId
  );

  // Enhanced location detection for drivers with optimized retry logic
  const attemptDriverLocation = async (
    retryCount = 0
  ): Promise<{ lat: number; lon: number }> => {
    console.log(
      `🚚 Driver location attempt ${retryCount + 1}/${MAX_LOCATION_RETRIES}`
    );

    // Run diagnostics first
    const diagnostic = await diagnoseLocationAccess();
    console.log('📊 Driver location diagnostic:', diagnostic);

    if (!diagnostic.isSupported) {
      throw new Error('Geolocation not supported by browser');
    }

    if (!diagnostic.isSecureContext) {
      throw new Error('Secure context (HTTPS) required for location access');
    }

    // If we have cached position and it's recent (within 5 minutes), use it
    if (diagnostic.currentPosition) {
      console.log('✅ Using cached driver location from diagnostic');
      return {
        lat: diagnostic.currentPosition.lat,
        lon: diagnostic.currentPosition.lon,
      };
    }

    // const statusCounts = {
    //   pending: orders.filter((o) => o.status === 'PENDING').length,
    //   assigned: orders.filter((o) => o.status === 'ASSIGNED').length,
    //   delivering: orders.filter((o) => o.status === 'DELIVERING').length,
    //   delivered: orders.filter((o) => o.status === 'DELIVERED').length,
    // };

    // Try fresh location detection with optimized timeouts
    const timeouts = [3000, 5000, 8000]; // Shorter, more responsive timeouts
    const timeout = timeouts[Math.min(retryCount, timeouts.length - 1)];

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(
            `✅ Fresh driver location obtained on attempt ${retryCount + 1}:`,
            {
              lat: position.coords.latitude,
              lon: position.coords.longitude,
              accuracy: position.coords.accuracy,
            }
          );
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.warn(`⚠️ Driver location attempt ${retryCount + 1} failed:`, {
            code: error.code,
            message: error.message,
          });
          reject(error);
        },
        {
          enableHighAccuracy: false, // Use lower accuracy for faster response
          timeout: timeout,
          maximumAge: 180000, // Accept cached position up to 3 minutes old
        }
      );
    });
  };

  // Auto-hide prompt after 5 seconds with fade-out effect
  useEffect(() => {
    if (promptMessage) {
      setIsPromptVisible(true);
      const timer = setTimeout(() => {
        setIsPromptVisible(false);
        setTimeout(() => setPromptMessage(null), 400); // match transition duration
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [promptMessage]);

  const showPrompt = (
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'info'
  ) => {
    setPromptMessage(message);
    setPromptType(type);
    setIsPromptVisible(true);
  };

  const handleStartDelivery = async (orderId: string) => {
    try {
      const { token } = ensureAuthenticated();
      const result = await advanceOrderStatus(orderId, token);
      showPrompt(result?.message || 'Order marked as Delivering!', 'success');
    } catch (err: any) {
      showPrompt(
        err.message || 'Failed to update status to IN_TRANSIT',
        'error'
      );
    }
  };

  const handleMarkDelivered = async (orderId: string) => {
    try {
      const { token } = ensureAuthenticated();
      const result = await advanceOrderStatus(orderId, token);
      showPrompt(result?.message || 'Order marked as Delivered!', 'success');
    } catch (err: any) {
      showPrompt(
        err.message || 'Failed to update status to DELIVERED',
        'error'
      );
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    setConfirmAction({
      message: 'Are you sure you want to cancel this order?',
      onConfirm: async () => {
        try {
          const { token } = ensureAuthenticated();
          const result = await revertOrderToPending(orderId, token);
          showPrompt(
            result?.message || 'Order cancelled successfully',
            'success'
          );
        } catch (err: any) {
          showPrompt(err.message || 'Failed to cancel order', 'error');
        }
        setConfirmAction(null);
      },
    });
  };

  const handleAccept = async (orderId: string) => {
    let token: string;
    let driverId: string;
    try {
      const auth = ensureAuthenticated();
      token = auth.token;
      driverId = auth.userId;
    } catch (err) {
      showPrompt(
        'You must be logged in as a driver to accept orders.',
        'error'
      );
      console.log(err);
      return;
    }

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      showPrompt(
        'Geolocation is not supported by your browser. Location is required to accept orders.',
        'error'
      );
      return;
    }

    // Show loading state while getting location
    const acceptButton = document.querySelector(`[data-order-id="${orderId}"]`);
    const originalText = acceptButton?.textContent;
    if (acceptButton) {
      acceptButton.textContent = 'Getting Location...';
      (acceptButton as HTMLButtonElement).disabled = true;
    }

    // Try location detection with retry logic
    for (let attempt = 0; attempt < MAX_LOCATION_RETRIES; attempt++) {
      try {
        const location = await attemptDriverLocation(attempt);

        console.log('🚚 Driver location obtained, accepting order:', {
          lat: location.lat,
          lon: location.lon,
          orderId,
        });

        try {
          const result = await acceptOrder(
            orderId,
            driverId,
            location.lon,
            location.lat,
            token
          );
          showPrompt(
            result.status || 'Order accepted successfully!',
            'success'
          );

          setOrders((prev) => {
            const accepted = prev.find((o) => o.order_id === orderId);
            if (!accepted) return prev;

            setDeliveringOrders((prevDelivering) => {
              const alreadyExists = prevDelivering.some(
                (o) => o.order_id === accepted.order_id
              );
              if (alreadyExists) return prevDelivering;
              return [...prevDelivering, accepted];
            });

            return prev.filter((o) => o.order_id !== orderId);
          });

          // Restore button state on success
          if (acceptButton) {
            acceptButton.textContent = originalText || 'Accept Order';
            (acceptButton as HTMLButtonElement).disabled = false;
          }
          return; // Success, exit function
        } catch (err: any) {
          console.error('❌ Failed to accept order:', err);
          showPrompt(`Failed to accept order: ${err.message}`, 'error');

          // Restore button state on order API failure
          if (acceptButton) {
            acceptButton.textContent = originalText || 'Accept Order';
            (acceptButton as HTMLButtonElement).disabled = false;
          }
          return; // Exit on API failure
        }
      } catch (error: any) {
        console.warn(
          `⚠️ Driver location attempt ${attempt + 1} failed:`,
          error
        );

        if (attempt === MAX_LOCATION_RETRIES - 1) {
          // Final attempt failed
          const errorMessage = getLocationErrorMessage(error);
          setConfirmAction({
            message: `${errorMessage}\n\nThis can happen due to:\n• GPS signal issues\n• Location services disabled\n• Network connectivity\n• Device power saving mode\n\nWould you like to try again?`,
            onConfirm: async () => {
              setConfirmAction(null);
              await handleAccept(orderId);
            },
          });
          // Restore button state on final failure
          if (acceptButton) {
            acceptButton.textContent = originalText || 'Accept Order';
            (acceptButton as HTMLButtonElement).disabled = false;
          }
          return;
        } else {
          // Wait before next attempt - shorter delay for faster response
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }
    }
  };

  const handlePass = (orderId: string) => {
    showPrompt(`Passed on order ${orderId}`, 'info');
    setOrders((prev) => prev.filter((o) => o.order_id !== orderId));
  };

  // Merge and deduplicate orders by order_id
  const mergedOrders = [...availableOrders, ...orders];
  const uniqueOrdersMap = new Map();
  mergedOrders.forEach((order) => {
    uniqueOrdersMap.set(order.order_id, order);
  });
  const uniqueOrders = Array.from(uniqueOrdersMap.values());

  // Update filteredOrders logic to support 'all' tab
  const filteredOrders = uniqueOrders.filter((o) => {
    switch (activeTab) {
      case 'pending':
        return o.status === 'PENDING';
      case 'assigned':
        return o.status === 'ASSIGNED';
      case 'delivering':
        return o.status === 'DELIVERING';
      case 'delivered':
        return o.status === 'DELIVERED';
      case 'all':
      default:
        return true;
    }
  });

  // Fetch purchaser name and phone number for each order in Driver page.
  useEffect(() => {
    // Fetch purchaser names and phone numbers for all orders
    const fetchPurchaserInfo = async () => {
      const auth = ensureAuthenticated();
      const ids = Array.from(
        new Set(orders.map((o) => o.purchaser_id).filter(Boolean))
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
      setPurchaserNames(names);
      setPurchaserPhones(phones);
    };
    if (orders.some((o) => o.purchaser_id)) fetchPurchaserInfo();
  }, [orders]);

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
        <span className="mb-2 animate-bounce text-5xl">🚚</span>
        <h1 className="mb-2 text-3xl font-bold text-[#ff785b] drop-shadow">
          Delivering Dashboard
        </h1>
        <p className="text-gray-600">
          Manage and track your delivery orders in real time
        </p>
      </div>

      {/* Prompt Message */}
      {promptMessage && (
        <div
          className={`duration-400 mb-4 rounded px-4 py-3 text-center font-semibold shadow transition-opacity
            ${isPromptVisible ? 'opacity-100' : 'opacity-0'}
            ${promptType === 'success' ? 'bg-green-100 text-green-800' : ''}
            ${promptType === 'error' ? 'bg-red-100 text-red-800' : ''}
            ${promptType === 'warning' ? 'bg-yellow-100 text-yellow-800' : ''}
            ${promptType === 'info' ? 'bg-blue-100 text-blue-800' : ''}
          `}
          style={{ transition: 'opacity 400ms' }}
        >
          {promptMessage}
        </div>
      )}

      {/* Confirmation Action */}
      {confirmAction && (
        <div className="mb-4 flex flex-col items-center rounded bg-yellow-100 px-4 py-3 text-center font-semibold text-yellow-800 shadow">
          <span>{confirmAction.message}</span>
          <div className="mt-2 flex justify-center gap-4">
            <button
              className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600"
              onClick={() => {
                confirmAction.onConfirm();
              }}
            >
              Confirm
            </button>
            <button
              className="rounded bg-gray-300 px-4 py-2 font-bold text-gray-800 hover:bg-gray-400"
              onClick={() => setConfirmAction(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Home Icon Navigation */}
      <HomeIconNavigation />
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
        {/* Location Status Indicator */}
        <div className="mb-4 rounded-lg border bg-white p-3 shadow-sm">
          <div className="flex items-center gap-2">
            {locationPreloaded ? (
              <>
                <span className="text-green-600">✅</span>
                <span className="text-sm font-medium text-green-700">
                  Location Ready - Fast order acceptance
                </span>
              </>
            ) : (
              <>
                <span className="text-yellow-600">⏳</span>
                <span className="text-sm font-medium text-yellow-700">
                  Location Loading - May take a moment to accept orders
                </span>
              </>
            )}
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between border-b pb-3">
          <h1 className="...">
            {activeTab === 'pending' && '📦 Available Orders'}
            {activeTab === 'assigned' && '✅ Assigned Orders'}
            {activeTab === 'delivering' && '🚚 Delivering Orders'}
            {activeTab === 'delivered' && '📬 Delivered Orders'}
          </h1>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'asc' | 'desc')}
            className="rounded border border-[#ff785b] px-2 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#ff785b]"
          >
            <option value="asc">Sort by Price: Low to High</option>
            <option value="desc">Sort by Price: High to Low</option>
          </select>
        </div>

        {filteredOrders.length === 0 ? (
          <p className="text-center text-sm text-gray-500">
            No orders found for this status.
          </p>
        ) : (
          <ul className="space-y-5">
            {filteredOrders
              .sort((a, b) => {
                // Sort by relevant time field for each status, latest first
                const getTime = (order: any) => {
                  if (order.status === 'PENDING')
                    return (
                      order.created_at?.toDate?.()?.getTime?.() ||
                      new Date(order.created_at).getTime?.() ||
                      0
                    );
                  if (order.status === 'ASSIGNED')
                    return (
                      order.updated_at?.toDate?.()?.getTime?.() ||
                      new Date(order.updated_at).getTime?.() ||
                      0
                    );
                  if (order.status === 'DELIVERING')
                    return (
                      order.updated_at?.toDate?.()?.getTime?.() ||
                      new Date(order.updated_at).getTime?.() ||
                      0
                    );
                  if (order.status === 'DELIVERED')
                    return (
                      order.updated_at?.toDate?.()?.getTime?.() ||
                      new Date(order.updated_at).getTime?.() ||
                      0
                    );
                  return 0;
                };
                return getTime(b) - getTime(a);
              })
              .map((order) => (
                <li
                  key={order.order_id}
                  className="rounded-xl border bg-white p-5 shadow"
                >
                  <div className="mb-2 flex items-center gap-3">
                    <p className="font-semibold text-gray-700">
                      Order ID: {order.order_id}
                    </p>
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
                        order.status === 'PENDING'
                          ? 'bg-yellow-50 text-yellow-600'
                          : order.status === 'ASSIGNED'
                            ? 'bg-blue-50 text-blue-600'
                            : order.status === 'DELIVERING'
                              ? 'bg-purple-50 text-purple-600'
                              : order.status === 'DELIVERED'
                                ? 'bg-green-50 text-green-600'
                                : 'bg-gray-50 text-gray-600'
                      }`}
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
                        {order.total_price.toLocaleString()}đ
                      </span>
                    </p>
                  </div>

                  <div className="mb-3">
                    <p className="mb-1 text-sm font-medium text-[#ff785b]">
                      Items:
                    </p>
                    <ul className="list-disc pl-4 text-sm text-gray-700">
                      {(order.foodItems ?? []).map((item: any, idx: number) => {
                        const name =
                          typeof item === 'string' ? item : item.name;
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

                  {/* Purchaser Info for all statuses, show Order Time for Pending */}
                  <div className="mb-3">
                    <p className="text-sm text-gray-600">
                      Customer Name:{' '}
                      <span className="font-semibold">
                        {purchaserNames[order.purchaser_id] ||
                          order.purchaser_id.slice(0, 8) + '...'}
                      </span>
                    </p>
                    {purchaserPhones[order.purchaser_id] && (
                      <p className="text-sm text-gray-600">
                        Customer Phone:{' '}
                        <span className="font-semibold">
                          {purchaserPhones[order.purchaser_id]}
                        </span>
                      </p>
                    )}
                    {order.status === 'PENDING' && order.created_at && (
                      <p className="text-sm text-gray-600">
                        Order Time:{' '}
                        <span className="font-semibold">
                          {order.created_at.toDate?.()?.toLocaleString?.() ||
                            order.created_at}
                        </span>
                      </p>
                    )}
                    {order.status === 'ASSIGNED' && order.updated_at && (
                      <p className="text-sm text-gray-600">
                        Accepted Time:{' '}
                        <span className="font-semibold">
                          {order.updated_at.toDate?.()?.toLocaleString?.() ||
                            order.updated_at}
                        </span>
                      </p>
                    )}
                    {order.status === 'DELIVERING' && order.updated_at && (
                      <p className="text-sm text-gray-600">
                        Start Delivering Time:{' '}
                        <span className="font-semibold">
                          {order.updated_at.toDate?.()?.toLocaleString?.() ||
                            order.updated_at}
                        </span>
                      </p>
                    )}
                    {order.status === 'DELIVERED' && order.updated_at && (
                      <p className="text-sm text-gray-600">
                        Successfully Delivered Time:{' '}
                        <span className="font-semibold">
                          {order.updated_at.toDate?.()?.toLocaleString?.() ||
                            order.updated_at}
                        </span>
                      </p>
                    )}
                  </div>

                  {/* Chat Section for ASSIGNED orders */}
                  {order.status === 'ASSIGNED' && (
                    <div className="mt-6">
                      <OrderChat
                        orderId={order.order_id}
                        userId={ensureAuthenticated().userId}
                        userRole="deliveryman"
                        className="mb-4 h-80"
                      />
                    </div>
                  )}

                  {/* Chat Section for DELIVERING orders */}
                  {order.status === 'DELIVERING' && (
                    <div className="mt-6">
                      <OrderChat
                        orderId={order.order_id}
                        userId={ensureAuthenticated().userId}
                        userRole="deliveryman"
                        className="mb-4 h-80"
                      />
                    </div>
                  )}

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    {activeTab === 'pending' && order.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleAccept(order.order_id)}
                          data-order-id={order.order_id}
                          className={`flex-1 rounded py-2 font-medium text-white shadow-sm transition-colors disabled:bg-gray-400 ${
                            locationPreloaded
                              ? 'bg-green-600 hover:bg-green-700'
                              : 'bg-yellow-600 hover:bg-yellow-700'
                          }`}
                        >
                          {locationPreloaded
                            ? '⚡ Accept Order'
                            : '⏳ Accept Order'}
                        </button>
                        <button
                          onClick={() => handlePass(order.order_id)}
                          className="flex-1 rounded bg-gray-300 py-2 font-medium text-gray-800 shadow-sm hover:bg-gray-400"
                        >
                          Pass
                        </button>
                      </>
                    )}

                    {order.status === 'ASSIGNED' && (
                      <>
                        <button
                          onClick={() => handleStartDelivery(order.order_id)}
                          className="w-full rounded bg-blue-500 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-blue-600"
                        >
                          🚚 Start Delivery
                        </button>
                        <button
                          onClick={() => handleCancelOrder(order.order_id)}
                          className="w-full rounded bg-red-500 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-red-600"
                        >
                          ❌ Cancel Order
                        </button>
                      </>
                    )}
                    {order.status === 'DELIVERING' && (
                      <button
                        onClick={() => handleMarkDelivered(order.order_id)}
                        className="w-full rounded bg-green-600 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-green-700"
                      >
                        📬 Mark as Delivered
                      </button>
                    )}
                  </div>
                </li>
              ))}
          </ul>
        )}

        {deliveringOrders.length > 0 && (
          <div className="mt-12 border-t pt-6">
            <h2 className="mb-4 text-xl font-bold text-[#ff785b]">
              🚚 Delivering
            </h2>
            <ul className="space-y-5">
              {deliveringOrders.map((order) => (
                <li
                  key={order.order_id}
                  className="rounded-xl border bg-white p-5 shadow"
                >
                  <div className="mb-2">
                    <p className="font-semibold text-gray-700">
                      Order ID: {order.order_id}
                    </p>
                    <p className="text-sm text-gray-600">
                      Restaurant:{' '}
                      <span className="font-semibold text-[#ff785b]">
                        {order.eateryName}
                      </span>
                    </p>
                    <p className="mb-2 text-sm text-gray-600">
                      Total:{' '}
                      <span className="font-semibold text-black">
                        {order.total_price.toLocaleString()}đ
                      </span>
                    </p>
                  </div>

                  <div className="mb-3">
                    <p className="mb-1 text-sm font-medium text-[#ff785b]">
                      Items:
                    </p>
                    <ul className="list-disc pl-4 text-sm text-gray-700">
                      {(order.foodItems ?? []).map((item, idx) => {
                        const name =
                          typeof item === 'string' ? item : item.name;
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

                  {/* Simplified Chat Section - Only Full Screen Chat Button */}
                  <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
                    {/* <button
                      onClick={() =>
                        window.open(
                          `/DeliveryStatus?orderId=${order.order_id}`,
                          '_blank'
                        )
                      }
                      className="w-full rounded bg-[#ff785b] py-3 font-semibold text-white shadow-sm transition-colors hover:bg-[#ff5b3b] sm:w-1/2"
                    >
                      💬 Chat with Purchaser
                    </button> */}
                    <button
                      onClick={() => handleMarkDelivered(order.order_id)}
                      className="w-full rounded bg-green-600 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-green-700 sm:w-1/2"
                    >
                      📬 Mark as Delivered
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
