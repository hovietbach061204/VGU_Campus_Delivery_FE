'use client';

import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { acceptOrder } from '@/app/api/order';
import { ensureAuthenticated } from '@/lib/auth';
import { useLiveLocation } from '@/hooks/useLiveLocation';
import {
  diagnoseLocationAccess,
  getLocationErrorMessage,
} from '@/utils/locationDiagnostic';

type FirestoreOrder = {
  order_id: string;
  purchaser_id: string;
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
  const [deliveringOrders, setDeliveringOrders] = useState<FirestoreOrder[]>(
    []
  );
  const [sortBy, setSortBy] = useState<'asc' | 'desc'>('asc');
  const [locationPreloaded, setLocationPreloaded] = useState(false);

  // Preload driver location when component mounts
  useEffect(() => {
    const preloadLocation = async () => {
      try {
        await attemptDriverLocationDetection(0);
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
    const q = query(collection(db, 'orders'), where('status', '==', 'PENDING'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const liveOrders = snapshot.docs.map((doc) => {
        const data = doc.data() as Omit<FirestoreOrder, 'id'>;
        console.log(data);
        return { id: doc.id, ...data };
      });
      setOrders(liveOrders);
    });

    return () => unsubscribe();
  }, []);

  // Enable live location tracking for the first active delivery order (if any)
  const activeDeliveryOrderId =
    deliveringOrders.length > 0 ? deliveringOrders[0].order_id : null;
  useLiveLocation(
    activeDeliveryOrderId ?? '',
    'deliveryman',
    !!activeDeliveryOrderId
  );

  // Enhanced location detection for drivers with optimized retry logic
  const attemptDriverLocationDetection = async (
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

  const handleAccept = async (orderId: string) => {
    let token: string;
    let driverId: string;

    try {
      const auth = ensureAuthenticated();
      token = auth.token;
      driverId = auth.userId;
    } catch (err) {
      alert('You must be logged in as a driver to accept orders.');
      console.log(err);
      return;
    }

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      alert(
        'Geolocation is not supported by your browser. Location is required to accept orders.'
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
        const location = await attemptDriverLocationDetection(attempt);

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
          alert(`✅ ${result.status || 'Order accepted successfully!'}`);

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
          alert(`Failed to accept order: ${err.message}`);

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
          const shouldRetry = confirm(
            `${errorMessage}\n\nThis can happen due to:\n• GPS signal issues\n• Location services disabled\n• Network connectivity\n• Device power saving mode\n\nWould you like to try again?`
          );

          if (shouldRetry) {
            // Recursive retry - start fresh
            await handleAccept(orderId);
          } else {
            // Restore button state on final failure
            if (acceptButton) {
              acceptButton.textContent = originalText || 'Accept Order';
              (acceptButton as HTMLButtonElement).disabled = false;
            }
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
    alert(`Passed on order ${orderId}`);
    setOrders((prev) => prev.filter((o) => o.order_id !== orderId));
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-6 text-gray-800">
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
          <h1 className="flex items-center gap-2 text-2xl font-bold text-[#ff785b]">
            <span>📦</span> Available Orders
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

        {orders.length === 0 ? (
          <p className="text-center text-sm text-gray-500">
            No available orders.
          </p>
        ) : (
          <ul className="space-y-5">
            {orders
              .sort((a, b) =>
                sortBy === 'asc'
                  ? a.total_price.localeCompare(b.total_price, undefined, {
                      numeric: true,
                    })
                  : b.total_price.localeCompare(a.total_price, undefined, {
                      numeric: true,
                    })
              )
              .map((order) => (
                <li
                  key={order.order_id}
                  className="rounded-xl border bg-white p-5 shadow"
                >
                  <div className="mb-2">
                    <p className="font-semibold text-gray-700">
                      Order ID: {order.order_id}
                    </p>
                    <p className="text-sm text-gray-600">
                      Customer ID: {order.purchaser_id}
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
                      {(order.foodItems ?? []).map((item, idx) => (
                        <li key={idx}>{item.toString()}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => handleAccept(order.order_id)}
                      data-order-id={order.order_id}
                      className={`flex-1 rounded py-2 font-medium text-white shadow-sm transition-colors disabled:bg-gray-400 ${
                        locationPreloaded
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-yellow-600 hover:bg-yellow-700'
                      }`}
                      title={
                        locationPreloaded
                          ? 'Location ready - instant acceptance'
                          : 'Location not ready - may take longer'
                      }
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
                      Customer ID: {order.purchaser_id}
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
                      {(order.foodItems ?? []).map((item, idx) => (
                        <li key={idx}>{item.toString()}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Simplified Chat Section - Only Full Screen Chat Button */}
                  <div className="mt-4">
                    <div className="flex justify-center">
                      <button
                        onClick={() =>
                          window.open(
                            `/DeliveryStatus?orderId=${order.order_id}`,
                            '_blank'
                          )
                        }
                        className="w-full rounded bg-[#ff785b] py-3 font-semibold text-white shadow-sm transition-colors hover:bg-[#ff5b3b]"
                      >
                        💬 Chat with Purchaser
                      </button>
                    </div>
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
