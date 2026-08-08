'use client';

import { motion } from 'framer-motion';
import { DemoShell, useDemo } from './demo-kit';

/*
 * A wall of preset tiles, each running its own small composition
 * (immersionmilestones.md I3).
 *
 * Showing presets actually animating is a better argument for a preset library
 * than a video of one being applied, and it costs a fraction of the bytes.
 *
 * Reworked 2026-08-07: sixteen presets rather than nine, no panel around them,
 * and motion with enough amplitude to read at a glance. The first version was
 * nine 20px squares moving 14px inside a bordered card — technically animating,
 * but too small and too polite to make the point.
 *
 * ── Why every amplitude is a percentage ─────────────────────────────────────
 *
 * The animated element is a full-size layer, `absolute inset-0`, with the shape
 * centred inside it. Nothing about the shape itself moves.
 *
 * That is deliberate. A percentage translate resolves against the element's own
 * box, so animating the *shape* by `24%` would mean 24% of a 24px square — six
 * pixels, invisible. Animating a layer that fills the tile means `24%` is 24% of
 * the tile, so the motion scales with the grid: the same values read correctly
 * in an 85px tile on a phone and a 288px tile on a desktop. Fixed pixel
 * amplitudes cannot do both — large enough to see on desktop is large enough to
 * clip on mobile.
 *
 * Scale, rotate and skew on that layer act about the tile's centre, which for a
 * centred shape is indistinguishable from transforming the shape in place.
 *
 * All sixteen share a single governor slot: the grid registers, the tiles read
 * `active` as a prop.
 */

type Kind =
  | 'spin' | 'pop' | 'slide' | 'wipe' | 'bounce' | 'fade' | 'skew' | 'orbit'
  | 'stack' | 'flip' | 'pulse' | 'swing' | 'drop' | 'zoom' | 'shake' | 'rise';

const YELLOW = '#F5C518';
const PURPLE = '#7C5CBF';
const BLUE = '#2D6BE4';
const GREEN = '#4ADE80';
const PAPER = '#E6EDF3';

const tiles: { name: string; kind: Kind; colour: string }[] = [
  { name: 'Spin', kind: 'spin', colour: YELLOW },
  { name: 'Pop', kind: 'pop', colour: PURPLE },
  { name: 'Slide', kind: 'slide', colour: BLUE },
  { name: 'Wipe', kind: 'wipe', colour: GREEN },
  { name: 'Bounce', kind: 'bounce', colour: YELLOW },
  { name: 'Fade', kind: 'fade', colour: PAPER },
  { name: 'Skew', kind: 'skew', colour: PURPLE },
  { name: 'Orbit', kind: 'orbit', colour: BLUE },
  { name: 'Stack', kind: 'stack', colour: GREEN },
  { name: 'Flip', kind: 'flip', colour: YELLOW },
  { name: 'Pulse', kind: 'pulse', colour: PURPLE },
  { name: 'Swing', kind: 'swing', colour: BLUE },
  { name: 'Drop', kind: 'drop', colour: GREEN },
  { name: 'Zoom', kind: 'zoom', colour: YELLOW },
  { name: 'Shake', kind: 'shake', colour: PAPER },
  { name: 'Rise', kind: 'rise', colour: PURPLE },
];

/*
 * Durations are deliberately uneven. A wall where everything runs at the same
 * speed reads as one animation tiled sixteen times; a spread from 0.45s to 2.6s
 * reads as sixteen different presets. The snappy ones — Shake, Pulse, Bounce,
 * Pop — carry the energy, and the slow ones stop it becoming a strobe.
 */
/*
 * `ease` is the literal union, not `string` — framer-motion's `Transition` takes
 * an `Easing`, and a widened `string` fails to assign.
 */
type Ease = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';

const motions: Record<
  Kind,
  { animate: Record<string, (number | string)[]>; duration: number; ease?: Ease }
> = {
  shake: { animate: { x: ['-9%', '9%', '-9%', '9%', '-9%'] }, duration: 0.45 },
  pulse: { animate: { scale: [1, 1.42, 1], opacity: [0.45, 1, 0.45] }, duration: 0.85 },
  bounce: { animate: { y: ['17%', '-17%', '17%'] }, duration: 0.95 },
  pop: { animate: { scale: [0.32, 1.45, 0.32] }, duration: 1.1 },
  drop: { animate: { y: ['-20%', '20%', '-20%'] }, duration: 1.2 },
  wipe: { animate: { scaleX: [0, 1, 0] }, duration: 1.3 },
  swing: { animate: { rotate: [-34, 34, -34] }, duration: 1.5 },
  zoom: { animate: { scale: [0.22, 1.5, 0.22] }, duration: 1.6 },
  // Linear, because a rotation that eases looks like it is losing power.
  spin: { animate: { rotate: [0, 360] }, duration: 1.7, ease: 'linear' },
  stack: { animate: { y: ['-15%', '15%', '-15%'], scale: [0.78, 1.18, 0.78] }, duration: 1.8 },
  slide: { animate: { x: ['-25%', '25%', '-25%'] }, duration: 2 },
  skew: { animate: { skewX: [-30, 30, -30] }, duration: 2.1 },
  flip: { animate: { rotateY: [0, 180, 360] }, duration: 2.2 },
  fade: { animate: { opacity: [0.08, 1, 0.08] }, duration: 2.3 },
  rise: { animate: { y: ['19%', '-19%', '19%'], opacity: [0.2, 1, 0.2] }, duration: 2.4 },
  orbit: { animate: { rotate: [0, 360] }, duration: 2.6, ease: 'linear' },
};

function Tile({ tile, index, active }: { tile: (typeof tiles)[number]; index: number; active: boolean }) {
  const spec = motions[tile.kind];

  return (
    <div
      className="relative rounded-lg border border-fx-border/70 bg-fx-bg-surface/30 overflow-hidden flex items-center justify-center"
      // Only `flip` needs it, but it is inert on the rest and cheaper than a
      // conditional. Without it rotateY is a flat horizontal squash.
      style={{ perspective: 600 }}
    >
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={active ? spec.animate : { scale: 1, opacity: 0.9 }}
        transition={
          active
            ? {
                duration: spec.duration,
                repeat: Number.POSITIVE_INFINITY,
                ease: spec.ease ?? 'easeInOut',
                /*
                 * Staggered on a prime-ish stride so neighbours never sync up.
                 * Sixteen tiles pulsing together reads as one animation rather
                 * than sixteen presets.
                 */
                delay: (index % 7) * 0.19,
              }
            : { duration: 0 }
        }
      >
        {tile.kind === 'orbit' ? (
          <span className="relative w-[34%] aspect-square">
            <span
              className="absolute inset-0 rounded-full border border-dashed"
              style={{ borderColor: `${tile.colour}66` }}
            />
            <span
              className="absolute left-1/2 top-0 w-[26%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ backgroundColor: tile.colour }}
            />
          </span>
        ) : (
          /*
           * Sized as a share of the tile, not in pixels, for the same reason the
           * amplitudes are: it has to hold up at both grid sizes.
           */
          <span
            className="w-[30%] sm:w-[26%] aspect-square rounded-[6px]"
            style={{ backgroundColor: tile.colour }}
          />
        )}
      </motion.div>

      <span className="absolute bottom-1.5 left-2 font-mono text-[9px] sm:text-[10px] tracking-wide text-fx-text-secondary">
        {tile.name}
      </span>
    </div>
  );
}

export function PresetWallDemo() {
  const { ref, active } = useDemo();

  return (
    <DemoShell innerRef={ref} label="Presets" bare>
      <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-2 sm:gap-3">
        {tiles.map((tile, i) => (
          <Tile key={tile.name} tile={tile} index={i} active={active} />
        ))}
      </div>
    </DemoShell>
  );
}
