/*
 * Shared shape of the particle controls (immersionmilestones.md I8).
 *
 * Deliberately its own module. The section needs these to render its sliders,
 * and importing them from `ParticleStudio` would drag the whole simulation —
 * the recipes, the pool, the draw loop — into the page bundle and defeat that
 * file's `dynamic({ ssr: false })` entirely. It did, until this split: First
 * Load JS went up 3 kB and the emitter turned up inside the eager page chunk.
 *
 * Anything both sides need lives here. Anything only the canvas needs stays
 * there.
 */

export type Preset = 'confetti' | 'fire' | 'smoke' | 'magic';
export type Shape = 'rect' | 'circle' | 'triangle' | 'ribbon' | 'star';

export interface Controls {
  preset: Preset;
  shape: Shape;
  /** Particles per second. */
  rate: number;
  /** Emission cone, in degrees. */
  spread: number;
  speed: number;
  size: number;
}

export const DEFAULTS: Controls = {
  preset: 'confetti',
  shape: 'rect',
  rate: 220,
  spread: 34,
  speed: 1,
  size: 1,
};

export const SLIDERS = [
  { key: 'rate' as const, label: 'Count', min: 30, max: 600, step: 10, unit: '/s' },
  { key: 'spread' as const, label: 'Dilatation', min: 4, max: 160, step: 2, unit: '°' },
  { key: 'speed' as const, label: 'Speed', min: 0.3, max: 2.2, step: 0.05, unit: '×' },
  { key: 'size' as const, label: 'Size', min: 0.4, max: 2.4, step: 0.05, unit: '×' },
];

export const SHAPES: { id: Shape; label: string }[] = [
  { id: 'rect', label: 'Square' },
  { id: 'ribbon', label: 'Ribbon' },
  { id: 'circle', label: 'Circle' },
  { id: 'triangle', label: 'Triangle' },
  { id: 'star', label: 'Star' },
];

export const PRESETS: { id: Preset; label: string }[] = [
  { id: 'confetti', label: 'Confetti' },
  { id: 'fire', label: 'Fire' },
  { id: 'smoke', label: 'Smoke' },
  { id: 'magic', label: 'Magic' },
];
