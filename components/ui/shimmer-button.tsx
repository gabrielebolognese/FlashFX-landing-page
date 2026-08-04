'use client';

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  className?: string;
}

export default function ShimmerButton({
  children = 'Shimmer',
  className,
  ...props
}: ShimmerButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex h-12 animate-[shimmer2_2s_infinite_linear] items-center justify-center rounded-md border border-fx-accent-yellow/30 bg-[linear-gradient(110deg,#141f40,45%,#2a3a6a,55%,#141f40)] bg-[length:200%_100%] px-6 font-medium text-fx-accent-yellow transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-fx-accent-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-fx-bg-base hover:border-fx-accent-yellow/60',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
