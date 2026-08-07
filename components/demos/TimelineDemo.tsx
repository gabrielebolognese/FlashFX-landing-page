'use client';

import { motion } from 'framer-motion';
import { DemoShell, keyframeTimes, useDemo } from './demo-kit';

/*
 * The keyframe timeline, for "Intuitive Timeline Editing"
 * (immersionmilestones.md I3).
 *
 * Rebuilt 2026-08-07: four tracks left most of the panel empty, so only the top
 * strip read as a timeline at all. Fourteen tracks at 40% of the previous row
 * height fill the frame, and a real project looks like this — a dozen layers
 * stacked, not four.
 *
 * The sibling demo in "All Web Editing" is `ClipTimelineDemo`, deliberately a
 * different kind of timeline: this one is keyframes on property tracks, that
 * one is clips in an NLE. Do not converge them.
 */

const CYCLE = 7;

/** Where the still frame parks without a loop slot. */
const RESTING = 38;

const tracks = [
  { name: 'Logo', colour: '#F5C518', bar: [4, 96], keys: [8, 34, 62, 90] },
  { name: 'Title', colour: '#7C5CBF', bar: [14, 88], keys: [18, 47, 82] },
  { name: 'Shape', colour: '#2D6BE4', bar: [8, 74], keys: [12, 40, 68] },
  { name: 'Glow', colour: '#4ADE80', bar: [26, 100], keys: [30, 58, 88] },
  { name: 'Subtitle', colour: '#F97362', bar: [10, 62], keys: [14, 36, 56] },
  { name: 'Mask', colour: '#38BDF8', bar: [30, 92], keys: [34, 60, 86] },
  { name: 'Camera', colour: '#E879F9', bar: [0, 80], keys: [10, 44, 74] },
  { name: 'Particles', colour: '#FBBF24', bar: [20, 100], keys: [26, 52, 78, 94] },
  { name: 'Blur', colour: '#34D399', bar: [6, 54], keys: [16, 38, 50] },
  { name: 'Overlay', colour: '#A78BFA', bar: [44, 98], keys: [48, 70, 92] },
  { name: 'Lower 3rd', colour: '#60A5FA', bar: [12, 70], keys: [20, 42, 64] },
  { name: 'Flash', colour: '#FB7185', bar: [56, 100], keys: [60, 80, 94] },
  { name: 'Grade', colour: '#2DD4BF', bar: [0, 100], keys: [8, 50, 88] },
  { name: 'Vignette', colour: '#C084FC', bar: [18, 86], keys: [24, 54, 80] },
];

/** Label gutter. Narrow so the tracks themselves get the width. */
const GUTTER = 68;

function Keyframe({ percent, colour, active }: { percent: number; colour: string; active: boolean }) {
  return (
    <motion.span
      className="absolute top-1/2 w-[7px] h-[7px] -mt-[3.5px] -ml-[3.5px] rounded-[1px]"
      style={{ left: `${percent}%`, rotate: 45, backgroundColor: colour }}
      animate={
        active
          ? { scale: [1, 1, 1.9, 1, 1], opacity: [0.55, 0.55, 1, 0.75, 0.55] }
          : { scale: 1, opacity: percent <= RESTING ? 0.85 : 0.5 }
      }
      transition={
        active
          ? {
              duration: CYCLE,
              times: keyframeTimes(percent),
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeOut',
            }
          : { duration: 0 }
      }
    />
  );
}

export function TimelineDemo() {
  const { ref, active } = useDemo();

  return (
    <DemoShell innerRef={ref} label="Timeline">
      {/* Ruler */}
      <div className="flex items-stretch h-5 border-b border-fx-border/70 flex-shrink-0">
        <div
          className="flex-shrink-0 border-r border-fx-border/70"
          style={{ width: GUTTER }}
        />
        <div className="relative flex-1 flex">
          {Array.from({ length: 16 }, (_, i) => (
            <div key={i} className="flex-1 border-r border-fx-border/40 last:border-r-0" />
          ))}
        </div>
      </div>

      <div className="relative flex-1 min-h-0 flex flex-col gap-[2px] py-[3px]">
        {tracks.map((track) => (
          <div key={track.name} className="flex items-center flex-1 min-h-0">
            <div
              className="flex-shrink-0 flex items-center gap-1.5 px-2 overflow-hidden"
              style={{ width: GUTTER }}
            >
              <span
                className="w-1 h-1 rounded-full flex-shrink-0"
                style={{ backgroundColor: track.colour }}
              />
              <span className="font-mono text-[8px] leading-none text-fx-text-secondary truncate">
                {track.name}
              </span>
            </div>

            <div className="relative flex-1 h-full flex items-center pr-2">
              <div
                className="absolute h-[62%] rounded-[2px]"
                style={{
                  left: `${track.bar[0]}%`,
                  width: `${track.bar[1] - track.bar[0]}%`,
                  backgroundColor: `${track.colour}1f`,
                  border: `1px solid ${track.colour}40`,
                }}
              />
              {track.keys.map((k) => (
                <Keyframe key={k} percent={k} colour={track.colour} active={active} />
              ))}
            </div>
          </div>
        ))}

        {/*
          The playhead is pinned to the left of a full-width wrapper and the
          wrapper translates, so it crosses the track area without animating
          `left` — which would force layout every frame across fourteen rows.
        */}
        <div className="absolute inset-y-0 right-2 pointer-events-none" style={{ left: GUTTER }}>
          <motion.div
            className="absolute inset-y-0 left-0 right-0"
            animate={active ? { x: ['0%', '100%'] } : { x: `${RESTING}%` }}
            transition={
              active
                ? { duration: CYCLE, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }
                : { duration: 0 }
            }
          >
            <div className="absolute inset-y-0 -left-px w-[2px] bg-fx-accent-yellow shadow-[0_0_12px_2px_rgba(245,197,24,0.5)]" />
            <div className="absolute -top-0.5 -left-[5px] w-3 h-2 rounded-sm bg-fx-accent-yellow" />
          </motion.div>
        </div>
      </div>

      <div className="flex items-center gap-4 px-3 py-1.5 border-t border-fx-border bg-fx-bg-surface/70 flex-shrink-0 overflow-hidden">
        {[
          { label: 'x', from: 120, to: 940 },
          { label: 'rotate', from: 0, to: 360 },
          { label: 'scale', from: 40, to: 100 },
        ].map((prop) => (
          <span key={prop.label} className="flex items-center gap-1.5 font-mono text-[9px] whitespace-nowrap">
            <span className="text-fx-text-secondary">{prop.label}</span>
            <motion.span
              className="text-fx-accent-yellow tabular-nums"
              animate={active ? { opacity: [0.65, 1, 0.65] } : { opacity: 0.8 }}
              transition={
                active
                  ? { duration: CYCLE / 2, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }
                  : { duration: 0 }
              }
            >
              {prop.from}
              <span className="text-fx-text-secondary mx-0.5">→</span>
              {prop.to}
            </motion.span>
          </span>
        ))}
      </div>
    </DemoShell>
  );
}
