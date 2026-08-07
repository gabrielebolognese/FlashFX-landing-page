'use client';

import { motion } from 'framer-motion';
import { DemoShell, useDemo } from './demo-kit';

/*
 * A wall of template tiles, each running its own small composition
 * (immersionmilestones.md I3).
 *
 * Fills "Templates & Presets" — the second of the two dead "Video Coming Soon"
 * boxes — and replaces the "Animation Presets" embed.
 *
 * Showing nine presets actually animating is a better argument for a preset
 * library than a video of one of them being applied, and it costs a fraction of
 * the bytes.
 *
 * Every tile is one transform or opacity animation. They share a single loop
 * slot: the grid registers, the tiles read `active` as a prop.
 */

type Kind = 'spin' | 'pop' | 'slide' | 'wipe' | 'bounce' | 'fade' | 'skew' | 'orbit' | 'stack';

const tiles: { name: string; kind: Kind; colour: string }[] = [
  { name: 'Spin', kind: 'spin', colour: '#F5C518' },
  { name: 'Pop', kind: 'pop', colour: '#7C5CBF' },
  { name: 'Slide', kind: 'slide', colour: '#2D6BE4' },
  { name: 'Wipe', kind: 'wipe', colour: '#4ADE80' },
  { name: 'Bounce', kind: 'bounce', colour: '#F5C518' },
  { name: 'Fade', kind: 'fade', colour: '#E6EDF3' },
  { name: 'Skew', kind: 'skew', colour: '#7C5CBF' },
  { name: 'Orbit', kind: 'orbit', colour: '#2D6BE4' },
  { name: 'Stack', kind: 'stack', colour: '#4ADE80' },
];

const motions: Record<Kind, { animate: Record<string, number[]>; duration: number }> = {
  spin: { animate: { rotate: [0, 360] }, duration: 3.2 },
  pop: { animate: { scale: [0.55, 1.15, 0.55] }, duration: 2.2 },
  slide: { animate: { x: [-14, 14, -14] }, duration: 2.6 },
  wipe: { animate: { scaleX: [0, 1, 0] }, duration: 2.4 },
  bounce: { animate: { y: [10, -10, 10] }, duration: 1.8 },
  fade: { animate: { opacity: [0.15, 1, 0.15] }, duration: 2.8 },
  skew: { animate: { skewX: [-16, 16, -16] }, duration: 3 },
  orbit: { animate: { rotate: [0, 360] }, duration: 4.4 },
  stack: { animate: { y: [-8, 8, -8], scale: [0.85, 1.05, 0.85] }, duration: 2.5 },
};

function Tile({ tile, index, active }: { tile: (typeof tiles)[number]; index: number; active: boolean }) {
  const spec = motions[tile.kind];

  return (
    <div className="relative rounded-md border border-fx-border bg-fx-bg-surface/50 overflow-hidden flex items-center justify-center">
      <motion.div
        className={tile.kind === 'orbit' ? 'relative w-7 h-7' : 'w-5 h-5 rounded-[3px]'}
        style={
          tile.kind === 'orbit'
            ? undefined
            : { backgroundColor: tile.colour, originX: 0.5, originY: 0.5 }
        }
        animate={active ? spec.animate : { scale: 1, opacity: 0.85 }}
        transition={
          active
            ? {
                duration: spec.duration,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
                // Staggered so nine tiles do not pulse in unison, which reads
                // as one animation rather than nine presets.
                delay: (index % 5) * 0.28,
              }
            : { duration: 0 }
        }
      >
        {tile.kind === 'orbit' && (
          <>
            <span className="absolute inset-0 rounded-full border border-dashed" style={{ borderColor: `${tile.colour}66` }} />
            <span
              className="absolute -top-1 left-1/2 w-2 h-2 -ml-1 rounded-full"
              style={{ backgroundColor: tile.colour }}
            />
          </>
        )}
      </motion.div>

      <span className="absolute bottom-1 left-1.5 font-mono text-[8px] text-fx-text-secondary">
        {tile.name}
      </span>
    </div>
  );
}

export function PresetWallDemo() {
  const { ref, active } = useDemo();

  return (
    <DemoShell innerRef={ref} label="Presets">
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-2 p-3">
        {tiles.map((tile, i) => (
          <Tile key={tile.name} tile={tile} index={i} active={active} />
        ))}
      </div>
    </DemoShell>
  );
}
