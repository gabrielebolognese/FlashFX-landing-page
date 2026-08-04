import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'default' | 'lg';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', size = 'default', children, className = '', ...props }: ButtonProps) {
  const baseStyles = 'rounded-full font-sans font-medium tracking-wider uppercase transition-all duration-200';

  const sizeStyles = {
    default: 'px-7 py-3 text-sm',
    lg: 'px-10 py-4 text-base',
  };

  const variantStyles = {
    primary: `
      bg-fx-accent-yellow text-fx-bg-base border-0
      hover:bg-fx-accent-yellow-muted
      shadow-[0_0_0_1px_rgba(245,197,24,0.4),0_0_16px_rgba(245,197,24,0.25),0_0_40px_rgba(245,197,24,0.1)]
      hover:shadow-[0_0_0_1px_rgba(245,197,24,0.6),0_0_24px_rgba(245,197,24,0.4),0_0_60px_rgba(245,197,24,0.15)]
    `,
    secondary: `
      bg-transparent text-fx-text-primary border border-fx-text-primary/20
      hover:border-fx-text-primary/50 hover:shadow-[0_0_12px_rgba(230,237,243,0.06)]
    `,
    outline: `
      bg-transparent text-fx-text-primary border-2 border-fx-accent-yellow/40
      hover:border-fx-accent-yellow hover:shadow-[0_0_16px_rgba(245,197,24,0.2)]
    `,
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
