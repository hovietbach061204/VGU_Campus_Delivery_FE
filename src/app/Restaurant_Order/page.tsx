'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { createOrder } from '@/app/api/order';
import { useRouter } from 'next/navigation';
import { ensureAuthenticated } from '@/lib/auth';

const categories = [
  {
    name: 'ABO',
    items: [
      { name: 'BANH MI', price: 20000, description: 'Banh mi thit nguoi' },
      { name: 'BUN CA', price: 30000, description: 'Bun ca Quy Nhon' },
    ],
  },
  {
    name: 'Milk Tea',
    items: [
      { name: 'TRA SUA', price: 25000, description: 'Tra sua tran chau' },
    ],
  },
  {
    name: 'Snack',
    items: [
      { name: 'Spring Roll', price: 60000, description: 'Deep fried rolls' },
      { name: 'Fried Tofu', price: 50000, description: 'Crispy tofu bites' },
    ],
  },
  {
    name: 'Fried rice',
    items: [
      {
        name: 'Seafood Fried Rice',
        price: 110000,
        description: 'Rice with seafood',
      },
      {
        name: 'Vegetable Fried Rice',
        price: 95000,
        description: 'Rice with vegetables',
      },
    ],
  },
];

interface OrderItem {
  name: string;
  qty: number;
  price: number;
  portion: string;
  customization: string;
  category: string;
  description: string;
}

export default function Page() {
  const [order, setOrder] = useState<OrderItem[]>([]);
  const currentCategory = order.length > 0 ? order[0].category : null;
  const router = useRouter();
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

  const decrementQty = (index: number) => {
    setOrder((prev) => {
      const item = prev[index];
      if (item.qty > 1) {
        return prev.map((i, idx) =>
          idx === index ? { ...i, qty: i.qty - 1 } : i
        );
      } else {
        return prev.filter((_, i) => i !== index);
      }
    });
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
      console.log(err);
      router.push('/SignIn');
      return;
    }

    try {
      const foodItems = order.map((item) => ({
        name: item.name.toLowerCase().replace(/\s/g, '-'),
        quantity: item.qty,
      }));

      const response = await createOrder(token, {
        purchaserId: userId,
        eateryName: order[0].category,
        foodItems,
      });

      const responseData = await response.json(); // parse the response body
      const orderId = responseData.result?.orderId;

      if (!orderId) {
        throw new Error('Order ID not returned from server');
      }

      alert('Order placed successfully!');
      setOrder([]);
      router.push(`/OrderStatus?orderId=${orderId}`); // ✅ Pass orderId to status page
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
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
          {categories.map((cat) => (
            <div
              key={cat.name}
              className={clsx(
                'border rounded p-4 transition-all duration-300',
                currentCategory &&
                  currentCategory !== cat.name &&
                  'opacity-30 pointer-events-none'
              )}
            >
              <h3 className="mb-2 border-b pb-2 text-lg font-semibold text-[#ff785b]">
                {cat.name}
              </h3>
              {cat.items.map((item) => (
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
                    onClick={() => addToOrder(item, cat.name)}
                    className="flex size-7 items-center justify-center rounded-full bg-[#ff785b] text-white transition hover:bg-[#ff5b3b]"
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
                        onClick={() => decrementQty(index)}
                        className="rounded bg-gray-200 px-2 text-gray-700 hover:bg-gray-300"
                      >
                        -
                      </button>
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
