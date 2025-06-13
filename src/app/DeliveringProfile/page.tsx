import React from 'react';

const mockOrders = [
  {
    id: 1,
    customer: 'Alice',
    status: 'Accepted',
    address: '123 Main St',
    items: ['Pizza', 'Coke'],
  },
  {
    id: 2,
    customer: 'Bob',
    status: 'Delivering',
    address: '456 Oak Ave',
    items: ['Burger', 'Fries'],
  },
  {
    id: 3,
    customer: 'Charlie',
    status: 'Delivered',
    address: '789 Pine Rd',
    items: ['Banh Mi'],
  },
  {
    id: 4,
    customer: 'Diana',
    status: 'Cancelled',
    address: '321 Maple Dr',
    items: ['Spaghetti', 'Salad'],
  },
  {
    id: 5,
    customer: 'Eve',
    status: 'Accepted',
    address: '654 Elm St',
    items: ['Fried Rice'],
  },
  {
    id: 6,
    customer: 'Frank',
    status: 'Delivering',
    address: '987 Cedar Ln',
    items: ['Tofu', 'Juice'],
  },
  {
    id: 7,
    customer: 'Grace',
    status: 'Delivered',
    address: '159 Spruce Ct',
    items: ['Bun Cha'],
  },
  {
    id: 8,
    customer: 'Henry',
    status: 'Cancelled',
    address: '753 Willow Way',
    items: ['Bun Ca'],
  },
];

const statuses = ['Accepted', 'Delivering', 'Delivered', 'Cancelled'];

const DeliveringProfile = () => {
  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-3xl font-bold text-[#ff785b]">
        Delivering Profile
      </h1>
      {statuses.map((status) => {
        const orders = mockOrders.filter((order) => order.status === status);
        if (orders.length === 0) return null;
        return (
          <div key={status} className="mb-8">
            <h2 className="mb-2 text-xl font-semibold text-gray-700">
              {status} Orders
            </h2>
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex justify-between">
                    <span className="font-medium">Order #{order.id}</span>
                    <span className="text-sm text-gray-500">
                      {order.status}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    Customer: {order.customer}
                  </div>
                  <div className="text-sm text-gray-600">
                    Address: {order.address}
                  </div>
                  <div className="text-sm text-gray-600">
                    Items: {order.items.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DeliveringProfile;
