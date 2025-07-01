import { Suspense } from 'react';
import DeliveryStatusClient from './DeliveryStatusContent';

export default function DeliveryStatusPage() {
  return (
    <Suspense fallback={<div>Loading delivery status...</div>}>
      <DeliveryStatusClient />
    </Suspense>
  );
}
