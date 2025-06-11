// http://localhost:3000/Chat?orderId=6972c0c4-52b3-4d04-9847-845b214da7c3&role=purchaser

// http://localhost:3000/Chat?orderId=6972c0c4-52b3-4d04-9847-845b214da7c3&role=deliveryman

// http://localhost:3000/OrderStatus?orderId=6972c0c4-52b3-4d04-9847-845b214da7c3

// http://localhost:3000/DeliveryStatus?orderId=6972c0c4-52b3-4d04-9847-845b214da7c3

// http://localhost:3000/Driver

// http://localhost:3000/Map/OrderTrackingPage?orderId=6972c0c4-52b3-4d04-9847-845b214da7c3

'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import OrderChat from '@/components/OrderChat';

export default function ChatPage() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState<string>('');
  const [role, setRole] = useState<'purchaser' | 'deliveryman'>('purchaser');
  const [userId, setUserId] = useState<string>('');
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderAndSetUserId = async () => {
      // Get parameters from URL or localStorage
      const orderIdParam = searchParams.get('orderId');
      const roleParam = searchParams.get('role') as 'purchaser' | 'deliveryman';
      const userIdParam = searchParams.get('userId');
      const userIdFromStorage = localStorage.getItem('userId');

      if (orderIdParam) setOrderId(orderIdParam);
      if (
        roleParam &&
        (roleParam === 'purchaser' || roleParam === 'deliveryman')
      ) {
        setRole(roleParam);
      }

      // Try userId from URL first, then localStorage
      if (userIdParam) {
        setUserId(userIdParam);
        setLoading(false);
        return;
      } else if (userIdFromStorage) {
        setUserId(userIdFromStorage);
        setLoading(false);
        return;
      }

      // If no userId provided, fetch from Firestore order
      if (orderIdParam && roleParam) {
        try {
          const orderDoc = await getDoc(doc(db, 'orders', orderIdParam));
          if (orderDoc.exists()) {
            const orderData = orderDoc.data();
            const correctUserId =
              roleParam === 'purchaser'
                ? orderData.purchaser_id
                : orderData.delivery_man_id;

            if (correctUserId) {
              setUserId(correctUserId);
              setDebugInfo(`Auto-fetched ${roleParam} ID: ${correctUserId}`);
            } else {
              setDebugInfo(`No ${roleParam}_id found in order ${orderIdParam}`);
            }
          } else {
            setDebugInfo(`Order ${orderIdParam} not found in Firestore`);
          }
        } catch (error) {
          console.error('Error fetching order:', error);
          setDebugInfo(`Error fetching order: ${error}`);
        }
      }

      setLoading(false);
    };

    fetchOrderAndSetUserId();
  }, [searchParams]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#ffe5dc] to-[#fff8f6]">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-800">Loading...</h1>
          <p className="text-gray-600">Setting up chat...</p>
        </div>
      </main>
    );
  }

  if (!orderId || !userId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#ffe5dc] to-[#fff8f6]">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-800">Chat</h1>
          <p className="text-gray-600">
            Missing order ID or user ID. Please access this page from an order.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Expected URL: /Chat?orderId=YOUR_ORDER_ID&role=purchaser (or
            deliveryman)
          </p>
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-sm text-blue-600">
              Show Debug Info
            </summary>
            <pre className="mt-2 max-w-md overflow-auto text-xs text-gray-600">
              {debugInfo}
            </pre>
          </details>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#ffe5dc] to-[#fff8f6] p-4">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-6 text-center">
          <h1 className="mb-3 text-3xl font-bold text-[#ff785b]">
            💬{' '}
            {role === 'purchaser' ? 'Chat with Driver' : 'Chat with Customer'}
          </h1>
          <p className="text-base text-gray-600">Order ID: {orderId}</p>
          <p className="mt-1 text-sm text-gray-500">
            Real-time messaging • Messages are delivered instantly
          </p>
        </div>
        <div className="h-[650px] rounded-xl shadow-2xl">
          <OrderChat
            orderId={orderId}
            userId={userId}
            userRole={role}
            className="h-full"
          />
        </div>
      </div>
    </main>
  );
}
