'use client';

import React, { useState, useRef } from 'react';
import { Send } from 'lucide-react';
import { useOrderChat } from '@/hooks/useOrderChat';

interface OrderChatProps {
  orderId: string;
  userId: string;
  userRole: 'purchaser' | 'deliveryman';
  className?: string; // Add optional className prop for custom styling
}

export default function OrderChat({
  orderId,
  userId,
  userRole,
  className = 'h-96', // Default height, can be overridden
}: OrderChatProps) {
  const { messages, sendMessage, loading, error } = useOrderChat(
    orderId,
    userId,
    userRole
  );
  const [input, setInput] = useState('');
  const [isComposing, setIsComposing] = useState(false); // Track IME composition
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (input.trim() && !isComposing) {
      // Don't send while composing
      sendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isComposing) {
      // Only send if not composing
      e.preventDefault();
      handleSend();
    }
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <p className="text-gray-500">Loading chat...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col rounded-lg border bg-white shadow-lg ${className}`}
    >
      {/* Header */}
      <div
        className="flex cursor-pointer items-center justify-between border-b bg-[#ff785b] p-6 text-white hover:bg-[#ff5b3b]"
        onClick={() => {
          window.open(`/Chat?orderId=${orderId}&role=${userRole}`, '_blank');
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            window.open(`/Chat?orderId=${orderId}&role=${userRole}`, '_blank');
          }
        }}
      >
        <div>
          <h3 className="text-xl font-semibold">
            💬 Chat with {userRole === 'purchaser' ? 'Deliveryman' : 'Customer'}
          </h3>
          <p className="text-sm opacity-90">Order: {orderId}</p>
        </div>
        <button
          className="ml-4 rounded bg-white px-3 py-2 font-semibold text-[#ff785b] shadow hover:bg-orange-100"
          onClick={(e) => {
            e.stopPropagation();
            window.open(
              `/Map/OrderTrackingPage?orderId=${orderId}&role=${userRole}`,
              '_blank'
            );
          }}
        >
          🗺️ Map
        </button>
      </div>

      {/* Messages */}
      <div
        className="max-h-80 flex-1 space-y-4 overflow-y-auto p-6"
        style={{ minHeight: '0' }}
      >
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mb-2 text-4xl">💭</div>
              <p className="text-gray-500">
                No messages yet. Start a conversation!
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.senderId === userId;
            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-5 py-4 text-base shadow-md ${
                    isOwnMessage
                      ? 'bg-[#ff785b] text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="leading-relaxed">{message.text}</p>
                  <p
                    className={`mt-2 text-sm ${isOwnMessage ? 'text-orange-100' : 'text-gray-500'}`}
                  >
                    {formatTimestamp(message.timestamp)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-4 border-t p-6">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 rounded-full border border-gray-300 px-4 py-3 text-base focus:border-[#ff785b] focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="rounded-full bg-[#ff785b] p-3 text-white transition-colors hover:bg-[#e96c4e] disabled:bg-gray-300"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
