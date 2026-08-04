import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'highlighted';
}

export function Card({ children, className = '', variant = 'default' }: CardProps) {
  const borderStyles = variant === 'highlighted'
    ? 'border border-fx-accent-yellow'
    : 'border border-fx-border border-t-[rgba(230,237,243,0.12)]';

  return (
    <div className={`bg-fx-bg-surface ${borderStyles} rounded-card p-6 ${className}`}>
      {children}
    </div>
  );
}
