'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

const mockMenu = [
  {
    id: 1,
    name: 'Abo',
    dishes: [
      {
        id: 1,
        name: 'BANH MI',
        price: 20000,
        description: 'Vietnamese sandwich',
      },
      { id: 2, name: 'BUN CA', price: 30000, description: 'Bun ca Quy Nhon' },
    ],
  },
  {
    id: 2,
    name: 'Milk Tea',
    dishes: [
      {
        id: 1,
        name: 'TRA SUA',
        price: 25000,
        description: 'Tra sua tran chau',
      },
    ],
  },
];

export default function MenuEditing() {
  const [menu, setMenu] = useState(mockMenu);
  const [newRestaurant, setNewRestaurant] = useState('');
  const [newDish, setNewDish] = useState({
    name: '',
    price: 0,
    description: '',
    restaurantId: 0,
  });

  // Add a new restaurant
  const addRestaurant = () => {
    if (newRestaurant) {
      const newRestaurantObj = {
        id: menu.length + 1,
        name: newRestaurant,
        dishes: [],
      };
      setMenu((prev) => [...prev, newRestaurantObj]);
      setNewRestaurant('');
    }
  };

  // Add a new dish to a specific restaurant
  const addDish = () => {
    if (newDish.name && newDish.price && newDish.restaurantId) {
      setMenu((prev) =>
        prev.map((restaurant) => {
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

  // Remove a dish
  const removeDish = (restaurantId: number, dishId: number) => {
    setMenu((prev) =>
      prev.map((restaurant) =>
        restaurant.id === restaurantId
          ? {
              ...restaurant,
              dishes: restaurant.dishes.filter((dish) => dish.id !== dishId),
            }
          : restaurant
      )
    );
  };

  // Remove a restaurant
  const removeRestaurant = (restaurantId: number) => {
    setMenu((prev) =>
      prev.filter((restaurant) => restaurant.id !== restaurantId)
    );
  };

  // Save changes to localStorage and update Restaurant_Order
  const saveChanges = () => {
    localStorage.setItem('menu', JSON.stringify(menu)); // Save menu in localStorage
    alert('Menu saved!');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8f9fa] p-8">
      <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-lg">
        <h1 className="text-2xl font-semibold text-[#ff785b]">Manage Menu</h1>

        {/* Add New Restaurant */}
        <div className="my-4">
          <input
            type="text"
            value={newRestaurant}
            onChange={(e) => setNewRestaurant(e.target.value)}
            placeholder="Restaurant Name"
            className="mb-2 w-full rounded border border-gray-300 p-2"
          />
          <Button
            onClick={addRestaurant}
            className="w-full rounded-lg bg-[#ff785b] py-2 text-white"
          >
            Add Restaurant
          </Button>
        </div>

        {/* Add New Dish */}
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
            <div key={restaurant.id} className="mb-4">
              <h2 className="text-xl font-semibold text-[#ff785b]">
                {restaurant.name}
              </h2>
              <button
                onClick={() => removeRestaurant(restaurant.id)}
                className="text-red-600 hover:text-red-800"
              >
                Remove Restaurant
              </button>
              <ul className="space-y-2">
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
