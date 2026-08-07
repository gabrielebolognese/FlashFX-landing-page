'use client';

import { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { subscribePointer } from '@/lib/motion';

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

/*
 * How far outside the button the pull begins, how hard it pulls, and how far it
 * is ever allowed to move (immersionmilestones.md I6).
 *
 * `MAX` is deliberately small. A button that chases the pointer across the
 * screen is a toy; one that leans a few pixels reads as responsive without ever
 * moving out from under the click that is coming.
 */
const RANGE = 110;
const PULL = 0.24;
const MAX = 12;

/**
 * Lean toward the pointer as it approaches.
 *
 * Gated three ways: `subscribePointer` is inert on coarse pointers and on the
 * reduced tier, the observer means only an on-screen button computes anything,
 * and the CSS kills the transform outright under reduced motion.
 */
function useMagnet() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let onScreen = false;

    // Without this, all four buttons on the page would measure themselves every
    // frame the pointer moved, including the three nobody can see.
    const observer = new IntersectionObserver(
      (records) => {
        onScreen = records.some((r) => r.isIntersecting);
        if (!onScreen) el.style.transform = '';
      },
      { rootMargin: '100px' }
    );
    observer.observe(el);

    const unsubscribe = subscribePointer((px, py) => {
      if (!onScreen) return;

      const r = el.getBoundingClientRect();
      const dx = px - (r.left + r.width / 2);
      const dy = py - (r.top + r.height / 2);

      /*
       * Distance from the button's *edge*, not its centre, so a wide button
       * pulls along its whole length rather than only near the middle.
       */
      const ox = Math.max(0, Math.abs(dx) - r.width / 2);
      const oy = Math.max(0, Math.abs(dy) - r.height / 2);
      const outside = Math.hypot(ox, oy);

      if (outside > RANGE) {
        // Assigning the same empty string repeatedly is free; the browser
        // discards a write that does not change the computed value.
        el.style.transform = '';
        return;
      }

      const falloff = 1 - outside / RANGE;
      const tx = Math.max(-MAX, Math.min(MAX, dx * PULL * falloff));
      const ty = Math.max(-MAX, Math.min(MAX, dy * PULL * falloff));
      el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
    });

    return () => {
      observer.disconnect();
      unsubscribe();
    };
  }, []);

  return ref;
}

export function CtaButton({ href, children, size = 'lg', className }: CtaButtonProps) {
  const s = SIZES[size];
  const magnet = useMagnet();
  return (
    <span ref={magnet} className="fx-magnet">
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
    </span>
  );
}
