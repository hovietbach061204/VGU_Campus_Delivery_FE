'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ItemCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (portion: string, customization: string, quantity: number) => void;
  itemName: string;
}

const PORTION_SIZES = [
  { value: 'Small', label: 'Small', description: 'Perfect for light appetite' },
  { value: 'Medium', label: 'Medium', description: 'Standard serving size' },
  { value: 'Large', label: 'Large', description: 'For hearty appetite' },
];

export default function ItemCustomizationModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
}: ItemCustomizationModalProps) {
  const [selectedPortion, setSelectedPortion] = useState('Medium');
  const [customization, setCustomization] = useState('');
  const [quantity, setQuantity] = useState('');
  const [showNumbersOnlyAlert, setShowNumbersOnlyAlert] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    const quantityNumber = parseInt(quantity) || 1;
    onConfirm(selectedPortion, customization, quantityNumber);
    onClose();
    // Reset for next use
    setSelectedPortion('Medium');
    setCustomization('');
    setQuantity('');
  };

  const handleQuantityChange = (value: string) => {
    // Only allow numeric input
    if (value === '' || /^\d+$/.test(value)) {
      const num = parseInt(value) || 0;
      if (num > 0 || value === '') {
        setQuantity(value);
        setShowNumbersOnlyAlert(false);
      }
    } else {
      // Show alert for non-numeric input
      setShowNumbersOnlyAlert(true);
      setTimeout(() => setShowNumbersOnlyAlert(false), 3000);
    }
  };

  const handleQuantityKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent non-numeric characters from being typed
    if (
      !/[0-9]/.test(e.key) &&
      !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)
    ) {
      e.preventDefault();
      setShowNumbersOnlyAlert(true);
      setTimeout(() => setShowNumbersOnlyAlert(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">
          Customize Your Order
        </h3>
        <p className="mb-4 text-sm text-gray-600">
          Customizing:{' '}
          <span className="font-medium text-[#ff785b]">{itemName}</span>
        </p>

        {/* Portion Size Selection */}
        <div className="mb-4">
          <label
            htmlFor="portion-size-selection"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Portion Size
          </label>
          <div id="portion-size-selection" className="space-y-2">
            {PORTION_SIZES.map((size) => (
              <label
                key={size.value}
                className={`flex cursor-pointer items-center space-x-3 rounded-lg border p-3 transition-colors ${
                  selectedPortion === size.value
                    ? 'border-[#ff785b] bg-orange-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="portion"
                  value={size.value}
                  checked={selectedPortion === size.value}
                  onChange={(e) => setSelectedPortion(e.target.value)}
                  className="text-[#ff785b] focus:ring-[#ff785b]"
                />
                <div>
                  <div className="font-medium text-gray-800">{size.label}</div>
                  <div className="text-xs text-gray-500">
                    {size.description}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Quantity Selection */}
        <div className="mb-4">
          <label
            htmlFor="quantity-input"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Quantity
          </label>
          {showNumbersOnlyAlert && (
            <div className="mb-2 rounded-md bg-red-50 p-2 text-sm text-red-600">
              Please enter numbers only
            </div>
          )}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                const currentQuantity = parseInt(quantity) || 1;
                setQuantity(Math.max(1, currentQuantity - 1).toString());
              }}
              className="flex size-8 items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"
            >
              -
            </button>
            <input
              id="quantity-input"
              type="text"
              min="1"
              value={quantity}
              onChange={(e) => handleQuantityChange(e.target.value)}
              onKeyDown={handleQuantityKeyPress}
              className="w-16 rounded border border-gray-300 p-2 text-center focus:border-[#ff785b] focus:outline-none"
            />
            <button
              onClick={() => {
                const currentQuantity = parseInt(quantity) || 0;
                setQuantity((currentQuantity + 1).toString());
              }}
              className="flex size-8 items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"
            >
              +
            </button>
          </div>
        </div>

        {/* Customization Input */}
        <div className="mb-6">
          <label
            htmlFor="special-instructions"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Special Instructions (Optional)
          </label>
          <textarea
            id="special-instructions"
            value={customization}
            onChange={(e) => setCustomization(e.target.value)}
            placeholder="e.g., Extra spicy, No onions, etc."
            className="w-full rounded border border-gray-300 p-3 text-sm focus:border-[#ff785b] focus:outline-none"
            rows={3}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1 bg-[#ff785b] text-white hover:bg-[#ff5b3b]"
          >
            Add to Order
          </Button>
        </div>
      </div>
    </div>
  );
}
