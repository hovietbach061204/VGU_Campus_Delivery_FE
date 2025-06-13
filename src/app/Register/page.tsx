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
        }, 800);
        return;
      }
    }
    setFormData((prev) => ({ ...prev, [id]: value }));
    setHighlight((prev) => ({ ...prev, [id]: false }));
    setError('');
  };

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
    let newHighlight: { [key: string]: boolean } = {};
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
        setHighlight((prev) => {
          let reset: { [key: string]: boolean } = { ...prev };
          requiredFields.forEach((f) => (reset[f] = false));
          return reset;
        });
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
        className="w-5 h-5 cursor-pointer text-gray-500 hover:text-[#ff785b]"
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
        className="w-5 h-5 cursor-pointer text-gray-500 hover:text-[#ff785b]"
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#ffe5dc] to-[#fff8f6] px-4 py-12">
      <div className="w-full max-w-sm space-y-8 sm:max-w-md">
        <h1 className="text-center text-3xl font-semibold text-[#ff785b] sm:text-4xl">
          Sign Up
        </h1>
        {successPrompt && (
          <div
            className="mb-4 rounded bg-green-100 px-4 py-2 text-sm text-green-700 font-semibold animate-pulse animate-shake"
            style={{ animationDuration: '0.5s' }}
          >
            {successPrompt}
          </div>
        )}
        {error && (
          <div
            className="mb-4 rounded bg-red-100 px-4 py-2 text-sm text-red-700 font-semibold animate-pulse animate-shake"
            style={{ animationDuration: '0.5s' }}
          >
            {error}
          </div>
        )}
        {phonePrompt && (
          <div
            className="mb-2 rounded bg-yellow-100 px-4 py-2 text-xs text-yellow-800 font-semibold animate-pulse animate-shake"
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
                  className={`h-12 w-full rounded-[33px] border bg-white px-6 text-sm text-[#333] shadow-sm placeholder:text-[#aaa] focus:ring-2 focus:ring-[#ff785b]/50 transition-all duration-300 border-[#ff785b] ${highlight[field.id] ? 'border-2 border-red-500 ring-2 ring-red-300 animate-shake' : ''}`}
                />
                <span
                  className="absolute right-4 top-3 z-10"
                  onClick={() => handleTogglePassword(field.id)}
                  tabIndex={0}
                  role="button"
                  aria-label={
                    showPassword[field.id] ? 'Hide password' : 'Show password'
                  }
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
                className={`h-12 w-full rounded-[33px] border bg-white px-6 text-sm text-[#333] shadow-sm placeholder:text-[#aaa] focus:ring-2 focus:ring-[#ff785b]/50 transition-all duration-300 border-[#ff785b] ${highlight[field.id] ? 'border-2 border-red-500 ring-2 ring-red-300 animate-shake' : ''}`}
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
