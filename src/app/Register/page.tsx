'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { registerUser } from '@/app/api/auth';
import HomeIconNavigation from '@/components/HomeIconNavigation';

type SignUpFormFields = {
  username: string;
  firstname: string;
  lastname: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
  phoneNumber: string;
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
    phoneNumber: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>({
    password: false,
    confirmPassword: false,
  });
  const [highlight, setHighlight] = useState<{ [key: string]: boolean }>({});
  const [phonePrompt, setPhonePrompt] = useState('');
  const [successPrompt, setSuccessPrompt] = useState('');

  // Check for success message in query params (for SignIn page)
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const success = params.get('success');
      if (success) {
        setSuccessPrompt(success);
        // Remove the param from URL after showing
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    // Phone number: only allow digits
    if (id === 'phoneNumber') {
      if (/\D/.test(value)) {
        setPhonePrompt('Phone number must contain digits only.');
        setHighlight((prev) => ({ ...prev, phoneNumber: true }));
        setTimeout(() => {
          setHighlight((prev) => ({ ...prev, phoneNumber: false }));
          setPhonePrompt('');
        }, 2000); // Notification stays for 2s
        return;
      }
    }
    setFormData((prev) => ({ ...prev, [id]: value }));
    setHighlight((prev) => ({ ...prev, [id]: false }));
    setError('');
  };

  // Use 'const' for never reassigned variables
  const validateFields = () => {
    const requiredFields = [
      'username',
      'firstname',
      'lastname',
      'password',
      'confirmPassword',
      'dateOfBirth',
      'phoneNumber',
    ];
    let hasError = false;
    const newHighlight: { [key: string]: boolean } = {};
    requiredFields.forEach((field) => {
      if (!(formData as any)[field].trim()) {
        newHighlight[field] = true;
        hasError = true;
      }
    });
    if (hasError) {
      setError('All fields are required.');
      setHighlight((prev) => ({ ...prev, ...newHighlight }));
      setTimeout(() => {
        const reset: { [key: string]: boolean } = { ...highlight };
        requiredFields.forEach((f) => (reset[f] = false));
        setHighlight(reset);
      }, 800);
      return false;
    }
    // Phone number digits only check
    if (/\D/.test(formData.phoneNumber)) {
      setPhonePrompt('Phone number must contain digits only.');
      setHighlight((prev) => ({ ...prev, phoneNumber: true }));
      setTimeout(() => {
        setHighlight((prev) => ({ ...prev, phoneNumber: false }));
        setPhonePrompt('');
      }, 800);
      return false;
    }
    // Password match check
    if (
      (formData.password || formData.confirmPassword) &&
      formData.password !== formData.confirmPassword
    ) {
      setError('Passwords do not match.');
      setHighlight((prev) => ({
        ...prev,
        password: true,
        confirmPassword: true,
      }));
      setFormData((prev) => ({ ...prev, password: '', confirmPassword: '' }));
      setTimeout(() => {
        setHighlight((prev) => ({
          ...prev,
          password: false,
          confirmPassword: false,
        }));
      }, 800);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setPhonePrompt('');
    setSuccessPrompt('');
    if (!validateFields()) return;
    const {
      username,
      firstname,
      lastname,
      password,
      dateOfBirth,
      phoneNumber,
    } = formData;
    try {
      setLoading(true);
      await registerUser(
        username,
        firstname,
        lastname,
        password,
        dateOfBirth,
        phoneNumber
      );
      // Redirect to SignIn with success message
      router.push('/SignIn?success=Account%20created%20successfully!');
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

  const handleTogglePassword = (field: string) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const formFields = [
    { id: 'username', type: 'text', placeholder: 'Username' },
    { id: 'firstname', type: 'text', placeholder: 'First Name' },
    { id: 'lastname', type: 'text', placeholder: 'Last Name' },
    { id: 'dateOfBirth', type: 'date', placeholder: 'Date Of Birth' },
    { id: 'phoneNumber', type: 'tel', placeholder: 'Phone Number' },
    { id: 'password', type: 'password', placeholder: 'Password' },
    {
      id: 'confirmPassword',
      type: 'password',
      placeholder: 'Confirm Password',
    },
  ];

  // Eye icon SVG (user-friendly: open = eye, closed = eye with slash)
  const EyeIcon = ({ open }: { open: boolean }) =>
    open ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-5 cursor-pointer text-gray-500 hover:text-[#ff785b]"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 12C3.5 7.5 7.5 4.5 12 4.5c4.5 0 8.5 3 9.75 7.5-1.25 4.5-5.25 7.5-9.75 7.5-4.5 0-8.5-3-9.75-7.5z"
        />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-5 cursor-pointer text-gray-500 hover:text-[#ff785b]"
      >
        <>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3l18 18M2.25 12C3.5 7.5 7.5 4.5 12 4.5c2.1 0 4.07.7 5.7 1.9M21.75 12c-.443.982-1.05 2.082-1.832 3.223M15.75 15.75A6.75 6.75 0 0112 18c-4.5 0-8.5-3-9.75-7.5a10.44 10.44 0 012.73-4.777M9.75 9.75a3 3 0 104.5 4.5"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.75 9.75l4.5 4.5"
          />
        </>
      </svg>
    );

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#ffe5dc] via-[#fff8f6] to-[#ffe5dc] px-4 py-12">
      {/* Decorative Bubbles */}
      <div className="animate-float-slow absolute -top-10 left-0 size-40 rounded-full bg-[#ffbfae] opacity-30 blur-2xl" />
      <div className="animate-float absolute bottom-0 right-0 size-56 rounded-full bg-[#ff785b] opacity-20 blur-3xl" />
      <div className="animate-float-reverse absolute left-0 top-1/2 size-24 rounded-full bg-[#ffe5dc] opacity-40 blur-xl" />
      <div className="animate-float absolute right-1/3 top-1/4 size-32 rounded-full bg-[#fa9f3d] opacity-20 blur-2xl" />
      <div className="animate-float absolute bottom-1/4 left-1/3 size-24 rounded-full bg-[#9757d7] opacity-10 blur-2xl" />
      <HomeIconNavigation />
      <div className="relative z-10 w-full max-w-sm space-y-8 rounded-2xl border border-[#ffbfae] bg-white/90 p-8 shadow-2xl backdrop-blur-md sm:max-w-md">
        <div className="mb-2 flex justify-center">
          <Image
            src="/images/Motorblend.png"
            alt="Delivery Logo"
            width={80}
            height={80}
            className="rounded-full border-4 border-[#ff785b] bg-white shadow-lg"
          />
        </div>
        <h1 className="text-center text-3xl font-extrabold tracking-tight text-[#ff785b] drop-shadow-lg sm:text-4xl">
          Sign Up
        </h1>
        {successPrompt && (
          <div
            className="animate-shake mb-4 animate-pulse rounded border border-[#ff785b] bg-green-100 px-4 py-2 text-sm font-semibold text-green-700"
            style={{ animationDuration: '0.5s' }}
          >
            {successPrompt}
          </div>
        )}
        {error && (
          <div
            className="animate-shake mb-4 animate-pulse rounded border border-[#ff785b] bg-red-100 px-4 py-2 text-sm font-semibold text-red-700"
            style={{ animationDuration: '0.5s' }}
          >
            {error}
          </div>
        )}
        {phonePrompt && (
          <div
            className="animate-shake mb-2 animate-pulse rounded border border-[#ffbfae] bg-yellow-100 px-4 py-2 text-xs font-semibold text-yellow-800"
            style={{ animationDuration: '0.5s' }}
          >
            {phonePrompt}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {formFields.map((field) =>
            field.id === 'password' || field.id === 'confirmPassword' ? (
              <div key={field.id} className="relative">
                <Input
                  id={field.id}
                  type={showPassword[field.id] ? 'text' : 'password'}
                  placeholder={field.placeholder}
                  value={formData[field.id as keyof SignUpFormFields] ?? ''}
                  onChange={handleChange}
                  className={`h-12 w-full rounded-[33px] border border-[#ff785b] bg-white px-6 text-sm text-[#333] shadow-sm transition-all duration-300 placeholder:text-[#aaa] focus:ring-2 focus:ring-[#ff785b]/50 ${highlight[field.id] ? 'animate-shake border-2 border-red-500 ring-2 ring-red-300' : ''}`}
                />
                <span
                  className="absolute right-4 top-3 z-10"
                  onClick={() => handleTogglePassword(field.id)}
                  tabIndex={0}
                  role="button"
                  aria-label={
                    showPassword[field.id] ? 'Hide password' : 'Show password'
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleTogglePassword(field.id);
                    }
                  }}
                >
                  <EyeIcon open={showPassword[field.id]} />
                </span>
              </div>
            ) : (
              <Input
                key={field.id}
                id={field.id}
                type={field.type}
                placeholder={field.placeholder}
                value={formData[field.id as keyof SignUpFormFields] ?? ''}
                onChange={handleChange}
                className={`h-12 w-full rounded-[33px] border border-[#ff785b] bg-white px-6 text-sm text-[#333] shadow-sm transition-all duration-300 placeholder:text-[#aaa] focus:ring-2 focus:ring-[#ff785b]/50 ${highlight[field.id] ? 'animate-shake border-2 border-red-500 ring-2 ring-red-300' : ''}`}
              />
            )
          )}
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
            {/* Facebook Icon */}
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-label="Facebook"
            >
              <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0" />
            </svg>
          </div>
          <div className="flex size-9 items-center justify-center rounded-full bg-white text-[#4285F4] shadow-md">
            {/* Google G icon */}
            <svg
              width="22"
              height="22"
              viewBox="0 0 48 48"
              fill="none"
              aria-label="Google"
            >
              <g>
                <path
                  fill="#4285F4"
                  d="M43.611 20.083h-1.861V20H24v8h11.303c-1.627 4.657-6.084 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c2.938 0 5.624 1.045 7.736 2.764l6.571-6.571C34.058 6.053 29.284 4 24 4 12.954 4 4 12.954 4 24s8.954 20 20 20c11.045 0 19.999-8.954 19.999-20 0-1.341-.138-2.651-.388-3.917z"
                />
                <path
                  fill="#34A853"
                  d="M6.306 14.691l6.571 4.822C14.655 16.047 19.001 13 24 13c2.938 0 5.624 1.045 7.736 2.764l6.571-6.571C34.058 6.053 29.284 4 24 4c-7.732 0-14.41 4.41-17.694 10.691z"
                />
                <path
                  fill="#FBBC05"
                  d="M24 44c5.084 0 9.797-1.742 13.464-4.721l-6.197-5.073C29.284 36.955 26.742 38 24 38c-5.202 0-9.632-3.317-11.276-7.946l-6.522 5.025C9.545 41.509 16.227 44 24 44z"
                />
                <path
                  fill="#EA4335"
                  d="M43.611 20.083h-1.861V20H24v8h11.303c-.7 2.004-2.09 3.708-3.936 4.927l6.197 5.073C40.455 41.509 47.137 39.018 44.478 32.054z"
                />
              </g>
            </svg>
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
