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
const EasingCurveDemo = dynamic(() => import('./EasingCurveDemo').then((m) => m.EasingCurveDemo), {
  ssr: false,
  loading: holding,
});
const PresetWallDemo = dynamic(() => import('./PresetWallDemo').then((m) => m.PresetWallDemo), {
  ssr: false,
  loading: holding,
});
const ShareDemo = dynamic(() => import('./ShareDemo').then((m) => m.ShareDemo), {
  ssr: false,
  loading: holding,
});

export type DemoKind = 'timeline' | 'clips' | 'easing' | 'presets' | 'share';

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
  easing: { width: 'max-w-5xl', aspect: 'aspect-video' },
  presets: { width: 'max-w-5xl', aspect: 'aspect-video' },
  /*
   * Same treatment as the timelines: no card, full width, edges faded. The
   * choreography ends on a call to action that spans 40% of the page, which
   * only reads at full bleed. Sized by height rather than aspect ratio because
   * the content is a fixed vertical stack — artwork, lockup, button — not a
   * picture that should scale with width.
   */
  share: {
    width: '',
    aspect: 'h-[68vh] min-h-[460px] md:h-[74vh]',
    bare: true,
    fullBleed: true,
    /*
     * A gentler fade than the timelines' 30/70. The choreography ends on a
     * button spanning 40% of the page — 30% to 70% — whose edges would land
     * exactly on a 30/70 mask boundary and fade out. 14/86 clears it.
     */
    fade: [14, 86],
  },
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
    case 'easing':
      return <EasingCurveDemo />;
    case 'presets':
      return <PresetWallDemo />;
    case 'share':
      return <ShareDemo />;
  }
}
