'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Authenticate() {
  const router = useRouter();
  const [isLoggedin, setIsLoggedin] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const authCodeRegex = /code=([^&]+)/;
    const isMatch = window.location.href.match(authCodeRegex);

    if (isMatch) {
      const authCode = isMatch[1];
      fetch(
        `http://localhost:8080/identity/auth/outbound/authentication?code=${authCode}`,
        {
          method: 'POST',
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.result?.token) {
            localStorage.setItem('access_token', data.result.token);
            setIsLoggedin(true);
          }
        });
    }
  }, []);

  useEffect(() => {
    if (isLoggedin) {
      router.push('/');
    }
  }, [isLoggedin, router]);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-8">
      <div className="size-16 animate-spin rounded-full border-b-2 border-[#ff785b]"></div>
      <div className="text-lg font-semibold text-[#ff785b]">
        Authenticating...
      </div>
    </div>
  );
}
