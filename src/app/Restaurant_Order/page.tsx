'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const RestaurantOrderPage = () => {
  const [menu, setMenu] = useState<any[]>([]); // Menu state to store restaurants and dishes
  const [order, setOrder] = useState<any[]>([]); // Order state
  const [showPortionModal, setShowPortionModal] = useState(false); // Modal visibility
  const [showNotesModal, setShowNotesModal] = useState(false); // Notes modal visibility
  const [selectedPortion, setSelectedPortion] = useState('Medium');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [customization, setCustomization] = useState(''); // Customization text
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null); // Store selected restaurant
  const router = useRouter(); // Router for navigation

  const portionOptions = ['Small', 'Medium', 'Large'];

  // Fetch updated menu from localStorage on every page load
  useEffect(() => {
    const savedMenu = localStorage.getItem('menu');
    if (savedMenu) {
      setMenu(JSON.parse(savedMenu)); // Load updated menu from localStorage
    }
  }, []);

  const handlePortionChange = (size: string) => {
    setSelectedPortion(size);
  };

  const addToOrder = (item: any, category: string) => {
    if (!selectedRestaurant) {
      setSelectedRestaurant(category); // Set the restaurant when the first item is selected
    }
    setSelectedItem(item);
    setShowPortionModal(true); // Show portion size modal
  };

  const confirmAddToOrder = () => {
    if (!selectedItem) return;

    setOrder((prev) => {
      const existing = prev.find(
        (i) =>
          i.name === selectedItem.name &&
          i.portion === selectedPortion &&
          i.customization === customization // Include customization check
      );
      if (existing) {
        return prev.map((i) =>
          i === existing
            ? { ...i, qty: i.qty + 1, customization } // Update customization
            : i
        );
      } else {
        return [
          ...prev,
          {
            name: selectedItem.name,
            qty: 1,
            price: selectedItem.price,
            portion: selectedPortion,
            category: selectedItem.category,
            description: selectedItem.description,
            customization: customization, // Store customization for this dish
          },
        ];
      }
    });

    setShowPortionModal(false); // Close modal after confirming
  };

  const removeItem = (index: number) => {
    setOrder((prev) => prev.filter((_, i) => i !== index));

    // If no items are left in the order, allow user to choose from another restaurant
    if (order.length === 1) {
      setSelectedRestaurant(null); // Allow switching restaurants when order is empty
    }
  };

  const getTotal = () => {
    return order.reduce((sum, item) => sum + item.price * item.qty, 0);
  };

  const handlePlaceOrder = () => {
    if (order.length === 0) return;

    const orderData = {
      order_id: `ORDER_${Date.now()}`,
      purchaser_id: 'HARDCODED_USER_ID',
      delivery_man_id: '',
      status: 'PENDING',
      total_price: getTotal(),
      created_at: new Date(),
      items: order,
    };

    console.log('🧾 Order placed (mock):', orderData);
    router.push('/OrderStatus');
  };

  // Handle the "Add Notes" functionality
  const handleAddNotes = () => {
    setShowNotesModal(true); // Show the notes modal after confirming portion size
  };

  const confirmNotes = () => {
    setShowNotesModal(false); // Close the notes modal
    confirmAddToOrder(); // Proceed to add item to order
  };

  return (
    <main className="min-h-screen bg-white p-4 text-gray-800">
      <header className="rounded bg-[#ff785b] p-4 text-xl font-bold text-white shadow">
        Choose Your Food
      </header>
      <p className="mt-2 text-center text-sm font-medium text-red-500">
        Note: You can only order from one restaurant at a time.
      </p>

      <div className="mt-4 flex flex-col gap-4 md:flex-row">
        <section className="flex-1 space-y-6">
          {menu.map((restaurant) => (
            <div
              key={restaurant.id}
              className={`rounded border p-4 ${selectedRestaurant && selectedRestaurant !== restaurant.name ? 'pointer-events-none opacity-50' : ''}`}
            >
              <h3 className="mb-2 border-b pb-2 text-lg font-semibold text-[#ff785b]">
                {restaurant.name}
              </h3>
              {restaurant.dishes.map((item: any) => (
                <div
                  key={item.id}
                  className="mb-2 flex items-center justify-between"
                >
                  <span className="text-sm">
                    {item.name}{' '}
                    <span className="text-gray-500">
                      ({item.price.toLocaleString()}đ)
                    </span>
                  </span>
                  <button
                    onClick={() => addToOrder(item, restaurant.name)}
                    className="flex items-center justify-center rounded-full bg-[#ff785b] text-white transition hover:bg-[#ff5b3b]"
                  >
                    +
                  </button>
                </div>
              ))}
            </div>
          ))}
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
                        x
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="mt-2 text-right text-lg font-semibold">
                Total: {getTotal().toLocaleString()}đ
              </div>
              <button
                onClick={handlePlaceOrder}
                className="mt-4 w-full rounded bg-[#ff785b] py-2 font-semibold text-white hover:bg-[#ff5b3b]"
              >
                Place Order
              </button>
            </div>
          )}
        </aside>
      </div>

      {/* Portion Size Modal */}
      {showPortionModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-lg">
            <h3 className="mb-4 text-xl font-semibold text-[#ff785b]">
              Choose Portion Size
            </h3>
            {portionOptions.map((size) => (
              <div key={size} className="mb-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="portion"
                    value={size}
                    checked={selectedPortion === size}
                    onChange={() => handlePortionChange(size)}
                    className="mr-2"
                  />
                  {size}
                </label>
              </div>
            ))}
            <div className="mt-4 text-right">
              <Button
                onClick={handleAddNotes}
                className="rounded-lg bg-[#ff785b] px-6 py-2 text-white"
              >
                Add Notes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Notes Modal */}
      {showNotesModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-lg">
            <h3 className="mb-4 text-xl font-semibold text-[#ff785b]">
              Add Notes
            </h3>
            <textarea
              rows={4}
              className="w-full rounded-lg border border-[#ff785b] p-2"
              placeholder="Any additional notes for the order?"
              value={customization}
              onChange={(e) => setCustomization(e.target.value)}
            />
            <div className="mt-4 text-right">
              <Button
                onClick={confirmNotes}
                className="rounded-lg bg-[#ff785b] px-6 py-2 text-white"
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default RestaurantOrderPage;
