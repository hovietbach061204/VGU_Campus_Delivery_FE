import { Suspense } from 'react';
import OrderTrackingClient from './OrderTrackingClient';

export const dynamic = 'force-dynamic';
export default function OrderTrackingPage() {
  return (
    <Suspense
      fallback={
        <p className="mt-10 text-center text-gray-500">
          Loading tracking map...
        </p>
      }
    >
      <OrderTrackingClient />
    </Suspense>
  );
}
