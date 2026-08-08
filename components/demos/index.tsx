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
const MediaPoolDemo = dynamic(() => import('./MediaPoolDemo').then((m) => m.MediaPoolDemo), {
  ssr: false,
  loading: holding,
});

export type DemoKind = 'timeline' | 'clips' | 'presets' | 'mediapool';

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
  /*
   * `bare`, and wider than it was. The wall is sixteen tiles on a 4×4 grid, and
   * a bordered card around a grid of bordered tiles is a box inside a box —
   * `DemoShell bare` must be set to match, or the card gets painted underneath.
   *
   * Squarer than a video on purpose: the tiles need height to stay close to
   * square, and 16:9 across four rows gives short wide slots that leave the
   * shapes nowhere to move vertically.
   */
  presets: { width: 'max-w-6xl', aspect: 'aspect-square sm:aspect-[4/3] lg:aspect-[16/11]', bare: true },
  /*
   * Both panels are 16:9 in their own right, so the frame has to be twice that
   * wide side by side — hence roughly 32:9 from `lg`, and two stacked 16:9s
   * below it. The panels declare `aspect-video` themselves and centre in
   * whatever slack is left, so this ratio only has to be close, not exact.
   */
  mediapool: { width: 'max-w-7xl', aspect: 'aspect-[16/19] lg:aspect-[32/9.4]', bare: true },
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
    case 'mediapool':
      return <MediaPoolDemo />;
  }
}
