'use client';

import { motion } from 'framer-motion';
import { DemoShell, keyframeTimes, useDemo } from './demo-kit';

/*
 * The flagship demo: the editor's timeline, running (immersionmilestones.md I3).
 *
 * Replaces the "Intuitive Timeline Editing" YouTube embed, and with
 * `chrome="browser"` the "All Web Editing" one as well — the same timeline
 * inside an address bar makes that section's point better than the sentence
 * under it does.
 */

const CYCLE = 7;

const layers = [
  { name: 'Logo', colour: '#F5C518', bar: [4, 96], keys: [8, 34, 62, 90] },
  { name: 'Title', colour: '#7C5CBF', bar: [14, 88], keys: [18, 47, 82] },
  { name: 'Shape', colour: '#2D6BE4', bar: [8, 74], keys: [12, 40, 68] },
  { name: 'Glow', colour: '#4ADE80', bar: [26, 100], keys: [30, 58, 88] },
];

/** Where the still frame parks when the demo has no loop slot. */
const RESTING = 38;

function Keyframe({ percent, colour, active }: { percent: number; colour: string; active: boolean }) {
  return (
    <motion.span
      className="absolute top-1/2 w-2 h-2 -mt-1 -ml-1 rounded-[1px]"
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

export function TimelineDemo({ chrome = 'editor' }: { chrome?: 'editor' | 'browser' }) {
  const { ref, active } = useDemo();

  return (
    <DemoShell innerRef={ref} label="Timeline" chrome={chrome}>
      {/* Ruler */}
      <div className="flex items-stretch h-6 border-b border-fx-border/70">
        <div className="w-[86px] flex-shrink-0 border-r border-fx-border/70" />
        <div className="relative flex-1 flex">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="flex-1 border-r border-fx-border/40 last:border-r-0" />
          ))}
        </div>
      </div>

      <div className="relative flex-1 min-h-0 flex flex-col justify-center gap-px py-1">
        {layers.map((layer) => (
          <div key={layer.name} className="flex items-center h-[13%] min-h-[26px]">
            <div className="w-[86px] flex-shrink-0 flex items-center gap-2 px-3">
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: layer.colour }}
              />
              <span className="font-mono text-[9px] text-fx-text-secondary truncate">
                {layer.name}
              </span>
            </div>

            <div className="relative flex-1 h-full flex items-center pr-3">
              {/* The layer's extent */}
              <div
                className="absolute h-[52%] rounded-sm"
                style={{
                  left: `${layer.bar[0]}%`,
                  width: `${layer.bar[1] - layer.bar[0]}%`,
                  backgroundColor: `${layer.colour}1f`,
                  border: `1px solid ${layer.colour}40`,
                }}
              />
              {layer.keys.map((k) => (
                <Keyframe key={k} percent={k} colour={layer.colour} active={active} />
              ))}
            </div>
          </div>
        ))}

        {/*
          The playhead is pinned to the left of a full-width wrapper and the
          wrapper is what translates, so it crosses the track without animating
          `left` — that would force layout on every frame for the whole panel.
          Same approach as the video loader's playhead.
        */}
        <div className="absolute inset-y-0 left-[86px] right-3 pointer-events-none">
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

      {/* Property readout — the numbers move because the playhead does. */}
      <div className="flex items-center gap-4 px-3 py-2 border-t border-fx-border bg-fx-bg-surface/70 flex-shrink-0 overflow-hidden">
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
