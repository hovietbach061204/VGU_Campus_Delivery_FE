import React from 'react';

interface SizeSelectModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (size: 'Small' | 'Medium' | 'Large') => void;
  description?: string;
}

const SizeSelectModal: React.FC<SizeSelectModalProps> = ({
  open,
  onClose,
  onConfirm,
  description,
}) => {
  const [selectedSize, setSelectedSize] = React.useState<
    'Small' | 'Medium' | 'Large'
  >('Medium');

  const PORTION_SIZES = [
    {
      value: 'Small',
      label: 'Small',
      description: 'Perfect for light appetite',
    },
    { value: 'Medium', label: 'Medium', description: 'Standard serving size' },
    { value: 'Large', label: 'Large', description: 'For hearty appetite' },
  ];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-center text-lg font-semibold text-gray-800">
          Select Size
        </h3>
        {/* Portion Size Selection UI (copied from ItemCustomizationModal) */}
        <div className="mb-6">
          <div id="portion-size-selection" className="space-y-2">
            {PORTION_SIZES.map((size) => (
              <label
                key={size.value}
                className={`flex cursor-pointer items-center space-x-3 rounded-lg border p-3 transition-colors ${
                  selectedSize === size.value
                    ? 'border-[#ff785b] bg-orange-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span className="sr-only">Select {size.label} size</span>
                <input
                  type="radio"
                  name="portion"
                  value={size.value}
                  checked={selectedSize === size.value}
                  onChange={() =>
                    setSelectedSize(size.value as 'Small' | 'Medium' | 'Large')
                  }
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
        {description && (
          <div className="mb-4 text-center text-sm text-gray-500">
            {description}
          </div>
        )}
        <div className="flex justify-end gap-2">
          <button
            className="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="rounded bg-[#ff785b] px-4 py-2 text-white hover:bg-[#ff5b3b]"
            onClick={() => onConfirm(selectedSize)}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default SizeSelectModal;
