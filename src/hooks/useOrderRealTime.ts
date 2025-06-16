import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

type OrderStatus = 'PENDING' | 'ASSIGNED' | 'IN_TRANSIT' | 'DELIVERED';

type Order = {
  order_id: string;
  purchaser_id: string;
  status: OrderStatus;
  delivery_man_id: string | null;
  total_price?: string;
  created_at?: any;
  eateryName?: string;
  foodItems?: ({ name: string; quantity?: number } | string)[];
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
