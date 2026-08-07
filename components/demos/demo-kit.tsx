'use client';

import { useAmbient } from '@/lib/motion';
import { cn } from '@/lib/utils';

/*
 * Shared parts for the live product demos (immersionmilestones.md I3).
 *
 * The site sells a motion graphics tool and, until this milestone, every
 * demonstration of it was a video of someone else's screen inside a rounded
 * box. Two of those boxes had no video at all. A page for an animation product
 * that never animates the product is an argument against it.
 *
 * Each demo replaces a YouTube embed, so this milestone makes the page lighter
 * as it makes it livelier: an embed is 1–2 MB of third-party JavaScript and its
 * own rendering context, and these are a few kB of ours.
 */

/**
 * Every demo runs through the I1 governor at a priority above decoration.
 *
 * This is what priority is for: a live demo of the product is the point of the
 * section it sits in, so it should take a loop slot from a floating shape
 * rather than queue behind one.
 */
export const DEMO_PRIORITY = 3;

export function useDemo() {
  return useAmbient<HTMLDivElement>({ priority: DEMO_PRIORITY });
}

/**
 * The editor-style surface the demos sit on: a dark panel, a title strip and
 * three window dots.
 *
 * `chrome` swaps the title strip for a browser address bar, which is how the
 * "All Web Editing" section makes its point without saying it.
 */
export function DemoShell({
  label,
  chrome,
  bare,
  children,
  className,
  innerRef,
}: {
  label: string;
  chrome?: 'editor' | 'browser';
  /**
   * Drop the panel entirely — no surface, no header, no edge.
   *
   * For demos that should read as part of the page rather than as something
   * shown inside a window. The 3D viewport uses it: a cube in a bordered box
   * looks like a screenshot of a viewport, while the same cube floating on the
   * section's own background looks like it is in the page.
   *
   * `demoFrame[kind].bare` must be set to match, or `VideoPlaceholder` will
   * still paint the card surface underneath this.
   */
  bare?: boolean;
  children: React.ReactNode;
  className?: string;
  innerRef?: React.Ref<HTMLDivElement>;
}) {
  if (bare) {
    return (
      <div ref={innerRef} className={cn('absolute inset-0 overflow-hidden select-none', className)}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={innerRef}
      className={cn(
        'absolute inset-0 flex flex-col overflow-hidden bg-fx-bg-base select-none',
        className
      )}
    >
      <div className="flex items-center gap-2 px-3 py-2 border-b border-fx-border bg-fx-bg-surface/70 flex-shrink-0">
        <span className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
        </span>

        {chrome === 'browser' ? (
          <span className="ml-2 flex-1 min-w-0 flex items-center gap-2 px-2.5 py-1 rounded-full bg-fx-bg-base border border-fx-border">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/70 flex-shrink-0" />
            <span className="font-mono text-[10px] text-fx-text-secondary truncate">
              editor.flashfx.app
            </span>
          </span>
        ) : (
          <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-fx-text-secondary truncate">
            {label}
          </span>
        )}
      </div>

      {/*
        `flex flex-col` is load-bearing, not styling.

        This was a plain block container, so a child with `flex-1` — which is
        how both timelines ask to fill the panel — had nothing to flex against
        and collapsed to the height of its text. The timelines rendered as a
        thin strip at the top with three quarters of the card empty below, and
        making the card taller only made the gap bigger.

        Demos that position their content `absolute inset-0` (cube, easing,
        presets, share) are out of flow and unaffected either way; `relative`
        is what they need and it stays.
      */}
      <div className="relative flex-1 min-h-0 flex flex-col">{children}</div>
    </div>
  );
}

/**
 * Positions for the keyframe pop, as framer-motion `times`.
 *
 * The diamond scales up exactly as the playhead reaches it. Keyframes are kept
 * inside 8–92% of the track so the `times` array stays strictly increasing at
 * both ends — a duplicate 0 or 1 makes framer-motion drop the sequence.
 */
export function keyframeTimes(percent: number): number[] {
  const p = Math.min(0.92, Math.max(0.08, percent / 100));
  return [0, p - 0.05, p, p + 0.07, 1];
}
