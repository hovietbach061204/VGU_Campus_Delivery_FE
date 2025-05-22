'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { ensureAuthenticated } from '@/lib/auth';
import { getUserProfile, updateUserProfile } from '../api/user';

export default function AdminProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    password: '',
    dob: '',
  });

  const router = useRouter();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { token, userId } = ensureAuthenticated();
        const profile = await getUserProfile(userId, token);

        setFormData({
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          password: '', // never prefill passwords
          dob: profile.dob || '',
        });
      } catch (err: any) {
        console.error('Failed to load admin profile:', err);
        alert(err.message);
      }
    };

    loadProfile();
  }, []);

  const toggleEdit = async () => {
    if (isEditing) {
      try {
        const { token, userId } = ensureAuthenticated();
        await updateUserProfile(userId, token, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          password: formData.password,
          dob: formData.dob,
        });

        alert('Admin profile updated successfully!');
      } catch (err: any) {
        console.error('Failed to update admin profile:', err);
        alert(err.message);
        return;
      }
    }

    setIsEditing((prev) => !prev);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleViewOrders = () => router.push('/OrderStatus');
  const handleEditMenu = () => router.push('/MenuEditing');

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

        <form className="flex flex-col gap-6">
          {[
            { id: 'firstName', label: 'First Name', type: 'text' },
            { id: 'lastName', label: 'Last Name', type: 'text' },
            { id: 'password', label: 'Password', type: 'password' },
            { id: 'dob', label: 'Date of Birth', type: 'date' },
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

        <div className="mt-6 text-center">
          <Button
            onClick={handleEditMenu}
            className="w-full rounded-[33px] bg-[#ff785b] px-6 py-2 text-white hover:bg-[#ff5b3b]"
          >
            Edit Menu
          </Button>
        </div>

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
