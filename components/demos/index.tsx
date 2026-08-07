'use client';

import dynamic from 'next/dynamic';

/*
 * Demo registry (immersionmilestones.md I3).
 *
 * Every demo is `dynamic()` with `ssr: false`, so none of them are in the
 * initial bundle and none are parsed until their section is approached. That is
 * the same treatment the shaders got in P5, and it is what keeps a milestone
 * that adds five animated components from moving First Load JS.
 *
 * `ssr: false` costs nothing a crawler wants: these are illustrations of the
 * product, and the section's heading and copy are still server-rendered around
 * them.
 */

/** A neutral panel while the chunk arrives — same surface the demos land on. */
const holding = () => <div className="absolute inset-0 bg-fx-bg-base" />;

const TimelineDemo = dynamic(() => import('./TimelineDemo').then((m) => m.TimelineDemo), {
  ssr: false,
  loading: holding,
});
const ClipTimelineDemo = dynamic(() => import('./ClipTimelineDemo').then((m) => m.ClipTimelineDemo), {
  ssr: false,
  loading: holding,
});
const PresetWallDemo = dynamic(() => import('./PresetWallDemo').then((m) => m.PresetWallDemo), {
  ssr: false,
  loading: holding,
});
export type DemoKind = 'timeline' | 'clips' | 'presets';

/**
 * The frame each demo wants.
 *
 * `VideoPlaceholder` defaults every card to `max-w-5xl` and 16:9, which is a
 * video's shape, not a timeline's. The two timelines carry fourteen and ten
 * tracks respectively and need width to read along and height to stack — 20%
 * wider than the default and appreciably taller. Everything else keeps the
 * original frame.
 */
export const demoFrame: Record<
  DemoKind,
  { width: string; aspect: string; bare?: boolean; fullBleed?: boolean; fade?: [number, number] }
> = {
  /*
   * The timelines run the full width of the page with no card behind them, and
   * the outer 30% of each side faded out (see `VideoPlaceholder`). A timeline
   * boxed in a rounded panel reads as cornered; run edge to edge it reads as a
   * surface the page is sitting on.
   *
   * Both are also interactive — playhead scrubbing, draggable keyframes,
   * selectable clips — which is the other half of not feeling like a picture.
   */
  timeline: { width: '', aspect: 'aspect-[21/8] md:aspect-[21/6]', bare: true, fullBleed: true },
  clips: { width: '', aspect: 'aspect-[21/8] md:aspect-[21/6]', bare: true, fullBleed: true },
  presets: { width: 'max-w-5xl', aspect: 'aspect-video' },
};

export function Demo({ kind }: { kind: DemoKind }) {
  switch (kind) {
    case 'timeline':
      return <TimelineDemo />;
    /*
     * A different instrument, not the same one reskinned. `timeline` is
     * keyframes on property tracks; this is clips in an NLE sequence. They sat
     * in two sections of the homepage as literally the same component until
     * 2026-08-07 — keep them distinct.
     */
    case 'clips':
      return <ClipTimelineDemo />;
    case 'presets':
      return <PresetWallDemo />;
  }
}
