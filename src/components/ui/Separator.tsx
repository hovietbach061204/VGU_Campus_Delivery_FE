// src/components/ui/Separator.tsx
import React from 'react';

interface SeparatorProps {
  className?: string; // Allow optional className prop
}

const Separator: React.FC<SeparatorProps> = ({ className }) => {
  return <hr className={`my-8 border-t-2 border-gray-300 ${className}`} />;
};

export default Separator; // Use default export
