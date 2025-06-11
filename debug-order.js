// Debug script to check Firestore order
// You can run this in your browser console on any page of your app

// Check if order exists
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

async function checkOrder(orderId) {
  try {
    const orderDoc = await getDoc(doc(db, 'orders', orderId));
    if (orderDoc.exists()) {
      console.log('Order found:', orderDoc.data());
      return orderDoc.data();
    } else {
      console.log('Order not found');
      return null;
    }
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
}

// Usage:
// checkOrder('650f0570-f02f-45b3-a894-782c40659ec8');
