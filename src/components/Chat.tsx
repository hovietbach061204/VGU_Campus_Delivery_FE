'use client';

import React, { useState } from 'react';
import clsx from 'clsx';
import { Paperclip, Phone, Send, Video } from 'lucide-react';
import Image from 'next/image';

type Message = {
  id: number;
  text: string;
  timestamp: string;
  sender: 'customer' | 'delivery';
};

type ChatProps = {
  name: string;

  avatarUrl?: string;
  initialMessages?: Message[];
};

export default function Chat({
  name,

  avatarUrl,
  initialMessages = [],
}: ChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: input,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          sender: 'customer',
        },
      ]);
      setInput('');
    }
  };

  return (
    <div className="flex h-screen flex-col bg-gradient-to-b from-[#fff0ea] to-[#fff8f6]">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#ff785b] px-4 py-3 text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="size-10 overflow-hidden rounded-full bg-white">
            {avatarUrl ? (
              <Image src={avatarUrl} alt="avatar" width={40} height={40} />
            ) : (
              <div className="size-full bg-gray-200"></div>
            )}
          </div>
          <div>
            <div className="font-semibold">{name}</div>
            <div className="text-sm opacity-80">Online</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Phone size={18} />
          <Video size={18} />
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={clsx(
              'max-w-[70%] rounded-lg px-4 py-3 text-base shadow',
              {
                'ml-auto bg-[#ff785b] text-white': msg.sender === 'customer',
                'mr-auto bg-white text-gray-800': msg.sender === 'delivery',
              }
            )}
          >
            <p className="text-[16px] leading-relaxed">{msg.text}</p>
            <div className="mt-1 text-right text-xs text-gray-500">
              {msg.timestamp}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 border-t px-4 py-3">
        <button className="text-[#ff785b]">
          <Paperclip size={20} />
        </button>
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 rounded-full border border-[#ff785b] px-4 py-2 text-sm text-gray-700 shadow-sm focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          className="rounded-full bg-[#ff785b] p-2 text-white hover:bg-[#e96c4e]"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
