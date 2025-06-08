'use client';

import { useEffect, useState } from 'react';
import { createOrder } from '../api/order';
import { useRouter } from 'next/navigation';
import { ensureAuthenticated } from '@/lib/auth';
import { loadFormattedEateries } from '@/lib/utils';

// const categories = [
//   {
//     name: 'ABO',
//     items: [
//       { name: 'TRA SUA', price: 25000, description: 'Tra sua tran chau' },
//       { name: 'PHO', price: 30000, description: 'Pho bo Ha Noi' },
//       {
//         name: 'SINH TO',
//         price: 20000,
//         description: 'Smoothie with mixed fruits',
//       },
//       { name: 'BANH MI', price: 20000, description: 'Banh mi thit nguoi' },
//       { name: 'BUN CA', price: 30000, description: 'Bun ca Quy Nhon' },
//       {
//         name: 'BUN CHA',
//         price: 35000,
//         description: 'Grilled pork with noodles',
//       },
//     ],
//   },
//   {
//     name: 'CO NGOC',
//     items: [
//       {
//         name: 'SINH TO',
//         price: 20000,
//         description: 'Smoothie with mixed fruits',
//       },
//       { name: 'TRA SUA', price: 25000, description: 'Tra sua tran chau' },
//       {
//         name: 'RAU MA SUA DUA',
//         price: 18000,
//         description: 'Pennywort with coconut milk',
//       },
//     ],
//   },
//   {
//     name: 'LAM PHAT',
//     items: [
//       { name: 'XOI', price: 15000, description: 'Sticky rice' },
//       { name: 'COM GA', price: 35000, description: 'Chicken rice' },
//       { name: 'HU TIEU', price: 30000, description: 'Southern noodle soup' },
//       { name: 'PHO', price: 30000, description: 'Pho bo Ha Noi' },
//       { name: 'BANH CUON', price: 25000, description: 'Steamed rice rolls' },
//       {
//         name: 'BUN CHA',
//         price: 35000,
//         description: 'Grilled pork with noodles',
//       },
//     ],
//   },
//   {
//     name: 'MAI GIANG',
//     items: [
//       {
//         name: 'SINH TO',
//         price: 20000,
//         description: 'Smoothie with mixed fruits',
//       },
//       { name: 'TRA SUA', price: 25000, description: 'Tra sua tran chau' },
//       { name: 'XOI', price: 15000, description: 'Sticky rice' },
//       { name: 'HU TIEU', price: 30000, description: 'Southern noodle soup' },
//       {
//         name: 'CAFE SUA',
//         price: 20000,
//         description: 'Vietnamese iced coffee with milk',
//       },
//     ],
//   },
// ];

interface OrderItem {
  name: string;
  qty: number;
  price: number;
  portion: string;
  customization: string;
  category: string;
  description: string;
}

export default function RestaurantOrderPage() {
  const [order, setOrder] = useState<OrderItem[]>([]);
  const currentCategory = order.length > 0 ? order[0].category : null;
  const router = useRouter();
  const [menu, setMenu] = useState<Restaurant[]>([]);

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
    category: string
  ) => {
    if (currentCategory && currentCategory !== category) return;

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

  const handlePlaceOrder = async () => {
    if (order.length === 0) return;

    let token: string;
    let userId: string;

    try {
      const auth = ensureAuthenticated();
      token = auth.token;
      userId = auth.userId;
    } catch (err) {
      alert('You must be logged in to place an order');
      console.error(err);
      router.push('/SignIn');
      return;
    }

    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const purchaserLon = position.coords.longitude;
        const purchaserLat = position.coords.latitude;
        try {
          const foodItems = order.map((item) => ({
            name: item.name,
            quantity: item.qty,
          }));

          await createOrder(token, {
            purchaserId: userId,
            purchaserLon,
            purchaserLat,
            eateryName: order[0].category,
            foodItems,
          });

          setOrder([]);
          router.push(`/OrderStatus`);
        } catch (err: any) {
          alert(`Error: ${err.message}`);
        }
      },
      () => {
        alert(
          'Unable to retrieve your location. Please allow location access and try again.'
        );
      }
    );
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
            <div key={restaurant.name} className="rounded border p-4">
              <h3 className="mb-2 border-b pb-2 text-lg font-semibold text-[#ff785b]">
                {restaurant.name}
              </h3>
              {restaurant.dishes.map((item) => (
                <div
                  key={item.name}
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
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ff785b] text-white hover:bg-[#ff5b3b]"
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
}
