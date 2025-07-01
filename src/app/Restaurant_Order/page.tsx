import { Suspense } from 'react';
import RestaurantOrderContent from './RestaurantOrderContent';

export default function RestaurantOrderPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
      <RestaurantOrderContent />
    </Suspense>
  );
}
