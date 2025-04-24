import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

type Order = {
  order_id: number;
  purchaser_id: number;
  status_id: number;
  status_name: string;
  delivery_man_id: string | null;
};

export function useOrderRealtime(orderId: string | number) {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!orderId) return;

    const unsub = onSnapshot(
      doc(db, 'orders', orderId.toString()),
      (docSnap) => {
        if (docSnap.exists()) {
          const rawData = docSnap.data();
          console.log('📦 Firestore order data:', rawData);
          setOrder(rawData as Order);
        } else {
          console.warn('⚠️ No order found in Firestore for orderId:', orderId);
        }
      }
    );

    return () => unsub();
  }, [orderId]);

  return order;
}
