'use client';

import { useEffect, useState } from 'react';
import { createOrder } from '../api/order';
import { useRouter } from 'next/navigation';
import { ensureAuthenticated } from '@/lib/auth';
import { loadFormattedEateries } from '@/lib/utils';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';
import { useLiveLocation } from '@/hooks/useLiveLocation';
import OrderSuccessModal from '@/components/OrderSuccessModal';
import HomeIconNavigation from '@/components/HomeIconNavigation';
import ItemCustomizationModal from '@/components/ItemCustomizationModal';
import {
  diagnoseLocationAccess,
  getLocationErrorMessage,
} from '@/utils/locationDiagnostic';

interface OrderItem {
  name: string;
  qty: number;
  price: number;
  portion: string;
  customization: string;
  category: string;
  description: string;
}

interface Restaurant {
  name: string;
  dishes: Array<{
    name: string;
    price: number;
    description: string;
  }>;
}

// Fixed campus locations for VGU with attractive icons
const CAMPUS_LOCATIONS = [
  {
    name: 'Lecture Hall',
    lat: 10.8231,
    lon: 106.6297,
    description: 'Main lecture hall complex',
    icon: '🎓',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  {
    name: 'Dorm 1',
    lat: 10.824,
    lon: 106.6285,
    description: 'Student dormitory building 1',
    icon: '🏠',
    color: 'bg-green-100 text-green-700 border-green-200',
  },
  {
    name: 'Dorm 2',
    lat: 10.8235,
    lon: 106.629,
    description: 'Student dormitory building 2',
    icon: '🏘️',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
  },
  {
    name: 'Sport Hall',
    lat: 10.8245,
    lon: 106.628,
    description: 'Sports and recreation facilities',
    icon: '🏟️',
    color: 'bg-orange-100 text-orange-700 border-orange-200',
  },
  {
    name: 'VGU Library',
    lat: 10.8225,
    lon: 106.6301,
    description: 'Central university library',
    icon: '📚',
    color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  },
];

export default function RestaurantOrderPage() {
  const [order, setOrder] = useState<OrderItem[]>([]);
  const currentCategory = order.length > 0 ? order[0].category : null;
  const router = useRouter();
  const [menu, setMenu] = useState<Restaurant[]>([]);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [trackingEnabled, setTrackingEnabled] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderTotal, setOrderTotal] = useState(0);
  const [locationLoading, setLocationLoading] = useState(false);
  const [quantityInputs, setQuantityInputs] = useState<{
    [key: string]: string;
  }>({});
  const [selectedLocation, setSelectedLocation] = useState<{
    name: string;
    lat: number;
    lon: number;
    description: string;
    source: 'fixed' | 'auto' | 'manual';
  } | null>(null);
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    item: { name: string; price: number; description: string };
    category: string;
  } | null>(null);
  const MAX_LOCATION_RETRIES = 3;

  useEffect(() => {
    const loadData = async () => {
      try {
        const formatted = await loadFormattedEateries();
        setMenu(formatted);
      } catch (err: any) {
        console.error('Failed to load eateries:', err);
        alert(err.message || 'Failed to load menu');
      }
    };

    loadData();
  }, []);

  const addToOrder = (
    item: { name: string; price: number; description: string },
    category: string,
    customQuantity?: number,
    customPortion?: string,
    customCustomization?: string
  ) => {
    if (currentCategory && currentCategory !== category) return;

    // If custom values are provided, use them; otherwise open modal
    if (customPortion && customCustomization !== undefined && customQuantity) {
      const portion = customPortion;
      const customization = customCustomization;
      const quantity = customQuantity;

      setOrder((prev) => {
        const existing = prev.find(
          (i) =>
            i.name === item.name &&
            i.portion === portion &&
            i.customization === customization
        );
        if (existing) {
          return prev.map((i) =>
            i === existing ? { ...i, qty: i.qty + quantity } : i
          );
        } else {
          return [
            ...prev,
            {
              name: item.name,
              qty: quantity,
              price: item.price,
              portion,
              customization,
              category,
              description: item.description,
            },
          ];
        }
      });
    } else {
      // Open customization modal
      setSelectedItem({ item, category });
      setShowCustomizationModal(true);
    }
  };

  const handleCustomizationConfirm = (
    portion: string,
    customization: string,
    quantity: number
  ) => {
    if (selectedItem) {
      addToOrder(
        selectedItem.item,
        selectedItem.category,
        quantity,
        portion,
        customization
      );
      setSelectedItem(null);
    }
  };

  const addCustomQuantity = (
    item: { name: string; price: number; description: string },
    category: string
  ) => {
    const itemKey = `${category}-${item.name}`;
    const quantity = parseInt(quantityInputs[itemKey] || '1');

    if (isNaN(quantity) || quantity < 1) {
      alert('Please enter a valid quantity (positive integer)');
      return;
    }

    addToOrder(item, category, quantity);
    // Reset the input
    setQuantityInputs((prev) => ({ ...prev, [itemKey]: '' }));
  };

  const removeItem = (index: number) => {
    setOrder((prev) => prev.filter((_, i) => i !== index));
  };

  const getTotal = () => {
    return order.reduce((sum, item) => sum + item.price * item.qty, 0);
  };

  const processOrder = async (
    token: string,
    userId: string,
    lat: number,
    lon: number
  ) => {
    try {
      const foodItems = order.map((item) => ({
        name: item.name,
        quantity: item.qty,
        description:
          item.customization !== undefined &&
          item.customization !== null &&
          item.customization !== ''
            ? item.customization
            : '',
        size: item.portion ? item.portion.toUpperCase() : undefined,
      }));

      const total = getTotal();

      await createOrder(token, {
        voucherCode: [], // or provide a voucher if available
        eateryName: order[0].category,
        foodItems,
        purchaser: {
          purchaserId: userId,
          purchaserLat: lat,
          purchaserLon: lon,
        },
      });

      // Find the latest order for this user
      const q = query(
        collection(db, 'orders'),
        where('purchaser_id', '==', userId),
        orderBy('created_at', 'desc'),
        limit(1)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        const doc = snap.docs[0];
        setOrderId(doc.id);
        setTrackingEnabled(true);

        // Increment notification count
        const currentCount = parseInt(
          localStorage.getItem('newOrdersCount') || '0'
        );
        localStorage.setItem('newOrdersCount', (currentCount + 1).toString());

        // Dispatch custom event for notification update
        window.dispatchEvent(new Event('newOrderCreated'));

        // Show success modal instead of redirecting
        setOrderTotal(total);
        setShowSuccessModal(true);
        setOrder([]);
      } else {
        alert('Order created but could not find order in Firestore.');
        setOrder([]);
        router.push('/OrderDashboard');
      }
    } catch (err: any) {
      console.error('Order creation error:', err);
      alert(`Error creating order: ${err.message}`);
    }
  };

  const attemptLocationDetection = async (
    retryCount = 0
  ): Promise<{ lat: number; lon: number } | null> => {
    console.log(
      `🎯 Location attempt ${retryCount + 1}/${MAX_LOCATION_RETRIES}`
    );

    // Run diagnostics first
    const diagnostic = await diagnoseLocationAccess();
    console.log('📊 Location diagnostic:', diagnostic);

    if (!diagnostic.isSupported) {
      throw new Error('Geolocation not supported by browser');
    }

    if (!diagnostic.isSecureContext) {
      throw new Error('Secure context (HTTPS) required for location access');
    }

    // If we have cached position and it's recent, use it
    if (diagnostic.currentPosition) {
      console.log('✅ Using cached location from diagnostic');
      return {
        lat: diagnostic.currentPosition.lat,
        lon: diagnostic.currentPosition.lon,
      };
    }

    // Try fresh location detection with progressive timeout
    const timeouts = [5000, 8000, 12000]; // Progressive timeouts for retries
    const timeout = timeouts[Math.min(retryCount, timeouts.length - 1)];

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(
            `✅ Fresh location obtained on attempt ${retryCount + 1}:`,
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
          console.warn(`⚠️ Location attempt ${retryCount + 1} failed:`, {
            code: error.code,
            message: error.message,
          });
          reject(error);
        },
        {
          enableHighAccuracy: retryCount === 0, // High accuracy only on first try
          timeout: timeout,
          maximumAge: retryCount > 0 ? 300000 : 60000, // Allow older cache on retries
        }
      );
    });
  };

  const handleAutoLocationOrder = async () => {
    if (order.length === 0) {
      alert('Please add items to your order first.');
      return;
    }

    setLocationLoading(true);

    // Try automatic location detection with retries
    for (let attempt = 0; attempt < MAX_LOCATION_RETRIES; attempt++) {
      try {
        const location = await attemptLocationDetection(attempt);
        if (location) {
          console.log('🎯 Location detected successfully');
          // Just set the location, don't create order yet
          setSelectedLocation({
            name: 'Current Location',
            lat: location.lat,
            lon: location.lon,
            description: `Auto-detected (${location.lat.toFixed(4)}, ${location.lon.toFixed(4)})`,
            source: 'auto',
          });
          setLocationLoading(false);
          return;
        }
      } catch (error: any) {
        console.warn(`❌ Location attempt ${attempt + 1} failed:`, error);

        if (attempt === MAX_LOCATION_RETRIES - 1) {
          // Final attempt failed
          setLocationLoading(false);

          const errorMessage = getLocationErrorMessage(error);
          const shouldRetry = confirm(
            `${errorMessage}\n\nThis can happen due to:\n• GPS signal issues\n• Location services disabled\n• Network connectivity\n• Device power saving mode\n\nWould you like to:\n1. Try again (automatic location)\n2. Choose campus location instead\n\nClick OK to try again, Cancel for campus location`
          );

          if (shouldRetry) {
            await handleAutoLocationOrder();
          } else {
            // User can then choose fixed locations or manual input
            alert(
              'Please select a campus location or enter coordinates manually.'
            );
          }
          return;
        } else {
          // Wait before next attempt
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    }
  };

  const handleLocationSelect = async (location: {
    name: string;
    lat: number;
    lon: number;
    description: string;
  }) => {
    // Just select the location, don't create order yet
    setSelectedLocation({
      ...location,
      source: 'fixed',
    });
  };

  const handleCreateOrder = async () => {
    if (order.length === 0) {
      alert('Please add items to your order first.');
      return;
    }

    if (!selectedLocation) {
      alert('Please select a delivery location first.');
      return;
    }

    try {
      const auth = ensureAuthenticated();
      await processOrder(
        auth.token,
        auth.userId,
        selectedLocation.lat,
        selectedLocation.lon
      );
    } catch {
      alert('You must be logged in to place an order');
      router.push('/SignIn');
    }
  };

  const handlePlaceAnotherOrder = () => {
    setOrder([]);
    setSelectedLocation(null);
    setShowSuccessModal(false);
  };

  // Enable live location tracking for purchaser after order is created
  useLiveLocation(orderId ?? '', 'purchaser', trackingEnabled && !!orderId);

  return (
    <main className="min-h-screen bg-white p-4 text-gray-800">
      {/* Home Icon Navigation */}
      <HomeIconNavigation />

      <header className="rounded bg-[#ff785b] p-4 text-xl font-bold text-white shadow">
        Choose Your Food
      </header>
      <p className="mt-2 text-center text-sm font-medium text-red-500">
        Note: You can only order from one restaurant at a time.
      </p>

      {/* Fixed Campus Location Buttons */}
      <div className="mt-4 rounded bg-blue-50 p-4">
        <div className="mb-3 text-center text-sm font-medium text-blue-700">
          📍 Select Your Delivery Location
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {CAMPUS_LOCATIONS.map((location) => (
            <button
              key={location.name}
              onClick={() => handleLocationSelect(location)}
              disabled={order.length === 0}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors disabled:bg-gray-100 disabled:text-gray-400 ${
                selectedLocation?.name === location.name
                  ? 'border-[#ff785b] bg-[#ff785b] text-white'
                  : location.color + ' hover:shadow-md'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-lg">{location.icon}</span>
                <span className="text-xs">{location.name}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Auto-location button */}
        <div className="mt-3 text-center">
          <button
            onClick={handleAutoLocationOrder}
            disabled={locationLoading || order.length === 0}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:bg-gray-400 ${
              selectedLocation?.source === 'auto'
                ? 'bg-[#ff785b] text-white'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {locationLoading
              ? '📍 Getting Location...'
              : '📍 Use My Current Location'}
          </button>
          <p className="mt-1 text-xs text-gray-600">
            Automatically detect your location for delivery
          </p>
        </div>

        {/* Selected Location Display */}
        {selectedLocation && (
          <div className="mt-4 rounded-lg border border-green-200 bg-white p-3">
            <div className="flex items-center gap-2">
              <span className="text-green-600">✅</span>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Selected: {selectedLocation.name}
                </p>
                <p className="text-xs text-gray-600">
                  {selectedLocation.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-4 md:flex-row">
        <section className="flex-1 space-y-6">
          {menu.map((restaurant) => {
            const isRestaurantDisabled = !!(
              currentCategory && currentCategory !== restaurant.name
            );
            return (
              <div
                key={restaurant.name}
                className={`rounded border p-4 transition-all duration-200 ${
                  isRestaurantDisabled
                    ? 'pointer-events-none bg-gray-100 opacity-60'
                    : 'bg-white'
                }`}
              >
                <h3
                  className={`mb-2 border-b pb-2 text-lg font-semibold ${
                    isRestaurantDisabled ? 'text-gray-400' : 'text-[#ff785b]'
                  }`}
                >
                  {restaurant.name}
                  {isRestaurantDisabled && (
                    <span className="ml-2 text-xs font-normal text-gray-500">
                      (Disabled - you can only order from one restaurant)
                    </span>
                  )}
                </h3>
                {restaurant.dishes.map((item) => {
                  return (
                    <div
                      key={item.name}
                      className="mb-2 flex items-center justify-between"
                    >
                      <span
                        className={`text-sm ${
                          isRestaurantDisabled
                            ? 'text-gray-400'
                            : 'text-gray-800'
                        }`}
                      >
                        {item.name}{' '}
                        <span className="text-gray-500">
                          ({item.price.toLocaleString()}đ)
                        </span>
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            addCustomQuantity(item, restaurant.name)
                          }
                          className={`flex h-6 w-12 items-center justify-center rounded text-xs font-medium text-white transition-colors ${
                            isRestaurantDisabled
                              ? 'cursor-not-allowed bg-gray-400'
                              : 'bg-green-600 hover:bg-green-700'
                          }`}
                          disabled={isRestaurantDisabled}
                        >
                          Add
                        </button>
                        <button
                          onClick={() => addToOrder(item, restaurant.name)}
                          className={`flex size-6 items-center justify-center rounded-full text-white transition-colors ${
                            isRestaurantDisabled
                              ? 'cursor-not-allowed bg-gray-400'
                              : 'bg-[#ff785b] hover:bg-[#ff5b3b]'
                          }`}
                          disabled={isRestaurantDisabled}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </section>

        <aside className="w-full rounded border p-4 shadow-sm md:w-1/3">
          <h3 className="mb-2 text-lg font-semibold text-[#ff785b]">
            Your Order
          </h3>
          {order.length === 0 ? (
            <p className="text-sm text-gray-500">No item added yet!</p>
          ) : (
            <div className="space-y-4">
              {order.map((item, index) => (
                <div key={index} className="border-b pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">
                        {item.name} ({item.portion})
                      </div>
                      <div className="text-sm italic text-gray-500">
                        {item.customization || item.description}
                      </div>
                      <div className="text-sm">
                        {item.price.toLocaleString()}đ × {item.qty} ={' '}
                        {(item.price * item.qty).toLocaleString()}đ
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => removeItem(index)}
                        className="rounded bg-red-400 px-2 text-white hover:bg-red-500"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="mt-2 text-right text-lg font-semibold">
                Total: {getTotal().toLocaleString()}đ
              </div>

              {/* Action Buttons */}
              <div className="mt-4 space-y-3">
                <button
                  onClick={handleCreateOrder}
                  disabled={!selectedLocation || order.length === 0}
                  className="w-full rounded-lg bg-[#ff785b] py-3 font-semibold text-white transition-colors hover:bg-[#ff5b3b] disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  🛒 Create Order
                </button>

                <button
                  onClick={handlePlaceAnotherOrder}
                  disabled={order.length === 0 && !selectedLocation}
                  className="w-full rounded-lg border border-[#ff785b] py-2 text-sm font-medium text-[#ff785b] transition-colors hover:bg-[#ff785b] hover:text-white disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400"
                >
                  🔄 Place Another Order
                </button>

                <button
                  onClick={() => router.push('/OrderDashboard')}
                  className="w-full rounded-lg border border-blue-500 py-2 text-sm font-medium text-blue-500 transition-colors hover:bg-blue-500 hover:text-white"
                >
                  📋 Check Orders
                </button>
              </div>

              {!selectedLocation && order.length > 0 && (
                <div className="mt-3 text-center text-xs text-gray-500">
                  Please select a delivery location above
                </div>
              )}
            </div>
          )}
        </aside>
      </div>

      {/* Success Modal */}
      <OrderSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        orderTotal={orderTotal}
        onPlaceAnother={handlePlaceAnotherOrder}
      />

      {/* Item Customization Modal */}
      <ItemCustomizationModal
        isOpen={showCustomizationModal}
        onClose={() => {
          setShowCustomizationModal(false);
          setSelectedItem(null);
        }}
        onConfirm={handleCustomizationConfirm}
        itemName={selectedItem?.item.name || ''}
        itemDescription={selectedItem?.item.description || ''}
      />
    </main>
  );
}
