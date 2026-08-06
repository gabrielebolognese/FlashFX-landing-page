import { PenTool, Zap, Box, Sparkles, Download, Layers } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/*
 * Category summaries for the /features hub.
 *
 * Deliberately a SUMMARY, not a copy of the homepage. `FeatureHighlights` on `/`
 * already renders all 45 editorFeatures, 90 animationPresets, and 39
 * editableProperties in full; repeating that list here would put near-identical
 * content on two URLs and split their ranking.
 *
 * Every count below is derived from the data files in
 * components/sections/feature-highlights/ — re-derive them there rather than
 * editing a number here, or the two will drift:
 *   editorFeatures.ts      45 entries
 *   animationPresets.ts    90 entries across 17 categories
 *   editableProperties.ts  39 entries
 * The inline counts (16 easings, 70+ filters, 7 materials, 16 blend modes)
 * come from those entries' own descriptions.
 *
 * `anchor` points at a section that is actually rendered on `/`. Do not add
 * `#dual-timeline` or `#share-projects` — those components exist but are not
 * mounted on any page (FIX.md M6).
 */
export interface FeatureCategory {
  title: string;
  description: string;
  highlights: string[];
  Icon: LucideIcon;
  anchor?: string;
}

export const featureCategories: FeatureCategory[] = [
  {
    title: 'Design & Vector Tools',
    description:
      'A full vector toolset in the browser. Draw, type, mask, and composite without opening a desktop app.',
    highlights: [
      'Pen tool with bezier curves, smoothing, and path closing',
      'Per-segment text styling with curves, gradients, stroke and glow',
      '7 materials — matte, glossy, metallic, glass, neon, holographic, plastic',
      '16 blend modes and stackable masks with feather and invert',
    ],
    Icon: PenTool,
    anchor: '/#all-web-editing',
  },
  {
    title: 'Animation & Keyframes',
    description:
      'Keyframe anything, then shape the motion. Every property on the canvas is animatable on a multi-track timeline.',
    highlights: [
      '39 editable properties, 50+ of them animatable',
      '16 easing functions with per-keyframe bezier handles',
      'Hold keyframes for step interpolation',
      'Text animation by character, word, line, or object',
    ],
    Icon: Zap,
    anchor: '/#easy-animations',
  },
  {
    title: 'Motion Presets',
    description:
      'Ready-made motion you can drop onto any element and adjust, instead of building every move from scratch.',
    highlights: [
      '90 animation presets across 17 categories',
      'Position, rotation, scale, opacity, and overshoot families',
      'Dedicated text reveal, emphasis, and animator sets',
      'Timing macros for staggering a whole group at once',
    ],
    Icon: Sparkles,
    anchor: '/#keyframe-interpolation',
  },
  {
    title: '3D',
    description:
      'Add depth without leaving the timeline. 3D objects animate on the same tracks as everything else.',
    highlights: [
      '3D primitives with animatable transforms',
      'PBR, toon, and wireframe materials',
      'Model import — GLB, OBJ, FBX, STL',
      'HDRI lighting and environment maps',
    ],
    Icon: Box,
    anchor: '/#3d-support',
  },
  {
    title: 'Media & Compositing',
    description:
      'Bring in footage, audio, and stills, then grade and key them alongside your graphics.',
    highlights: [
      'Video import with GPU-accelerated playback',
      'Unlimited audio tracks with waveform view and per-clip fades',
      '70+ image filters across 14 categories',
      'Chroma key and color grading',
    ],
    Icon: Layers,
  },
  {
    title: 'Project & Export',
    description:
      'Get finished work out in the format the platform wants, and pick the project back up on any machine.',
    highlights: [
      'MP4, WebM, GIF, SVG, and PNG sequence output',
      'Transparent background support on PNG sequences',
      'Cloud projects reachable from any browser',
      'Unlimited undo/redo and auto-backup',
    ],
    Icon: Download,
    anchor: '/features#export',
  },
];
