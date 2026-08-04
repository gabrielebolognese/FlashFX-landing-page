import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className = '' }: BadgeProps) {
  return (
    <span className={`inline-block px-3 py-1 text-sm font-mono bg-fx-accent-purple/10 text-fx-accent-purple border border-fx-accent-purple/20 rounded-button ${className}`}>
      {children}
    </span>
  );
}
