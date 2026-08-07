'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { registerLoop, setLoopCap, DEFAULT_CAP } from './governor';
import { isReducedTier } from './device-tier';

/*
 * The only sanctioned way to run a continuous animation on this site
 * (immersionmilestones.md I1).
 *
 * `repeat: Infinity` written directly in a section is a bug, however small it
 * looks. It runs while the section is off screen, it ignores reduced motion
 * unless the author remembered, and it is invisible to any attempt to measure
 * what the page is actually doing. Every one of those failure modes is
 * something P4 and P6 had to go back and fix by hand.
 *
 * Two pieces, because ambient motion comes in two shapes:
 *
 *   useAmbient()      — for a component that owns a DOM node. Watches it,
 *                       claims a slot, returns whether it may animate.
 *   AmbientProvider   — broadcasts one grant to a subtree, so a background with
 *   useAmbientActive()  24 animated paths costs one slot rather than 24.
 */

/*
 * Set once, on the first hook to run in the browser. A weak machine gets two
 * concurrent loops instead of six — enough that the section being looked at
 * still moves, few enough that a dozen do not compete for a slow compositor.
 */
let capApplied = false;
function applyTierCap() {
  if (capApplied || typeof window === 'undefined') return;
  capApplied = true;
  if (isReducedTier()) setLoopCap(2);
  else setLoopCap(DEFAULT_CAP);
}

const AmbientContext = createContext(false);

/**
 * Read the grant from the nearest `AmbientProvider`.
 *
 * Returns `false` outside a provider, which is the safe default: a leaf that
 * has not been wired up stays still rather than running ungoverned.
 */
export function useAmbientActive(): boolean {
  return useContext(AmbientContext);
}

export function AmbientProvider({
  active,
  children,
}: {
  active: boolean;
  children: React.ReactNode;
}) {
  return <AmbientContext.Provider value={active}>{children}</AmbientContext.Provider>;
}

export interface UseAmbientOptions {
  /**
   * Higher wins a contested slot. Motion that *is* the point of a section
   * should outrank motion that sits behind it.
   */
  priority?: number;
  /**
   * How early to start. Smaller than the video embeds' 900px on purpose —
   * ambient motion has nothing to buffer, so starting it before it is nearly
   * visible only spends a slot another section could be using.
   */
  rootMargin?: string;
}

/**
 * Watch an element, claim a loop slot while it is on screen, and report whether
 * this loop may currently run.
 *
 * Returns `active: false` when reduced motion is set, when the element is off
 * screen, and when the governor's cap is already spent. Callers should treat
 * `false` as "hold a composed still frame", never as "render nothing" — a
 * section whose background disappears when a slot is denied looks broken.
 */
export function useAmbient<T extends HTMLElement = HTMLDivElement>({
  priority = 0,
  rootMargin = '150px',
}: UseAmbientOptions = {}) {
  const ref = useRef<T>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    applyTierCap();

    const element = ref.current;
    if (!element) return;

    const query = window.matchMedia('(prefers-reduced-motion: reduce)');

    let handle: ReturnType<typeof registerLoop> | null = null;
    let observer: IntersectionObserver | null = null;

    const stop = () => {
      observer?.disconnect();
      observer = null;
      handle?.release();
      handle = null;
      setActive(false);
    };

    const start = () => {
      // Re-runs whenever the media query flips, so toggling the OS setting
      // takes effect without a reload.
      if (query.matches) {
        stop();
        return;
      }
      if (handle) return;

      handle = registerLoop(priority, setActive);
      observer = new IntersectionObserver(
        (records) => handle?.setVisible(records.some((r) => r.isIntersecting)),
        { rootMargin }
      );
      observer.observe(element);
    };

    start();
    query.addEventListener('change', start);

    return () => {
      query.removeEventListener('change', start);
      stop();
    };
  }, [priority, rootMargin]);

  return { ref, active };
}

/*
 * For a background whose many moving parts should share one slot, combine the
 * two by hand:
 *
 *   const { ref, active } = useAmbient<HTMLDivElement>({ priority: 1 });
 *   return (
 *     <div ref={ref} className="absolute inset-0">
 *       <AmbientProvider active={active}>{shapes}</AmbientProvider>
 *     </div>
 *   );
 *
 * Attach `ref` to an element that already exists in the layout. Wrapping a
 * positioned background in an extra div to hang the observer off tends to
 * break the positioning, and `display: contents` gives the observer no box to
 * measure, so it never reports an intersection at all.
 */
