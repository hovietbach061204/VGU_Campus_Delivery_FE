import React, { JSX } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SignIn(): JSX.Element {
  const formFields = [
    { id: 'email', placeholder: 'Email', type: 'email' },
    { id: 'password', placeholder: 'Password', type: 'password' },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fff8f6] px-4 py-8">
      <div className="relative flex w-full max-w-[375px] flex-col items-center sm:max-w-md md:max-w-lg lg:max-w-xl">
        {/* Title */}
        <h1 className="mb-12 mt-16 font-['Inter-Regular',Helvetica] text-3xl font-normal text-[#ff785b] sm:text-4xl">
          VGU Delivery
        </h1>

        {/* Form */}
        <form className="flex w-full flex-col gap-6 sm:gap-8">
          {formFields.map((field) => (
            <div key={field.id} className="relative">
              <Input
                id={field.id}
                type={field.type}
                placeholder={field.placeholder}
                className="h-12 w-full rounded-[33px] border border-[#ff785b] px-6 font-['Avenir-Roman',Helvetica] text-sm text-[#858c82e6] placeholder:text-[#858c82e6]"
              />
            </div>
          ))}

          <Button
            type="submit"
            className="mx-auto mt-10 h-[42px] w-[180px] rounded-[33px] bg-[#ff785b] font-['Avenir-Heavy',Helvetica] text-sm text-white hover:bg-[#ff785b]/90"
          >
            Eat Away!
          </Button>
        </form>

        {/* Sign Up Button */}
        <div className="absolute inset-x-0 bottom-0 w-full">
          <Link href="/Register" className="block">
            <Button
              variant="default"
              className="h-[60px] w-full rounded-t-[33px] bg-[#ff785b] font-['Avenir-Roman',Helvetica] text-lg text-white shadow-md hover:bg-[#ff785b]/90"
            >
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
