'use client';

import Chat from '@/components/Chat';

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#ffe5dc] to-[#fff8f6] p-0">
      <Chat
        name="Benny"
        avatarUrl="/avatar.png"
        initialMessages={[
          {
            id: 1,
            text: 'Hi there, How are you?',
            timestamp: '9:30 AM',
            sender: 'delivery',
          },
          {
            id: 2,
            text: 'I am great. Thanks!',
            timestamp: '9:32 AM',
            sender: 'customer',
          },
          {
            id: 3,
            text: 'Can you send me my newest work schedule?',
            timestamp: '9:35 AM',
            sender: 'delivery',
          },
          {
            id: 4,
            text: 'Okay, give me some time to make a schedule for you.',
            timestamp: '9:37 AM',
            sender: 'customer',
          },
        ]}
      />
    </main>
  );
}
