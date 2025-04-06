// src/components/ui/Card.tsx
import React, { FC } from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string; // Optional className for the Card component
}

const Card: FC<CardProps> = ({ children, className }) => {
  return (
    <div className={`rounded-lg bg-white p-6 shadow-md ${className}`}>
      {children}
    </div>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string; // Optional className for CardContent
}

const CardContent: FC<CardContentProps> = ({ children, className }) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string; // Optional className for CardHeader
}

const CardHeader: FC<CardHeaderProps> = ({ children, className }) => {
  return <div className={`text-xl font-bold ${className}`}>{children}</div>;
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string; // Optional className for CardFooter
}

const CardFooter: FC<CardFooterProps> = ({ children, className }) => {
  return <div className={`pt-4 ${className}`}>{children}</div>;
};

export { Card, CardContent, CardHeader, CardFooter };
