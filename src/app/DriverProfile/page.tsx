'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function DriverProfile() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: 'Jane Driver',
    email: 'jane@deliver.io',
    phone: '+1 987 654 321',
    licensePlate: '29A-123.45',
    deliveryZone: 'District 5, Saigon',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStartDelivering = () => {
    router.push('/Driver');
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fff8f5] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#ff785b]">Driver Profile</h1>
          <Button
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
            className="rounded-full border-[#ff785b] text-[#ff785b] hover:bg-[#ff785b]/10"
          >
            {isEditing ? 'Save' : 'Edit'}
          </Button>
        </div>

        <div className="space-y-5">
          <div>
            <label
              htmlFor="fullName"
              className="text-sm font-semibold text-gray-700"
            >
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`mt-1 w-full rounded-full px-4 py-2 text-sm ${isEditing ? 'border border-gray-300 bg-white text-black' : 'bg-gray-100 text-gray-600'}`}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="text-sm font-semibold text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`mt-1 w-full rounded-full px-4 py-2 text-sm ${isEditing ? 'border border-gray-300 bg-white text-black' : 'bg-gray-100 text-gray-600'}`}
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="text-sm font-semibold text-gray-700"
            >
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`mt-1 w-full rounded-full px-4 py-2 text-sm ${isEditing ? 'border border-gray-300 bg-white text-black' : 'bg-gray-100 text-gray-600'}`}
            />
          </div>

          <div>
            <label
              htmlFor="licensePlate"
              className="text-sm font-semibold text-gray-700"
            >
              License Plate
            </label>
            <input
              id="licensePlate"
              name="licensePlate"
              type="text"
              value={formData.licensePlate}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`mt-1 w-full rounded-full px-4 py-2 text-sm ${isEditing ? 'border border-gray-300 bg-white text-black' : 'bg-gray-100 text-gray-600'}`}
            />
          </div>

          <div>
            <label
              htmlFor="deliveryZone"
              className="text-sm font-semibold text-gray-700"
            >
              Current Delivery Zone
            </label>
            <input
              id="deliveryZone"
              name="deliveryZone"
              type="text"
              value={formData.deliveryZone}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`mt-1 w-full rounded-full px-4 py-2 text-sm ${isEditing ? 'border border-gray-300 bg-white text-black' : 'bg-gray-100 text-gray-600'}`}
            />
          </div>

          <div className="pt-6 text-center">
            <Button
              onClick={handleStartDelivering}
              className="rounded-full bg-green-500 px-6 py-2 text-white hover:bg-green-600"
            >
              Start Delivering
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
