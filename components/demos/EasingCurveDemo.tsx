'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { DemoShell, useDemo } from './demo-kit';

/*
 * An easing curve that morphs between presets, with a shape below moving on
 * whichever curve is showing (immersionmilestones.md I3).
 *
 * Replaces the "Keyframe Interpolation" embed. That section was already trying
 * to explain something inherently visual — "click any curve to preview its
 * shape" — through a video of someone else doing it.
 *
 * The two halves are driven by the same preset, so the curve is not decoration
 * next to the motion: it is the reason the square moves the way it does.
 */

const BOX = 100;

const presets = [
  { name: 'linear', p: [0, 0, 1, 1] },
  { name: 'ease-in', p: [0.42, 0, 1, 1] },
  { name: 'ease-out', p: [0, 0, 0.58, 1] },
  { name: 'ease-in-out', p: [0.65, 0, 0.35, 1] },
  { name: 'anticipate', p: [0.68, -0.35, 0.32, 1.35] },
] as const;

const HOLD = 2.8;

/** Cubic bezier control points to an SVG path, y flipped for screen space. */
function toPath([x1, y1, x2, y2]: readonly number[]): string {
  const sx = (v: number) => v * BOX;
  const sy = (v: number) => BOX - v * BOX;
  return `M0 ${BOX} C ${sx(x1)} ${sy(y1)}, ${sx(x2)} ${sy(y2)}, ${BOX} 0`;
}

export function EasingCurveDemo() {
  const { ref, active } = useDemo();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % presets.length), HOLD * 1000);
    return () => clearInterval(id);
  }, [active]);

  const preset = presets[index];

  return (
    <DemoShell innerRef={ref} label="Interpolation">
      <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 p-5">
        {/* The curve */}
        <div className="relative flex-shrink-0" style={{ width: 132, height: 132 }}>
          <svg viewBox={`-6 -6 ${BOX + 12} ${BOX + 12}`} className="w-full h-full overflow-visible">
            <rect x="0" y="0" width={BOX} height={BOX} fill="none" stroke="rgba(255,255,255,0.07)" />
            <line x1="0" y1={BOX} x2={BOX} y2="0" stroke="rgba(255,255,255,0.09)" strokeDasharray="3 3" />

            <motion.path
              d={toPath(preset.p)}
              animate={{ d: toPath(preset.p) }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              fill="none"
              stroke="#F5C518"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Control handles, as the editor draws them. */}
            <motion.g
              animate={{ opacity: active ? 1 : 0.5 }}
              transition={{ duration: 0.3 }}
            >
              <line
                x1="0" y1={BOX}
                x2={preset.p[0] * BOX} y2={BOX - preset.p[1] * BOX}
                stroke="rgba(245,197,24,0.4)" strokeWidth="1"
              />
              <line
                x1={BOX} y1="0"
                x2={preset.p[2] * BOX} y2={BOX - preset.p[3] * BOX}
                stroke="rgba(245,197,24,0.4)" strokeWidth="1"
              />
              <circle cx={preset.p[0] * BOX} cy={BOX - preset.p[1] * BOX} r="3.5" fill="#F5C518" />
              <circle cx={preset.p[2] * BOX} cy={BOX - preset.p[3] * BOX} r="3.5" fill="#F5C518" />
            </motion.g>
          </svg>
        </div>

        {/* The result: a square travelling on exactly that curve. */}
        <div className="flex-1 w-full max-w-[260px] flex flex-col gap-3">
          <div className="relative h-11 rounded-lg border border-fx-border bg-fx-bg-surface/60 overflow-hidden">
            <div className="absolute inset-y-0 left-0 right-0 m-2">
              <motion.div
                className="absolute top-0 bottom-0 left-0 right-0"
                key={`${preset.name}-${active}`}
                animate={active ? { x: ['0%', '100%', '0%'] } : { x: '38%' }}
                transition={
                  active
                    ? {
                        duration: HOLD,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: [...preset.p] as [number, number, number, number],
                      }
                    : { duration: 0 }
                }
              >
                <div className="absolute inset-y-0 -left-3 w-6 rounded-md bg-fx-accent-yellow shadow-[0_0_16px_rgba(245,197,24,0.45)]" />
              </motion.div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {presets.map((p, i) => (
              <span
                key={p.name}
                className={`font-mono text-[9px] px-2 py-1 rounded-full border transition-colors duration-300 ${
                  i === index
                    ? 'text-fx-accent-yellow border-fx-accent-yellow/50 bg-fx-accent-yellow/10'
                    : 'text-fx-text-secondary border-fx-border'
                }`}
              >
                {p.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </DemoShell>
  );
}
