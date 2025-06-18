'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AppInitializer = () => {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userId = params.get('userId');

    if (token) {
      localStorage.setItem('access_token', token);

      // Optional: decode JWT to extract roles/scopes
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log(payload);

        localStorage.setItem('userRole', payload.scope || '');
      } catch (e) {
        console.error('Failed to decode JWT payload', e);
      }

      // Set user ID from URL param if available
      if (userId) {
        localStorage.setItem('user_id', userId);
      }

      // Clean URL and redirect to homepage
      router.replace('/');
    }
  }, [router]);

  return null;
};

export default AppInitializer;
