'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const RestaurantOrderPage = () => {
  const [menu, setMenu] = useState<any[]>([]);
  const [order, setOrder] = useState<any[]>([]);
  const router = useRouter(); // Define the router to handle navigation

  useEffect(() => {
    // Load menu from localStorage
    const savedMenu = localStorage.getItem('menu');
    if (savedMenu) {
      setMenu(JSON.parse(savedMenu)); // Update menu state from localStorage
    }
  }, []);

  const addToOrder = (item: any, category: string) => {
    const portion =
      prompt(
        `Choose portion size for ${item.name} (e.g., Small, Medium, Large):`,
        'Medium'
      ) || 'Medium';
    const customization =
      prompt(`Any customizations for ${item.name}?`, '') || '';

    setOrder((prev) => {
      const existing = prev.find(
        (i) =>
          i.name === item.name &&
          i.portion === portion &&
          i.customization === customization
      );
      if (existing) {
        return prev.map((i) => (i === existing ? { ...i, qty: i.qty + 1 } : i));
      } else {
        return [
          ...prev,
          {
            name: item.name,
            qty: 1,
            price: item.price,
            portion,
            customization,
            category,
            description: item.description,
          },
        ];
      }
    });
  };

  const removeItem = (index: number) => {
    setOrder((prev) => prev.filter((_, i) => i !== index));
  };

  const getTotal = () => {
    return order.reduce((sum, item) => sum + item.price * item.qty, 0);
  };

  const handlePlaceOrder = () => {
    if (order.length === 0) return; // Don't place order if there's nothing to order

    // Construct orderData to store the order
    const orderData = {
      order_id: `ORDER_${Date.now()}`,
      purchaser_id: 'HARDCODED_USER_ID',
      delivery_man_id: '',
      status: 'PENDING',
      total_price: getTotal(),
      created_at: new Date(),
      items: order,
    };

    // For now, log the order as a mock of placing the order
    console.log('🧾 Order placed (mock):', orderData);

    // Navigate to OrderStatus after placing the order
    router.push('/OrderStatus');
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
            <div key={restaurant.id} className="rounded border p-4">
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
    </main>
  );
};

export default RestaurantOrderPage;
