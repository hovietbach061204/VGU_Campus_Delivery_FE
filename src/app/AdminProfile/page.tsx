'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

export default function AdminProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'admin@example.com',
    phone: '+123456789',
    address: '123 Admin St',
  });

  const router = useRouter();

  const toggleEdit = () => {
    if (isEditing) {
      console.log('Saved:', formData); // Handle save logic here (e.g., API call)
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleViewOrders = () => {
    router.push('/OrderStatus');
  };

  const handleEditMenu = () => {
    router.push('/MenuEditing'); // Navigate to the restaurant menu editing page
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fff8f6] px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-[#ff785b] [font-family:'Red_Rose-Bold',Helvetica]">
            Admin Profile
          </h2>
          <Button
            variant="outline"
            className="rounded-[20px] border-[#ff785b] text-[#ff785b] hover:bg-[#ff785b]/10"
            onClick={toggleEdit}
          >
            {isEditing ? 'Save Changes' : 'Edit'}
          </Button>
        </div>

        {/* Admin Profile details and Editable Fields merged */}
        <form className="flex flex-col gap-6">
          {[
            { id: 'name', label: 'Full Name', type: 'text' },
            { id: 'email', label: 'Email', type: 'email' },
            { id: 'phone', label: 'Phone Number', type: 'tel' },
            { id: 'address', label: 'Delivery Address', type: 'text' },
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
                onChange={handleChange}
                readOnly={!isEditing}
                className={`h-[45px] w-full rounded-[30px] border px-5 text-sm 
                  ${isEditing ? 'border-[#ff785b]' : 'border-gray-300 bg-gray-100'} 
                  text-[#444] placeholder:text-[#aaa] focus:ring-2 focus:ring-[#ff785b]/50`}
              />
            </div>
          ))}
        </form>

        {/* Admin-specific Button: Edit Menu */}
        <div className="mt-6 text-center">
          <Button
            onClick={handleEditMenu}
            className="w-full rounded-[33px] bg-[#ff785b] px-6 py-2 text-white hover:bg-[#ff5b3b]"
          >
            Edit Menu
          </Button>
        </div>

        {/* View Order Button */}
        <div className="mt-6 text-center">
          <Button
            onClick={handleViewOrders}
            className="rounded-full bg-[#ff785b] px-6 py-2 text-white hover:bg-[#ff5b3b]"
          >
            View Current Orders
          </Button>
        </div>
      </div>
    </div>
  );
}
