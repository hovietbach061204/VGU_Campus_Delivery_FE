'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderRole: 'purchaser' | 'deliveryman';
  text: string;
  timestamp: Timestamp | null;
}

export function useOrderChat(
  orderId: string,
  userId: string,
  userRole: 'purchaser' | 'deliveryman'
) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen to real-time messages
  useEffect(() => {
    if (!orderId || !userId) return;

    const messagesRef = collection(db, 'chats', orderId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const chatMessages: ChatMessage[] = [];
        snapshot.forEach((doc) => {
          chatMessages.push({
            id: doc.id,
            ...doc.data(),
          } as ChatMessage);
        });
        setMessages(chatMessages);
        setLoading(false);
      },
      (err) => {
        console.error('Error listening to messages:', err);
        setError('Failed to load messages');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [orderId, userId]);

  // Send a message
  const sendMessage = async (text: string) => {
    if (!text.trim() || !orderId || !userId) return;

    try {
      const messagesRef = collection(db, 'chats', orderId, 'messages');
      await addDoc(messagesRef, {
        senderId: userId,
        senderRole: userRole,
        text: text.trim(),
        timestamp: serverTimestamp(),
      });
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  };

  return {
    messages,
    sendMessage,
    loading,
    error,
  };
}
