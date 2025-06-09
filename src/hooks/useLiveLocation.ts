import { useEffect, useRef } from 'react';
import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

/**
 * useLiveLocation - React hook to continuously update Firestore with the user's current location for a given order and role.
 * @param orderId - The Firestore order_id field value (string)
 * @param role - 'purchaser' | 'deliveryman'
 * @param enabled - boolean, whether to start/stop tracking
 */
export function useLiveLocation(
  orderId: string,
  role: 'purchaser' | 'deliveryman',
  enabled: boolean
) {
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || !orderId) return;
    if (!navigator.geolocation) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const q = doc(db, 'orders', orderId);
        if (role === 'purchaser') {
          updateDoc(q, {
            purchaser_lat: latitude,
            purchaser_lon: longitude,
          }).catch(() => {});
        } else if (role === 'deliveryman') {
          updateDoc(q, {
            delivery_man_lat: latitude,
            delivery_man_lon: longitude,
          }).catch(() => {});
        }
      },
      () => {
        // Optionally handle error
        // You may want to log or show a toast here
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [orderId, role, enabled]);
}
