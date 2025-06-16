'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { HomeIcon } from 'lucide-react'; // Importing the Home Icon

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    phone: '+123456789',
    address: '123 Main St',
    password: '',
    confirmPassword: '',
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const router = useRouter();

  const toggleEdit = () => {
    if (isEditing) {
      // Check if passwords match
      if (formData.password !== formData.confirmPassword) {
        setPasswordError('Passwords do not match.');
        return;
      } else {
        setPasswordError('');
        console.log('Saved:', formData); // Handle save logic here (e.g., API call)
      }
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleViewOrder = () => {
    router.push('/OrderStatus');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fff8f6] px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg sm:p-8">
        {/* Header with Home Icon and Profile Label */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Home Icon to redirect to the home page */}
            <Link href="/">
              <HomeIcon className="size-6 cursor-pointer text-[#ff785b]" />
            </Link>
            <h2 className="text-3xl font-bold text-[#ff785b] [font-family:'Red_Rose-Bold',Helvetica]">
              Profile
            </h2>
          </div>

          <Button
            variant="outline"
            className="rounded-[20px] border-[#ff785b] text-[#ff785b] hover:bg-[#ff785b]/10"
            onClick={toggleEdit}
          >
            {isEditing ? 'Save Changes' : 'Edit'}
          </Button>
        </div>

        {/* User Profile details and Editable Fields merged */}
        <form className="flex flex-col gap-6">
          {/* First Name and Last Name Fields */}
          <div className="flex gap-4">
            <div className="w-1/2">
              <label
                htmlFor="firstName"
                className="mb-2 block text-sm font-semibold text-[#204944]"
              >
                First Name
              </label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                readOnly={!isEditing}
                className={`h-[45px] w-full rounded-[30px] border px-5 text-sm 
                  ${isEditing ? 'border-[#ff785b]' : 'border-gray-300 bg-gray-100'} 
                  text-[#444] placeholder:text-[#aaa] focus:ring-2 focus:ring-[#ff785b]/50`}
              />
            </div>
            <div className="w-1/2">
              <label
                htmlFor="lastName"
                className="mb-2 block text-sm font-semibold text-[#204944]"
              >
                Last Name
              </label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                readOnly={!isEditing}
                className={`h-[45px] w-full rounded-[30px] border px-5 text-sm 
                  ${isEditing ? 'border-[#ff785b]' : 'border-gray-300 bg-gray-100'} 
                  text-[#444] placeholder:text-[#aaa] focus:ring-2 focus:ring-[#ff785b]/50`}
              />
            </div>
          </div>

          {/* Phone Number Field */}
          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-semibold text-[#204944]"
            >
              Phone Number
            </label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`h-[45px] w-full rounded-[30px] border px-5 text-sm 
                  ${isEditing ? 'border-[#ff785b]' : 'border-gray-300 bg-gray-100'} 
                  text-[#444] placeholder:text-[#aaa] focus:ring-2 focus:ring-[#ff785b]/50`}
            />
          </div>

          {/* Password Fields */}
          {isEditing && (
            <>
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-[#204944]"
                >
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="h-[45px] w-full rounded-[30px] border px-5 text-sm
                    ${isEditing ? 'border-[#ff785b]' : 'border-gray-300 bg-gray-100'}
                    text-[#444] placeholder:text-[#aaa] focus:ring-2 focus:ring-[#ff785b]/50"
                />
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-[#204944]"
                >
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="h-[45px] w-full rounded-[30px] border px-5 text-sm
                    ${isEditing ? 'border-[#ff785b]' : 'border-gray-300 bg-gray-100'}
                    text-[#444] placeholder:text-[#aaa] focus:ring-2 focus:ring-[#ff785b]/50"
                />
              </div>

              {/* Password Error Message */}
              {passwordError && (
                <p className="text-sm text-red-500">{passwordError}</p>
              )}
            </>
          )}
        </form>
      </div>
    </div>
  );
}
