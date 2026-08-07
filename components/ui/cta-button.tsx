import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/*
 * The filled call to action. Styling lives in `.fx-cta` in globals.css.
 *
 * Deliberately not `ShimmerButton`: that is the dark outline chip used a dozen
 * times across the site, and these are the moments the page actually asks for
 * the click. They should not look like the others.
 *
 * Extracted from the hero on 2026-08-07 when the 3D section gained one too —
 * two copies of a gradient, three shadows and a sheen would drift apart.
 *
 * It held a pointer-magnet from immersionmilestones.md I6 for a few hours and
 * no longer does (owner's call, 2026-08-07): these buttons stay still. That
 * removed the only reason this file needed to be a client component, so the
 * 'use client' directive is gone with it and the button now renders on the
 * server. `lib/motion/pointer.ts` stays — the backdrop parallax still uses it.
 */

interface CtaButtonProps {
  href: string;
  children: React.ReactNode;
  /** `lg` is the hero and the closing CTA. `md` is 80% of it, for sections in between. */
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

  /*
   * Most of these point at editor.flashfx.app and should open a new tab —
   * losing the marketing page to navigate to the editor is not what anyone
   * wants. An internal link must not: sending a visitor to another page of this
   * same site in a new tab is disorienting, and `rel="noopener"` on it is noise.
   */
  const external = /^https?:\/\//i.test(href);

  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
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
