'use client';

import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/*
 * The filled call to action. Styling lives in `.fx-cta` in globals.css.
 *
 * Deliberately not `ShimmerButton`: that is the dark outline chip used a dozen
 * times across the site, and these are the two moments the page actually asks
 * for the click. They should not look like the others.
 *
 * Extracted from the hero on 2026-08-07 when the 3D section gained one too —
 * two copies of a gradient, three shadows and a sheen would drift apart.
 */

interface CtaButtonProps {
  href: string;
  children: React.ReactNode;
  /** `lg` is the hero. `md` is 80% of it, for sections further down. */
  size?: 'lg' | 'md';
  className?: string;
}

const SIZES = {
  lg: {
    box: 'px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-2xl md:text-[26px] gap-3 sm:gap-4',
    arrow: 'w-5 h-5 sm:w-7 sm:h-7',
  },
  md: {
    box: 'px-6 sm:px-10 py-3 sm:py-5 text-base sm:text-xl md:text-[21px] gap-2.5 sm:gap-3',
    arrow: 'w-4 h-4 sm:w-6 sm:h-6',
  },
} as const;

export function CtaButton({ href, children, size = 'lg', className }: CtaButtonProps) {
  const s = SIZES[size];
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'fx-cta group inline-flex items-center rounded-full text-fx-bg-base font-semibold tracking-tight',
        s.box,
        className
      )}
      style={{ fontFamily: 'var(--font-inter), sans-serif' }}
    >
      {children}
      <ArrowRight
        className={cn('flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1', s.arrow)}
        strokeWidth={2.5}
      />
    </a>
  );
}
