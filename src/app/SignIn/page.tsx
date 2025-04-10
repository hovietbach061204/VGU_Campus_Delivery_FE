'use client';

import React from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SignIn() {
  const formFields = [
    { id: 'email', type: 'email', placeholder: 'Email' },
    { id: 'password', type: 'password', placeholder: 'Password' },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#ffe5dc] to-[#fff8f6] px-4 py-12">
      <div className="w-full max-w-sm space-y-8 sm:max-w-md">
        {/* Logo / Title */}
        <h1 className="text-center text-3xl font-semibold text-[#ff785b] sm:text-4xl">
          VGU Delivery
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
            Eat Away!
          </Button>
        </form>

        {/* Social login text */}
        <div className="text-center text-sm text-[#777]">or sign in with</div>

        {/* Social Icons - Placeholder */}
        <div className="flex justify-center gap-4">
          <div className="flex size-9 items-center justify-center rounded-full bg-white text-[#3b5998] shadow-md">
            {/* Facebook Icon Placeholder */}F
          </div>
          <div className="flex size-9 items-center justify-center rounded-full bg-white text-[#dd4b39] shadow-md">
            {/* Google Icon Placeholder */}G
          </div>
        </div>

        {/* Sign Up Link */}
        <Link href="/Register" className="block">
          <Button
            variant="default"
            className="h-[55px] w-full rounded-[33px] bg-[#ff785b] text-lg font-medium text-white shadow hover:bg-[#e96c4e]"
          >
            Sign Up
          </Button>
        </Link>
      </div>
    </div>
  );
}
