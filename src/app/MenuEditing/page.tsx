'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface Dish {
  id: number;
  name: string;
  price: number;
  description: string;
}

interface Restaurant {
  id: number;
  name: string;
  address: string;
  contactNumber: string;
  dishes: Dish[];
}

export default function MenuEditing() {
  const [menu, setMenu] = useState<Restaurant[]>([]);
  const [newDish, setNewDish] = useState({
    name: '',
    price: 0,
    description: '',
    restaurantId: 0,
  });

  const router = useRouter();

  // Fetch menu from localStorage
  useEffect(() => {
    const savedMenu = localStorage.getItem('menu');
    if (savedMenu) {
      setMenu(JSON.parse(savedMenu)); // Load menu from localStorage
    }
  }, []);

  // Navigate to AddRestaurant page
  const handleAddRestaurant = () => {
    router.push('/AddRestaurant');
  };

  // Add a new dish to a specific restaurant
  const addDish = () => {
    if (newDish.name && newDish.price && newDish.restaurantId) {
      setMenu((prevMenu) =>
        prevMenu.map((restaurant) => {
          if (restaurant.id === newDish.restaurantId) {
            return {
              ...restaurant,
              dishes: [
                ...restaurant.dishes,
                { ...newDish, id: restaurant.dishes.length + 1 },
              ],
            };
          }
          return restaurant;
        })
      );
      setNewDish({ name: '', price: 0, description: '', restaurantId: 0 });
    }
  };

  // Remove a dish from a restaurant
  const removeDish = (restaurantId: number, dishId: number) => {
    setMenu((prevMenu) =>
      prevMenu.map((restaurant) =>
        restaurant.id === restaurantId
          ? {
              ...restaurant,
              dishes: restaurant.dishes.filter((dish) => dish.id !== dishId),
            }
          : restaurant
      )
    );
    // Update localStorage with the new menu
    localStorage.setItem('menu', JSON.stringify(menu));
  };

  // Remove a restaurant from the menu
  const removeRestaurant = (restaurantId: number) => {
    setMenu((prevMenu) =>
      prevMenu.filter((restaurant) => restaurant.id !== restaurantId)
    );
    // Update localStorage with the new menu
    localStorage.setItem('menu', JSON.stringify(menu));
  };

  // Save changes to localStorage
  const saveChanges = () => {
    localStorage.setItem('menu', JSON.stringify(menu)); // Save updated menu
    alert('Menu saved!');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-[#ff785b] to-[#ffe5dc] p-8">
      <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-lg">
        <h1 className="mb-4 text-2xl font-semibold text-[#ff785b]">
          Manage Menu
        </h1>

        {/* Button to add a new restaurant */}
        <div className="my-4">
          <Button
            onClick={handleAddRestaurant}
            className="w-full rounded-lg bg-[#ff785b] py-2 text-white"
          >
            Add Restaurant
          </Button>
        </div>

        {/* Add New Dish */}
        <div className="my-4">
          <h2 className="text-xl font-semibold text-[#ff785b]">Add New Dish</h2>
          <input
            type="text"
            value={newDish.name}
            onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
            placeholder="Dish Name"
            className="mb-2 w-full rounded border border-gray-300 p-2"
          />
          <input
            type="number"
            value={newDish.price}
            onChange={(e) => setNewDish({ ...newDish, price: +e.target.value })}
            placeholder="Price (VND)"
            className="mb-2 w-full rounded border border-gray-300 p-2"
          />
          <input
            type="text"
            value={newDish.description}
            onChange={(e) =>
              setNewDish({ ...newDish, description: e.target.value })
            }
            placeholder="Description"
            className="mb-2 w-full rounded border border-gray-300 p-2"
          />
          <select
            value={newDish.restaurantId}
            onChange={(e) =>
              setNewDish({ ...newDish, restaurantId: +e.target.value })
            }
            className="mb-2 w-full rounded border border-gray-300 p-2"
          >
            <option value={0}>Select Restaurant</option>
            {menu.map((restaurant) => (
              <option key={restaurant.id} value={restaurant.id}>
                {restaurant.name}
              </option>
            ))}
          </select>
          <Button
            onClick={addDish}
            className="w-full rounded-lg bg-[#ff785b] py-2 text-white"
          >
            Add Dish
          </Button>
        </div>

        {/* Display Current Menu */}
        <div>
          {menu.map((restaurant) => (
            <div key={restaurant.id} className="mb-6">
              <h2 className="text-xl font-semibold text-[#ff785b]">
                {restaurant.name}
              </h2>
              <p className="text-sm text-gray-500">{restaurant.address}</p>
              <p className="text-sm text-gray-500">
                {restaurant.contactNumber}
              </p>
              <button
                onClick={() => removeRestaurant(restaurant.id)}
                className="text-red-600 hover:text-red-800"
              >
                Remove Restaurant
              </button>
              <ul className="mt-4 space-y-2">
                {restaurant.dishes.map((dish) => (
                  <li
                    key={dish.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      {dish.name} - {dish.price} VND
                    </div>
                    <button
                      onClick={() => removeDish(restaurant.id, dish.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove Dish
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Save Changes Button */}
        <div className="mt-4">
          <Button
            onClick={saveChanges}
            className="w-full rounded-lg bg-green-500 py-2 text-white"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
