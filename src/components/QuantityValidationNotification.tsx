'use client';

import React, { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';

interface QuantityValidationNotificationProps {
  show: boolean;
  message: string;
  onClose: () => void;
}

export default function QuantityValidationNotification({
  show,
  message,
  onClose,
}: QuantityValidationNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Allow fade-out animation to complete
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show && !isVisible) return null;

  return (
    <div
      className={`fixed left-1/2 top-4 z-50 flex -translate-x-1/2 items-center space-x-2 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 shadow-lg transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
      }`}
    >
      <AlertTriangle className="size-5 text-yellow-600" />
      <p className="text-sm font-medium text-yellow-800">{message}</p>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className="ml-2 text-yellow-600 hover:text-yellow-800"
      >
        ×
      </button>
    </div>
  );
}
