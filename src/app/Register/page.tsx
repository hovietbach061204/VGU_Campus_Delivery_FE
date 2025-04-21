'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { registerUser } from '@/app/api/auth';

type SignUpFormFields = {
  username: string;
  firstname: string;
  lastname: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
};

export default function SignUp() {
  const router = useRouter();

  const [formData, setFormData] = useState<SignUpFormFields>({
    username: '',
    firstname: '',
    lastname: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const {
      username,
      firstname,
      lastname,
      password,
      confirmPassword,
      dateOfBirth,
    } = formData;

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      await registerUser(username, firstname, lastname, password, dateOfBirth);
      router.push('/SignIn');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  const formFields = [
    { id: 'username', type: 'text', placeholder: 'Username' },
    { id: 'firstname', type: 'text', placeholder: 'First Name' },
    { id: 'lastname', type: 'text', placeholder: 'Last Name' },
    { id: 'dateOfBirth', type: 'text', placeholder: 'Date Of Birth' },
    { id: 'password', type: 'password', placeholder: 'Password' },
    {
      id: 'confirmPassword',
      type: 'password',
      placeholder: 'Confirm Password',
    },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#ffe5dc] to-[#fff8f6] px-4 py-12">
      <div className="w-full max-w-sm space-y-8 sm:max-w-md">
        <h1 className="text-center text-3xl font-semibold text-[#ff785b] sm:text-4xl">
          Sign Up
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {formFields.map((field) => (
            <Input
              key={field.id}
              id={field.id}
              type={field.type}
              placeholder={field.placeholder}
              value={formData[field.id as keyof SignUpFormFields] ?? ''}
              onChange={handleChange}
              className="h-12 w-full rounded-[33px] border border-[#ff785b] bg-white px-6 text-sm text-[#333] shadow-sm placeholder:text-[#aaa] focus:ring-2 focus:ring-[#ff785b]/50"
            />
          ))}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="h-[45px] w-full rounded-[33px] bg-[#ff785b] font-semibold text-white transition hover:bg-[#e96c4e]"
          >
            {loading ? 'Signing Up...' : 'Never Hungry Again!'}
          </Button>
        </form>

        <div className="text-center text-sm text-[#777]">or Sign Up with</div>

        <div className="flex justify-center gap-4">
          <div className="flex size-9 items-center justify-center rounded-full bg-white text-[#3b5998] shadow-md">
            F
          </div>
          <div className="flex size-9 items-center justify-center rounded-full bg-white text-[#dd4b39] shadow-md">
            @
          </div>
        </div>

        <Link
          href="/SignIn"
          className="block text-center text-sm text-[#ff785b] hover:underline"
        >
          Already have an account? Sign In
        </Link>
      </div>
    </div>
  );
}
