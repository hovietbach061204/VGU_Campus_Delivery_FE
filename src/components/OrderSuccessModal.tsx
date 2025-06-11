'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderTotal: number;
  onPlaceAnother?: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  isOpen,
  onClose,
  orderTotal,
  onPlaceAnother,
}) => {
  const router = useRouter();

  if (!isOpen) return null;

  const handleViewOrders = () => {
    onClose();
    router.push('/OrderDashboard');
  };

  const handlePlaceAnother = () => {
    onClose();
    // Use the provided callback instead of reloading
    if (onPlaceAnother) {
      onPlaceAnother();
    } else {
      // Fallback to reload if no callback provided
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100">
            <svg
              className="size-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Success Message */}
          <h2 className="mb-2 text-xl font-bold text-gray-900">
            Order Placed Successfully! 🎉
          </h2>
          <p className="mb-4 text-gray-600">
            Your order worth {orderTotal.toLocaleString()}đ has been confirmed
            and will be prepared shortly.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleViewOrders}
              className="w-full rounded-lg bg-[#ff785b] py-3 font-semibold text-white transition-colors hover:bg-[#ff5b3b]"
            >
              View My Orders
            </button>

            <button
              onClick={handlePlaceAnother}
              className="w-full rounded-lg border border-[#ff785b] py-3 font-semibold text-[#ff785b] transition-colors hover:bg-[#ff785b] hover:text-white"
            >
              Place Another Order?
            </button>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="mt-4 text-sm text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessModal;
