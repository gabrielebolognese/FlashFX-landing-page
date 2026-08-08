'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDemo } from './demo-kit';

/*
 * A cursor dragging out the four primitives, one after another.
 *
 * Rectangle, circle, star, polygon — each drawn the way you actually draw one:
 * the cursor travels to a corner, presses, drags a marquee to the opposite
 * corner, and the shape snaps into the box it just described. Then it stays on
 * the canvas while the next one is drawn beside it, so the panel fills up rather
 * than replaying an empty stage four times.
 *
 * The marquee is the point. A shape that simply fades in has been placed; a
 * shape that appears inside a rectangle you watched being dragged has been
 * *made*, which is the claim the section is making about speed.
 */

const W = 400;
const H = 300;

/** Where each shape gets drawn, as a drag from one corner to the other. */
const SLOTS = [
  { kind: 'rect', from: [44, 46], to: [180, 140], colour: '#F5C518' },
  { kind: 'circle', from: [222, 46], to: [356, 140], colour: '#5B8DEF' },
  { kind: 'star', from: [44, 168], to: [180, 262], colour: '#E86A9B' },
  { kind: 'polygon', from: [222, 168], to: [356, 262], colour: '#4ADE80' },
] as const;

/** Milliseconds. One shape is travel, then press, then drag, then release. */
const STEP = { travel: 620, press: 160, drag: 560, settle: 420 };
const PER_SHAPE = STEP.travel + STEP.press + STEP.drag + STEP.settle;

function starPoints(cx: number, cy: number, rx: number, ry: number) {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const f = i % 2 === 0 ? 1 : 0.45;
    pts.push(`${cx + Math.cos(a) * rx * f},${cy + Math.sin(a) * ry * f}`);
  }
  return pts.join(' ');
}

function polygonPoints(cx: number, cy: number, rx: number, ry: number, n = 6) {
  return Array.from({ length: n }, (_, i) => {
    const a = ((Math.PI * 2) / n) * i - Math.PI / 2;
    return `${cx + Math.cos(a) * rx},${cy + Math.sin(a) * ry}`;
  }).join(' ');
}

function Shape({ slot, drawn }: { slot: (typeof SLOTS)[number]; drawn: boolean }) {
  const [x1, y1] = slot.from;
  const [x2, y2] = slot.to;
  const w = x2 - x1;
  const h = y2 - y1;
  const cx = x1 + w / 2;
  const cy = y1 + h / 2;

  const common = {
    fill: slot.colour,
    fillOpacity: 0.85,
    stroke: slot.colour,
    strokeWidth: 2,
  };

  return (
    <motion.g
      style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
      initial={{ scale: 0.6, opacity: 0 }}
      animate={drawn ? { scale: 1, opacity: 1 } : { scale: 0.6, opacity: 0 }}
      // A little overshoot on the way in, so the shape lands rather than fades.
      transition={{ duration: 0.42, ease: [0.34, 1.56, 0.64, 1] }}
    >
      {slot.kind === 'rect' && <rect x={x1} y={y1} width={w} height={h} rx={8} {...common} />}
      {slot.kind === 'circle' && <ellipse cx={cx} cy={cy} rx={w / 2} ry={h / 2} {...common} />}
      {slot.kind === 'star' && <polygon points={starPoints(cx, cy, w / 2, h / 2)} {...common} />}
      {slot.kind === 'polygon' && <polygon points={polygonPoints(cx, cy, w / 2, h / 2)} {...common} />}
    </motion.g>
  );
}

export function ShapeTools() {
  const { ref, active } = useDemo();
  const [index, setIndex] = useState(-1);
  const [phase, setPhase] = useState<'travel' | 'press' | 'drag' | 'settle'>('travel');
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (!active) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    let t = 0;
    setIndex(-1);
    setPhase('travel');

    SLOTS.forEach((_, i) => {
      timers.push(setTimeout(() => { setIndex(i); setPhase('travel'); }, t));
      t += STEP.travel;
      timers.push(setTimeout(() => setPhase('press'), t));
      t += STEP.press;
      timers.push(setTimeout(() => setPhase('drag'), t));
      t += STEP.drag;
      timers.push(setTimeout(() => setPhase('settle'), t));
      t += STEP.settle;
    });

    // Hold the finished set for a beat, then clear and draw them again.
    t += 1400;
    timers.push(setTimeout(() => setCycle((c) => c + 1), t));

    return () => timers.forEach(clearTimeout);
  }, [active, cycle]);

  const slot = index >= 0 ? SLOTS[index] : null;
  const dragging = phase === 'drag' || phase === 'settle';

  /* The cursor sits at the start corner until the drag begins, then travels to
     the far one. The marquee is drawn between the two. */
  const cursor = slot
    ? dragging
      ? { x: slot.to[0], y: slot.to[1] }
      : { x: slot.from[0], y: slot.from[1] }
    : { x: W * 0.5, y: H * 0.86 };

  return (
    <div
      ref={ref}
      className="relative w-full aspect-[4/3] rounded-xl border border-fx-border overflow-hidden"
      style={{ background: 'rgba(16, 24, 52, 0.72)' }}
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full">
        <defs>
          <pattern id="fx-shape-grid" width="25" height="25" patternUnits="userSpaceOnUse">
            <path d="M25 0 L0 0 0 25" fill="none" stroke="rgba(230,237,243,0.055)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width={W} height={H} fill="url(#fx-shape-grid)" />

        {SLOTS.map((s, i) => (
          <Shape key={s.kind} slot={s} drawn={index > i || (index === i && phase === 'settle')} />
        ))}

        {/* The marquee: dashed, and only while the drag is happening. */}
        {slot && (
          <motion.rect
            x={Math.min(slot.from[0], slot.to[0])}
            y={Math.min(slot.from[1], slot.to[1])}
            width={Math.abs(slot.to[0] - slot.from[0])}
            height={Math.abs(slot.to[1] - slot.from[1])}
            fill="none"
            stroke="#F5C518"
            strokeWidth={1.5}
            strokeDasharray="6 4"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'drag' ? 0.95 : 0 }}
            transition={{ duration: 0.16 }}
            style={{ transformBox: 'fill-box', transformOrigin: 'top left' }}
          />
        )}

        {/* The tool label, so it is clear which primitive is being drawn. */}
        {slot && (
          <motion.text
            key={slot.kind}
            x={W / 2}
            y={22}
            textAnchor="middle"
            fill="#F5C518"
            style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: 12, letterSpacing: '0.18em' }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 22 }}
            transition={{ duration: 0.3 }}
          >
            {slot.kind.toUpperCase()}
          </motion.text>
        )}

        {/* The cursor. `left`/`top` in viewBox units, animated, so the travel is
            visible rather than a jump between corners. */}
        <motion.g
          animate={{ x: cursor.x, y: cursor.y }}
          transition={{
            duration: phase === 'travel' ? STEP.travel / 1000 : STEP.drag / 1000,
            ease: phase === 'travel' ? [0.22, 1, 0.36, 1] : 'easeInOut',
          }}
        >
          <motion.path
            d="M0 0 L0 15 L4 11.5 L6.6 17 L9.3 15.8 L6.7 10.4 L12 10.4 Z"
            fill="#ffffff"
            stroke="#0b1020"
            strokeWidth={1.2}
            strokeLinejoin="round"
            animate={{ scale: phase === 'press' ? 0.82 : 1 }}
            transition={{ duration: 0.14 }}
            style={{ transformBox: 'fill-box', transformOrigin: 'top left' }}
          />
        </motion.g>
      </svg>
    </div>
  );
}
