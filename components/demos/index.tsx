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
const CubeDemo = dynamic(() => import('./CubeDemo').then((m) => m.CubeDemo), {
  ssr: false,
  loading: holding,
});
/*
 * Carries three.js with it. That is fine and is the reason `ssr: false` and the
 * lazy chunk matter more here than anywhere else — three is already a
 * dependency (the hero shader uses it) but must not reach the initial bundle.
 */
const MorphDemo = dynamic(() => import('./MorphDemo').then((m) => m.MorphDemo), {
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

export type DemoKind = 'timeline' | 'clips' | 'cube' | 'morph' | 'easing' | 'presets' | 'share';

/**
 * The frame each demo wants.
 *
 * `VideoPlaceholder` defaults every card to `max-w-5xl` and 16:9, which is a
 * video's shape, not a timeline's. The two timelines carry fourteen and ten
 * tracks respectively and need width to read along and height to stack — 20%
 * wider than the default and appreciably taller. Everything else keeps the
 * original frame.
 */
export const demoFrame: Record<DemoKind, { width: string; aspect: string; bare?: boolean }> = {
  // 64rem + 20%.
  timeline: { width: 'max-w-[76.8rem]', aspect: 'aspect-[16/11]' },
  clips: { width: 'max-w-[76.8rem]', aspect: 'aspect-[16/10]' },
  /*
   * `bare` — no card surface, no border, no radius. The 3D viewport is meant to
   * blend into the section rather than sit in a box, so `VideoPlaceholder`
   * paints nothing behind it. `CubeDemo` passes `bare` to `DemoShell` to match;
   * the two have to agree or you get a headerless panel with a visible edge.
   */
  cube: { width: 'max-w-[76.8rem]', aspect: 'aspect-[16/9]', bare: true },
  morph: { width: 'max-w-[76.8rem]', aspect: 'aspect-[16/9]', bare: true },
  easing: { width: 'max-w-5xl', aspect: 'aspect-video' },
  presets: { width: 'max-w-5xl', aspect: 'aspect-video' },
  share: { width: 'max-w-5xl', aspect: 'aspect-video' },
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
    case 'cube':
      return <CubeDemo />;
    case 'morph':
      return <MorphDemo />;
    case 'easing':
      return <EasingCurveDemo />;
    case 'presets':
      return <PresetWallDemo />;
    case 'share':
      return <ShareDemo />;
  }
}
