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
const CubeDemo = dynamic(() => import('./CubeDemo').then((m) => m.CubeDemo), {
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

export type DemoKind = 'timeline' | 'browser' | 'cube' | 'easing' | 'presets' | 'share';

export function Demo({ kind }: { kind: DemoKind }) {
  switch (kind) {
    case 'timeline':
      return <TimelineDemo />;
    // The same timeline, inside an address bar. That makes the "All Web
    // Editing" point better than the sentence under it does.
    case 'browser':
      return <TimelineDemo chrome="browser" />;
    case 'cube':
      return <CubeDemo />;
    case 'easing':
      return <EasingCurveDemo />;
    case 'presets':
      return <PresetWallDemo />;
    case 'share':
      return <ShareDemo />;
  }
}
