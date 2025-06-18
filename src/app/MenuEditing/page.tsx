'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { createEatery } from '../api/eatery';
import { ensureAuthenticated } from '@/lib/auth';
import { addFoodItemToEatery } from '../api/eatery';
import { loadFormattedEateries } from '@/lib/utils';
import HomeIconNavigation from '@/components/HomeIconNavigation';

// Define Restaurant type locally since types/restaurant.ts is removed
interface Restaurant {
  id: number;
  name: string;
  location: string;
  contactNumber: string;
  dishes: Array<{
    id: number;
    name: string;
    price: number;
    description: string;
  }>;
}

export default function MenuEditing() {
  const [menu, setMenu] = useState<Restaurant[]>([]);
  const [newDish, setNewDish] = useState({
    name: '',
    price: 0,
    description: '',
    restaurantId: 0,
  });
  const [notification, setNotification] = useState<string | null>(null); // <-- Add notification state
  const [notificationType, setNotificationType] = useState<
    'success' | 'error' | 'warning'
  >('success'); // Notification color and timeout logic
  const [showAddRestaurant, setShowAddRestaurant] = useState(false);
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    location: '',
    contactNumber: '',
  });

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

  const showNotification = (
    message: string,
    type: 'success' | 'error' | 'warning' = 'success'
  ) => {
    setNotification(message);
    setNotificationType(type);
    setTimeout(() => setNotification(null), 5000);
  };

  const addDish = async () => {
    if (
      !newDish.name ||
      !newDish.price ||
      !newDish.description ||
      !newDish.restaurantId
    ) {
      showNotification(
        'Please fill in all fields to add a new dish.',
        'warning'
      );
      return;
    }
    const targetRestaurant = menu.find((r) => r.id === newDish.restaurantId);
    if (!targetRestaurant) {
      showNotification('Invalid restaurant selected.', 'warning');
      return;
    }
    try {
      const auth = ensureAuthenticated();
      const token = auth.token;
      await addFoodItemToEatery(token, targetRestaurant.name, {
        name: newDish.name,
        price: newDish.price,
        description: newDish.description,
      });
      setMenu((prevMenu) =>
        prevMenu.map((restaurant) =>
          restaurant.id === newDish.restaurantId
            ? {
                ...restaurant,
                dishes: [
                  ...restaurant.dishes,
                  { ...newDish, id: restaurant.dishes.length + 1 },
                ],
              }
            : restaurant
        )
      );
      setNewDish({ name: '', price: 0, description: '', restaurantId: 0 });
      showNotification('Dish successfully added!', 'success');
    } catch (err: any) {
      showNotification(err.message || 'Failed to add dish.', 'error');
    }
  };

  // Add new restaurant
  const handleCreateRestaurant = async () => {
    if (
      !newRestaurant.name ||
      !newRestaurant.location ||
      !newRestaurant.contactNumber
    ) {
      showNotification(
        'Please fill in all fields for the new restaurant.',
        'warning'
      );
      return;
    }
    try {
      const auth = ensureAuthenticated();
      const token = auth.token;
      await createEatery(token, {
        name: newRestaurant.name,
        location: newRestaurant.location, // backend now expects 'location'
        contactNumber: newRestaurant.contactNumber,
        foodItems: [],
      });
      const formatted = await loadFormattedEateries();
      setMenu(formatted);
      setShowAddRestaurant(false);
      setNewRestaurant({ name: '', location: '', contactNumber: '' });
      showNotification('Restaurant created successfully!', 'success');
    } catch (err: any) {
      showNotification(err.message || 'Failed to create restaurant.', 'error');
    }
  };

  // Save changes to localStorage
  const saveChanges = () => {
    localStorage.setItem('menu', JSON.stringify(menu)); // Save updated menu
    showNotification('Menu changes saved successfully!', 'success');
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#ffe5dc] via-[#fff8f6] to-[#ffe5dc] px-4 py-12">
      {/* Decorative Bubbles */}
      <div className="animate-float-slow absolute -top-10 left-0 size-40 rounded-full bg-[#ffbfae] opacity-30 blur-2xl" />
      <div className="animate-float absolute bottom-0 right-0 size-56 rounded-full bg-[#ff785b] opacity-20 blur-3xl" />
      <div className="animate-float-reverse absolute left-0 top-1/2 size-24 rounded-full bg-[#ffe5dc] opacity-40 blur-xl" />
      <div className="animate-float absolute right-1/3 top-1/4 size-32 rounded-full bg-[#fa9f3d] opacity-20 blur-2xl" />
      <div className="animate-float absolute bottom-1/4 left-1/3 size-24 rounded-full bg-[#9757d7] opacity-10 blur-2xl" />
      <HomeIconNavigation />
      <div className="relative z-10 w-full max-w-3xl rounded-2xl border border-[#ffbfae] bg-white/90 p-8 shadow-2xl backdrop-blur-md">
        {/* Notification Toast */}
        {notification && (
          <div
            className={`animate-fade-in fixed left-1/2 top-8 z-50 mb-4 flex -translate-x-1/2 items-center justify-between rounded-lg border px-4 py-2 shadow
              ${notificationType === 'success' ? 'border-green-200 bg-green-100 text-green-800' : ''}
              ${notificationType === 'error' ? 'border-red-200 bg-red-100 text-red-800' : ''}
              ${notificationType === 'warning' ? 'border-yellow-200 bg-yellow-100 text-yellow-800' : ''}
            `}
            style={{ minWidth: '320px', maxWidth: '90vw' }}
          >
            <span>{notification}</span>
            <button
              onClick={() => setNotification(null)}
              className={`ml-4 font-bold
                ${notificationType === 'success' ? 'text-green-700 hover:text-green-900' : ''}
                ${notificationType === 'error' ? 'text-red-700 hover:text-red-900' : ''}
                ${notificationType === 'warning' ? 'text-yellow-700 hover:text-yellow-900' : ''}
              `}
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        )}
        <h1 className="mb-6 text-center text-3xl font-extrabold tracking-tight text-[#ff785b] drop-shadow-sm">
          🍽️ Menu Management
        </h1>

        {/* Button to add a new restaurant */}
        <div className="my-6 flex justify-center">
          <Button
            onClick={() => setShowAddRestaurant((prev) => !prev)}
            className="rounded-full bg-gradient-to-r from-[#ff785b] to-[#ffb88c] px-6 py-2 text-lg font-semibold text-white shadow transition-transform hover:scale-105"
          >
            + Add Restaurant
          </Button>
        </div>
        {/* Inline Add Restaurant Form */}
        {showAddRestaurant && (
          <div className="mx-auto mb-8 max-w-xl rounded-xl border border-orange-100 bg-[#fff7f3] p-6 shadow-inner">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-[#ff785b]">
              <span>🏠</span> Add New Restaurant
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                type="text"
                value={newRestaurant.name}
                onChange={(e) =>
                  setNewRestaurant({ ...newRestaurant, name: e.target.value })
                }
                placeholder="Restaurant Name"
                className="rounded border border-gray-300 p-2 focus:ring-2 focus:ring-[#ff785b]"
              />
              <input
                type="text"
                value={newRestaurant.location}
                onChange={(e) =>
                  setNewRestaurant({
                    ...newRestaurant,
                    location: e.target.value,
                  })
                }
                placeholder="Location"
                className="rounded border border-gray-300 p-2 focus:ring-2 focus:ring-[#ff785b]"
              />
              <input
                type="tel"
                pattern="[0-9]*"
                inputMode="numeric"
                value={newRestaurant.contactNumber}
                onChange={(e) => {
                  // Only allow digits
                  const value = e.target.value.replace(/\D/g, '');
                  setNewRestaurant({ ...newRestaurant, contactNumber: value });
                }}
                placeholder="Phone Number"
                className="rounded border border-gray-300 p-2 focus:ring-2 focus:ring-[#ff785b] md:col-span-2"
              />
            </div>
            <div className="mt-4 flex justify-center gap-4">
              <Button
                onClick={handleCreateRestaurant}
                className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
              >
                Create
              </Button>
              <Button
                onClick={() => setShowAddRestaurant(false)}
                className="rounded bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Add New Dish */}
        <div className="my-8 rounded-xl border border-orange-100 bg-[#fff7f3] p-6 shadow-inner">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-[#ff785b]">
            <span>➕</span> Add New Dish
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              type="text"
              value={newDish.name}
              onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
              placeholder="Dish Name"
              className="rounded border border-gray-300 p-2 focus:ring-2 focus:ring-[#ff785b]"
            />
            <input
              type="number"
              value={newDish.price === 0 ? '' : newDish.price}
              onChange={(e) => {
                // Prevent leading zeroes
                const value = e.target.value.replace(/^0+(?!$)/, '');
                setNewDish({ ...newDish, price: value === '' ? 0 : +value });
              }}
              placeholder="Price (VND)"
              className="rounded border border-gray-300 p-2 focus:ring-2 focus:ring-[#ff785b]"
            />
            <input
              type="text"
              value={newDish.description}
              onChange={(e) =>
                setNewDish({ ...newDish, description: e.target.value })
              }
              placeholder="Description"
              className="rounded border border-gray-300 p-2 focus:ring-2 focus:ring-[#ff785b] md:col-span-2"
            />
            <select
              value={newDish.restaurantId}
              onChange={(e) =>
                setNewDish({ ...newDish, restaurantId: +e.target.value })
              }
              className="rounded border border-gray-300 bg-[#fff0e6] p-2 font-semibold text-[#ff785b] focus:ring-2 focus:ring-[#ff785b] md:col-span-2"
            >
              <option value={0} disabled>
                🍽️ Select a Restaurant...
              </option>
              {menu.length === 0 ? (
                <option disabled>No restaurants available</option>
              ) : (
                menu.map((restaurant) => (
                  <option key={restaurant.id} value={restaurant.id}>
                    {restaurant.name}
                  </option>
                ))
              )}
            </select>
          </div>
          <Button
            onClick={addDish}
            className="mt-4 w-full rounded-lg bg-gradient-to-r from-[#ff785b] to-[#ffb88c] py-2 font-semibold text-white shadow transition-transform hover:scale-105"
          >
            Add Dish
          </Button>
        </div>

        {/* Display Current Menu */}
        <div className="space-y-8">
          {menu.map((restaurant) => (
            <div
              key={restaurant.id}
              className="rounded-xl border border-orange-100 bg-white/80 p-6 shadow"
            >
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <h2 className="flex items-center gap-2 text-xl font-bold text-[#ff785b]">
                    <span>🏠</span> {restaurant.name}
                  </h2>
                  <p className="text-sm text-gray-500">{restaurant.location}</p>
                  <p className="text-sm text-gray-500">
                    Phone number: {restaurant.contactNumber}
                  </p>
                </div>
                <button
                  onClick={() =>
                    showNotification(
                      'Delete functionality is disabled in this version.',
                      'warning'
                    )
                  }
                  className="ml-4 rounded bg-red-500 px-3 py-1 font-semibold text-white transition hover:bg-red-600"
                  title="Remove Restaurant"
                >
                  Delete Eatery
                </button>
              </div>
              <ul className="mt-4 space-y-2">
                {restaurant.dishes.map((dish) => (
                  <li
                    key={`${restaurant.id}-${dish.name}`}
                    className="flex items-center justify-between rounded-lg border border-orange-50 bg-[#fff7f3] px-4 py-2 shadow-sm transition hover:bg-[#ffe5dc]"
                  >
                    <div>
                      <span className="font-semibold text-gray-800">
                        {dish.name}
                      </span>
                      <span className="mx-2 text-gray-400">|</span>
                      <span className="font-bold text-[#ff785b]">
                        {dish.price} VND
                      </span>
                      <span className="mx-2 text-gray-400">|</span>
                      <span className="text-sm text-gray-500">
                        {dish.description}
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        showNotification(
                          'Delete functionality is disabled in this version.',
                          'warning'
                        )
                      }
                      className="rounded-full bg-red-100 px-3 py-1 font-semibold text-red-600 transition hover:bg-red-200"
                      title="Remove Dish"
                    >
                      🗑️
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Save Changes Button */}
        <div className="mt-8">
          <Button
            onClick={saveChanges}
            className="w-full rounded-lg bg-green-500 py-2 font-bold text-white shadow transition-transform hover:scale-105"
          >
            💾 Save Changes
          </Button>
        </div>
      </div>
    </main>
  );
}
