'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { loginUser } from '../api/auth';
import HomeIconNavigation from '@/components/HomeIconNavigation';
import Image from 'next/image';

export default function SignIn() {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successPrompt, setSuccessPrompt] = useState('');
  const router = useRouter();

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const success = params.get('success');
      if (success) {
        setSuccessPrompt(success);
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      }
    }
  }, []);

  React.useEffect(() => {
    if (successPrompt) {
      const timer = setTimeout(() => setSuccessPrompt(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successPrompt]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await loginUser(username, password);
      const token = response.result?.token;
      const userId = response.result?.userId;

      console.log('login token:', token);
      localStorage.setItem('access_token', token); // use consistent key here!
      localStorage.setItem('user_id', userId);

      // Simulating login process (mock)
      const isAdmin = username === 'admin'; // Simulate admin login
      localStorage.setItem('isAdmin', String(isAdmin)); // Save role

      // Redirect after login
      router.push('/');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

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
          VGU Delivery
        </h1>
        {successPrompt && (
          <div
            className="animate-fade-in-out mb-4 flex items-center gap-2 rounded border border-[#ff785b] bg-green-100 px-4 py-2 text-sm font-semibold text-green-700 shadow"
            style={{ animation: 'fadeInOut 5s linear' }}
          >
            <svg
              className="size-5 text-[#ff785b]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            {successPrompt}
          </div>
        )}

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <Input
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            className="h-12 w-full rounded-[33px] border border-[#ff785b] bg-white px-6 text-sm text-[#333] shadow-sm placeholder:text-[#aaa] focus:ring-2 focus:ring-[#ff785b]/50"
          />
          <Input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 w-full rounded-[33px] border border-[#ff785b] bg-white px-6 text-sm text-[#333] shadow-sm placeholder:text-[#aaa] focus:ring-2 focus:ring-[#ff785b]/50"
          />

          {error && <p className="text-center text-sm text-red-500">{error}</p>}

          <Button
            type="submit"
            className="h-[45px] w-full rounded-[33px] bg-[#ff785b] font-semibold text-white transition hover:bg-[#e96c4e]"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Eat Away!'}
          </Button>
        </form>

        <div className="text-center text-sm text-[#777]">or sign in with</div>

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
