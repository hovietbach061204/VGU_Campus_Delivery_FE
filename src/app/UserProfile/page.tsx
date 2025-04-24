'use client';
import React, { JSX, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

export default function UserProfile(): JSX.Element {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const router = useRouter();

  const toggleEdit = () => {
    if (isEditing) {
      // Handle save logic here (e.g. API call)
      console.log('Saved:', formData);
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleViewOrder = () => {
    router.push('/OrderList');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fff8f6] px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-[#ff785b] [font-family:'Red_Rose-Bold',Helvetica]">
            Profile
          </h2>
          <Button
            variant="outline"
            className="rounded-[20px] border-[#ff785b] text-[#ff785b] hover:bg-[#ff785b]/10"
            onClick={toggleEdit}
          >
            {isEditing ? 'Save Changes' : 'Edit'}
          </Button>
        </div>

        <form className="flex flex-col gap-5">
          {[
            {
              id: 'name',
              label: 'Full Name',
              type: 'text',
              placeholder: 'John Doe',
            },
            {
              id: 'email',
              label: 'Email',
              type: 'email',
              placeholder: 'john@example.com',
            },
            {
              id: 'phone',
              label: 'Phone Number',
              type: 'tel',
              placeholder: '+1 234 567 890',
            },
            {
              id: 'address',
              label: 'Delivery Address',
              type: 'text',
              placeholder: '123 Main St, City',
            },
          ].map((field) => (
            <div key={field.id}>
              <label
                htmlFor={field.id}
                className="mb-2 block text-sm font-semibold text-[#204944]"
              >
                {field.label}
              </label>
              <Input
                id={field.id}
                type={field.type}
                value={formData[field.id as keyof typeof formData]}
                placeholder={field.placeholder}
                readOnly={!isEditing}
                onChange={handleChange}
                className={`h-[45px] w-full rounded-[30px] border px-5 text-sm ${
                  isEditing ? 'border-[#ff785b]' : 'border-gray-300 bg-gray-100'
                } text-[#444] placeholder:text-[#aaa] focus:ring-2 focus:ring-[#ff785b]/50`}
              />
            </div>
          ))}
        </form>

        <div className="mt-6 text-center">
          <Button
            onClick={handleViewOrder}
            className="rounded-full bg-[#ff785b] px-6 py-2 text-white hover:bg-[#ff5b3b]"
          >
            View Current Order
          </Button>
        </div>
      </div>
    </div>
  );
}
