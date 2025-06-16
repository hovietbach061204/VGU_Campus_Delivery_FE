'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SignIn() {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Reset error state on form submit

    try {
      // Simulating login process (mock)
      const isAdmin = username === 'admin'; // Simulate admin login based on username
      const userToken = 'fake-token'; // Simulated user token

      if (!username || !password) {
        setError('Username and password are required.');
        return;
      }

      // Save token and role in localStorage (This should ideally be handled with secure cookies or a token)
      localStorage.setItem('isAdmin', String(isAdmin)); // Save role
      localStorage.setItem('userToken', userToken); // Store user token

      // Redirect user to the respective profile page
      router.push('/');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Something went wrong'); // Handle error (in real case, log to a service)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#ffe5dc] to-[#fff8f6] px-4 py-12">
      <div className="w-full max-w-sm space-y-8 sm:max-w-md">
        <h1 className="text-center text-3xl font-semibold text-[#ff785b] sm:text-4xl">
          Sign In
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
          {error && <p className="text-center text-sm text-red-500">{error}</p>}{' '}
          {/* Error message on login failure */}
          <Button
            type="submit"
            className="h-[45px] w-full rounded-[33px] bg-[#ff785b] font-semibold text-white transition hover:bg-[#e96c4e]"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <div className="text-center text-sm text-[#777]">or sign in with</div>

        <div className="flex justify-center gap-4">
          <div className="flex size-9 items-center justify-center rounded-full bg-white text-[#3b5998] shadow-md">
            F
          </div>
          <div className="flex size-9 items-center justify-center rounded-full bg-white text-[#dd4b39] shadow-md">
            G
          </div>
        </div>

        <Link
          href="/Register"
          className="block text-center text-sm text-[#ff785b] hover:underline"
        >
          Don&#39;t have an account? Sign Up
        </Link>
      </div>
    </div>
  );
}
