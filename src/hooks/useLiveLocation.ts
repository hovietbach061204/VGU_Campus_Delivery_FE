import { useEffect, useRef } from 'react';
import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

/**
 * useLiveLocation - React hook to continuously update Firestore with the user's current location for a given order and role.
 * Enhanced with better error handling and optimized settings for live tracking.
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
  const lastUpdateRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled || !orderId) {
      console.log(`📍 Live location tracking disabled for ${role}:`, {
        enabled,
        orderId,
      });
      return;
    }

    if (!navigator.geolocation) {
      console.warn('📍 Geolocation not supported for live tracking');
      return;
    }

    console.log(`📍 Starting live location tracking for ${role}:`, orderId);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const now = Date.now();

        // Throttle updates to avoid excessive Firestore writes
        if (now - lastUpdateRef.current < 5000) {
          // Only update every 5 seconds
          return;
        }

        lastUpdateRef.current = now;

        console.log(`📍 ${role} location update:`, {
          lat: latitude,
          lon: longitude,
          accuracy: accuracy + 'm',
          orderId,
        });

        const q = doc(db, 'orders', orderId);
        if (role === 'purchaser') {
          updateDoc(q, {
            purchaser_lat: latitude,
            purchaser_lon: longitude,
          }).catch((err) => {
            console.warn('📍 Failed to update purchaser location:', err);
          });
        } else if (role === 'deliveryman') {
          updateDoc(q, {
            delivery_man_lat: latitude,
            delivery_man_lon: longitude,
          }).catch((err) => {
            console.warn('📍 Failed to update deliveryman location:', err);
          });
        }
      },
      (error) => {
        console.warn(`📍 Live location error for ${role}:`, {
          code: error.code,
          message: error.message,
          orderId,
        });
        // Don't alert for live tracking errors as they're non-critical
        // Live tracking will continue to retry automatically
      },
      {
        enableHighAccuracy: false, // Use lower accuracy for battery efficiency
        maximumAge: 30000, // Allow 30-second cache for live tracking
        timeout: 15000, // Longer timeout for more reliable updates
      }
    );

    return () => {
      if (watchIdRef.current !== null) {
        console.log(`📍 Stopping live location tracking for ${role}`);
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [orderId, role, enabled]);
}
