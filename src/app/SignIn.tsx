import React, { JSX } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SignIn(): JSX.Element {
  // Data for form fields
  const formFields = [
    { id: 'email', placeholder: 'Email', type: 'email' },
    { id: 'password', placeholder: 'Password', type: 'password' },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fff8f6]">
      <div className="relative flex h-[812px] w-full max-w-[375px] flex-col items-center px-6">
        {/* Title */}
        <h1 className="mb-12 mt-[129px] font-['Inter-Regular',Helvetica] text-4xl font-normal text-[#ff785b]">
          VGU Delivery
        </h1>

        {/* Form */}
        <form className="flex w-full flex-col gap-8">
          {/* Email Input */}
          <div className="relative">
            <Input
              id={formFields[0].id}
              type={formFields[0].type}
              placeholder={formFields[0].placeholder}
              className="h-[50px] rounded-[33px] border border-[#ff785b] px-7 py-3 font-['Avenir-Roman',Helvetica] text-[15px] text-[#858c82e6] placeholder:text-[#858c82e6]"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Input
              id={formFields[1].id}
              type={formFields[1].type}
              placeholder={formFields[1].placeholder}
              className="h-[50px] rounded-[33px] border px-7 py-3 font-['Avenir-Roman',Helvetica] text-[15px] text-[#858c82e6] placeholder:text-[#858c82e6]"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="mx-auto mt-12 h-[39px] w-[219px] rounded-[33px] bg-[#ff785b] font-['Avenir-Heavy',Helvetica] text-sm text-white hover:bg-[#ff785b]/90"
          >
            Eat Away!
          </Button>
        </form>

        {/* Sign Up Button */}
        <div className="absolute inset-x-0 bottom-0 w-full">
          <Button
            variant="default"
            className="h-[68px] w-full rounded-[33px_33px_0px_0px] bg-[#ff785b] font-['Avenir-Roman',Helvetica] text-xl text-white shadow-[0px_4px_4px_#ff785b] hover:bg-[#ff785b]/90"
          >
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
}
