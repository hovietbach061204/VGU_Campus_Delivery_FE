'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { loginUser } from '../api/auth';

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
      router.push(isAdmin ? '/AdminProfile' : '/');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#ffe5dc] to-[#fff8f6] px-4 py-12">
      <div className="w-full max-w-sm space-y-8 sm:max-w-md">
        <h1 className="text-center text-3xl font-semibold text-[#ff785b] sm:text-4xl">
          VGU Delivery
        </h1>
        {successPrompt && (
          <div
            className="mb-4 rounded bg-green-100 px-4 py-2 text-sm text-green-700 font-semibold animate-pulse animate-shake"
            style={{ animationDuration: '0.5s' }}
          >
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
            F
          </div>
          <a
            href="http://localhost:8080/identity/oauth2/authorization/google"
            className="flex h-[45px] w-full items-center justify-center rounded-[33px] bg-white font-semibold text-[#dd4b39] shadow-md transition hover:scale-[1.02]"
          >
            Continue with Google
          </a>
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
