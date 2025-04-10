'use client';

import React from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SignUp() {
  const formFields = [
    { id: 'name', type: 'text', placeholder: 'Name' },
    { id: 'email', type: 'email', placeholder: 'Email' },
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
        {/* Title */}
        <h1 className="text-center text-3xl font-semibold text-[#ff785b] sm:text-4xl">
          Sign Up
        </h1>

        {/* Form */}
        <form className="flex flex-col gap-6">
          {formFields.map((field) => (
            <div key={field.id}>
              <Input
                id={field.id}
                type={field.type}
                placeholder={field.placeholder}
                className="h-12 w-full rounded-[33px] border border-[#ff785b] bg-white px-6 text-sm text-[#333] shadow-sm placeholder:text-[#aaa] focus:ring-2 focus:ring-[#ff785b]/50"
              />
            </div>
          ))}

          <Button
            type="submit"
            className="h-[45px] w-full rounded-[33px] bg-[#ff785b] font-semibold text-white transition hover:bg-[#e96c4e]"
          >
            Never Hungry Again!
          </Button>
        </form>

        {/* Social login text */}
        <div className="text-center text-sm text-[#777]">or Sign Up with</div>

        {/* Social Icons - Placeholder */}
        <div className="flex justify-center gap-4">
          <div className="flex size-9 items-center justify-center rounded-full bg-white text-[#3b5998] shadow-md">
            {/* Facebook */} F
          </div>
          <div className="flex size-9 items-center justify-center rounded-full bg-white text-[#dd4b39] shadow-md">
            {/* Email / Google */} @
          </div>
        </div>

        {/* Go back to Sign In */}
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
