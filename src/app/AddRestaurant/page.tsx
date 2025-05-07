'use client';

import { useState } from 'react';
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

export default function AddRestaurant() {
  const [newRestaurant, setNewRestaurant] = useState<Restaurant>({
    id: 0,
    name: '',
    address: '',
    contactNumber: '',
    dishes: [],
  });
  const [newDish, setNewDish] = useState({
    name: '',
    price: 0,
    description: '',
  });
  const router = useRouter();

  // Add a new dish to the new restaurant
  const addDish = () => {
    if (newDish.name && newDish.price && newDish.description) {
      setNewRestaurant((prev) => ({
        ...prev,
        dishes: [...prev.dishes, { ...newDish, id: prev.dishes.length + 1 }],
      }));
      setNewDish({ name: '', price: 0, description: '' });
    }
  };

  // Remove a dish from the new restaurant
  const removeDish = (dishId: number) => {
    setNewRestaurant((prev) => ({
      ...prev,
      dishes: prev.dishes.filter((dish) => dish.id !== dishId),
    }));
  };

  // Save the new restaurant and dishes into localStorage
  const saveRestaurant = () => {
    const existingMenu = localStorage.getItem('menu');
    const menu = existingMenu ? JSON.parse(existingMenu) : [];

    // Adding the new restaurant to the menu
    setNewRestaurant((prev) => {
      const updatedMenu = [...menu, { ...prev, id: menu.length + 1 }];
      localStorage.setItem('menu', JSON.stringify(updatedMenu));
      router.push('/MenuEditing'); // Navigate back to MenuEditing
      return prev;
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-[#6a11cb] to-[#2575fc] p-8">
      <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-lg">
        <h1 className="text-2xl font-semibold text-[#6a11cb]">
          Add New Restaurant
        </h1>

        {/* Restaurant Info Fields */}
        <div className="my-4">
          <input
            type="text"
            value={newRestaurant.name}
            onChange={(e) =>
              setNewRestaurant({ ...newRestaurant, name: e.target.value })
            }
            placeholder="Restaurant Name"
            className="mb-2 w-full rounded border border-gray-300 p-2"
          />
          <input
            type="text"
            value={newRestaurant.address}
            onChange={(e) =>
              setNewRestaurant({ ...newRestaurant, address: e.target.value })
            }
            placeholder="Restaurant Address"
            className="mb-2 w-full rounded border border-gray-300 p-2"
          />
          <input
            type="text"
            value={newRestaurant.contactNumber}
            onChange={(e) =>
              setNewRestaurant({
                ...newRestaurant,
                contactNumber: e.target.value,
              })
            }
            placeholder="Restaurant Contact Number"
            className="mb-2 w-full rounded border border-gray-300 p-2"
          />
        </div>

        {/* Dish Info Fields */}
        <div className="my-4">
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
          <Button
            onClick={addDish}
            className="w-full rounded-lg bg-[#6a11cb] py-2 text-white"
          >
            Add Dish
          </Button>
        </div>

        {/* Display Dishes for this Restaurant */}
        <div className="my-4">
          {newRestaurant.dishes.length > 0 && (
            <ul className="space-y-2">
              {newRestaurant.dishes.map((dish) => (
                <li key={dish.id} className="flex items-center justify-between">
                  <div>
                    {dish.name} - {dish.price} VND
                  </div>
                  <button
                    onClick={() => removeDish(dish.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove Dish
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Save Restaurant and Dishes */}
        <Button
          onClick={saveRestaurant}
          className="w-full rounded-lg bg-green-500 py-2 text-white"
        >
          Save Restaurant and Dishes
        </Button>
      </div>
    </div>
  );
}
