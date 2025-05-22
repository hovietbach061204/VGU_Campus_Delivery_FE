'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { deleteDishFromEatery, deleteEatery } from '../api/eatery';
import { ensureAuthenticated } from '@/lib/auth';
import { addFoodItemToEatery } from '../api/eatery';
import { loadFormattedEateries } from '@/lib/utils';

export default function MenuEditing() {
  const [menu, setMenu] = useState<Restaurant[]>([]);
  const [newDish, setNewDish] = useState({
    name: '',
    price: 0,
    description: '',
    restaurantId: 0,
  });

  const router = useRouter();

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

  // Navigate to AddRestaurant page
  const handleAddRestaurant = () => {
    router.push('/AddRestaurant');
  };

  const addDish = async () => {
    if (
      newDish.name &&
      newDish.price &&
      newDish.description &&
      newDish.restaurantId
    ) {
      const targetRestaurant = menu.find((r) => r.id === newDish.restaurantId);
      if (!targetRestaurant) {
        alert('Invalid restaurant selected.');
        return;
      }

      try {
        const auth = ensureAuthenticated();
        const token = auth.token;

        // Call backend to add the dish
        await addFoodItemToEatery(token, targetRestaurant.name, {
          name: newDish.name,
          price: newDish.price,
          description: newDish.description,
        });

        // Update local state for UI consistency
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
        alert('Dish successfully added!');
      } catch (err: any) {
        console.error('Failed to add dish:', err);
        alert(err.message);
      }
    }
  };

  // Remove a dish from a restaurant
  const removeDish = async (restaurantId: number, dishId: number) => {
    const restaurant = menu.find((r) => r.id === restaurantId);
    if (!restaurant) return;

    const dish = restaurant.dishes.find((d) => d.id === dishId);
    if (!dish) return;

    const confirmDelete = confirm(
      `Are you sure you want to delete ${dish.name} from ${restaurant.name}?`
    );
    if (!confirmDelete) return;

    try {
      const auth = ensureAuthenticated();
      const token = auth.token;

      // Backend call
      await deleteDishFromEatery(token, restaurant.name, dish.name);

      // Update state using name (not id)
      const updatedMenu = menu.map((r) =>
        r.id === restaurantId
          ? {
              ...r,
              dishes: r.dishes.filter((d) => d.name !== dish.name),
            }
          : r
      );

      setMenu(updatedMenu);
      localStorage.setItem('menu', JSON.stringify(updatedMenu));

      alert(`${dish.name} removed successfully.`);
    } catch (err: any) {
      console.error('Failed to delete dish:', err);
      alert(err.message);
    }
  };

  // Remove a restaurant from the menu
  const removeRestaurant = async (restaurantId: number) => {
    const restaurant = menu.find((r) => r.id === restaurantId);
    if (!restaurant) return;

    const confirmDelete = confirm(
      `Are you sure you want to delete ${restaurant.name}?`
    );
    if (!confirmDelete) return;

    try {
      const auth = ensureAuthenticated();
      const token = auth.token;

      // Call backend API to delete the eatery by name
      await deleteEatery(token, restaurant.name);

      // Update UI locally
      const updatedMenu = menu.filter((r) => r.id !== restaurantId);
      setMenu(updatedMenu);
      alert(`${restaurant.name} deleted successfully!`);
    } catch (err: any) {
      console.error('Failed to delete restaurant:', err);
      alert(err.message);
    }
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
                    key={`${restaurant.id}-${dish.name}`}
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
