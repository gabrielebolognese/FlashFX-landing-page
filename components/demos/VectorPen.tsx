'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useDemo } from './demo-kit';

/*
 * The pen tool: points placed one at a time, then the curve handed over.
 *
 * A cursor walks the canvas dropping anchors, and the path extends to each new
 * one as it lands. When the last is placed the bezier handles fade in and the
 * curve eases from the straight polyline it was into the shape they describe.
 *
 * Then it stops being a demo. The handles are draggable, and the first time
 * anyone touches one the scripted part shuts down for good — you are editing the
 * curve, not watching one be edited. That is a different claim from the other
 * two features on this page, and worth the extra code.
 *
 * ── Why the geometry lives in one place ─────────────────────────────────────
 *
 * `ANCHORS` holds each point and its outgoing control offset. The path, the
 * handle positions and the hit targets are all derived from that one array, so a
 * drag updates a single number and everything follows. Storing the rendered path
 * separately is how these end up with handles that no longer sit on the curve.
 */

const W = 1200;
const H = 380;

/** Anchor points, with the control offset that leaves each one. */
const ANCHORS = [
  { x: 90, y: 300, cx: 120, cy: -120 },
  { x: 400, y: 150, cx: 130, cy: 130 },
  { x: 700, y: 280, cx: 120, cy: -140 },
  { x: 1010, y: 120, cx: 90, cy: 60 },
] as const;

type Point = { x: number; y: number; cx: number; cy: number };

const STEP = { first: 700, perPoint: 620, handles: 700, morph: 900, hold: 2600 };

/** A cubic through every placed point, using each one's control offsets. */
function toPath(pts: Point[], count: number, curved: number) {
  const use = pts.slice(0, count);
  if (use.length === 0) return '';
  let d = `M${use[0].x},${use[0].y}`;
  for (let i = 1; i < use.length; i++) {
    const a = use[i - 1];
    const b = use[i];
    // `curved` blends from a straight run to the full bezier, which is what
    // makes the morph a morph rather than a swap.
    const c1x = a.x + a.cx * curved;
    const c1y = a.y + a.cy * curved;
    const c2x = b.x - b.cx * curved;
    const c2y = b.y - b.cy * curved;
    d += ` C${c1x},${c1y} ${c2x},${c2y} ${b.x},${b.y}`;
  }
  return d;
}

export function VectorPen() {
  const { ref, active } = useDemo();
  const svg = useRef<SVGSVGElement>(null);

  const [points, setPoints] = useState<Point[]>(() => ANCHORS.map((a) => ({ ...a })));
  const [placed, setPlaced] = useState(0);
  const [curved, setCurved] = useState(0);
  const [showHandles, setShowHandles] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [dragging, setDragging] = useState<{ index: number; side: 1 | -1 } | null>(null);
  /* Once someone has touched a handle the scripted sequence never runs again —
     replaying it would drag their curve back out from under them. */
  const [taken, setTaken] = useState(false);

  useEffect(() => {
    if (!active || taken) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    let t = 0;

    setPlaced(0);
    setCurved(0);
    setShowHandles(false);
    setPoints(ANCHORS.map((a) => ({ ...a })));

    t += STEP.first;
    for (let i = 1; i <= ANCHORS.length; i++) {
      timers.push(setTimeout(() => setPlaced(i), t));
      t += STEP.perPoint;
    }

    t += STEP.handles;
    timers.push(setTimeout(() => setShowHandles(true), t));
    t += 260;
    timers.push(setTimeout(() => setCurved(1), t));

    t += STEP.morph + STEP.hold;
    timers.push(setTimeout(() => setCycle((c) => c + 1), t));

    return () => timers.forEach(clearTimeout);
  }, [active, cycle, taken]);

  /** Convert a pointer position into viewBox coordinates. */
  const toLocal = useCallback((e: PointerEvent | React.PointerEvent) => {
    const node = svg.current;
    if (!node) return null;
    const r = node.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * W,
      y: ((e.clientY - r.top) / r.height) * H,
    };
  }, []);

  useEffect(() => {
    if (!dragging) return;

    const move = (e: PointerEvent) => {
      const p = toLocal(e);
      if (!p) return;
      setPoints((prev) =>
        prev.map((pt, i) => {
          if (i !== dragging.index) return pt;
          // Dragging either handle moves the same control offset: the two are
          // mirrored, which is what keeps the curve smooth through the anchor.
          const cx = (p.x - pt.x) * dragging.side;
          const cy = (p.y - pt.y) * dragging.side;
          return { ...pt, cx, cy };
        })
      );
    };
    const up = () => setDragging(null);

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }, [dragging, toLocal]);

  const grab = (index: number, side: 1 | -1) => (e: React.PointerEvent) => {
    e.preventDefault();
    setTaken(true);
    setPlaced(ANCHORS.length);
    setShowHandles(true);
    setCurved(1);
    setDragging({ index, side });
  };

  const path = toPath(points, placed, curved);
  const cursorAt = placed > 0 ? points[Math.min(placed, points.length) - 1] : { x: 60, y: 340 };

  return (
    <div ref={ref} className="relative w-full">
      <div
        className="relative w-full overflow-hidden border-y border-fx-border"
        style={{ background: 'rgba(14, 21, 46, 0.6)' }}
      >
        <svg
          ref={svg}
          viewBox={`0 0 ${W} ${H}`}
          className="block w-full"
          style={{ height: 'clamp(240px, 34vw, 420px)', touchAction: 'none' }}
        >
          <defs>
            <pattern id="fx-pen-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0 L0 0 0 40" fill="none" stroke="rgba(230,237,243,0.05)" strokeWidth="1" />
            </pattern>
            <linearGradient id="fx-pen-stroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#F5C518" />
              <stop offset="55%" stopColor="#E86A9B" />
              <stop offset="100%" stopColor="#5B8DEF" />
            </linearGradient>
          </defs>

          <rect width={W} height={H} fill="url(#fx-pen-grid)" />

          {/* The curve. */}
          <motion.path
            d={path}
            fill="none"
            stroke="url(#fx-pen-stroke)"
            strokeWidth={5}
            strokeLinecap="round"
            animate={{ opacity: placed > 0 ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          />

          {/* Handles: the arms, then the grips at their ends. */}
          {showHandles &&
            points.slice(0, placed).map((p, i) => (
              <g key={`h-${i}`}>
                {([1, -1] as const).map((side) => {
                  const hx = p.x + p.cx * side * curved;
                  const hy = p.y + p.cy * side * curved;
                  // The first anchor has no incoming arm and the last no
                  // outgoing one; drawing them would imply curve that is not
                  // there.
                  if ((i === 0 && side === -1) || (i === points.length - 1 && side === 1)) return null;
                  return (
                    <g key={side}>
                      <line x1={p.x} y1={p.y} x2={hx} y2={hy} stroke="rgba(245,197,24,0.5)" strokeWidth={1.5} />
                      <circle
                        cx={hx}
                        cy={hy}
                        r={9}
                        fill={dragging?.index === i && dragging.side === side ? '#F5C518' : '#1b2650'}
                        stroke="#F5C518"
                        strokeWidth={2}
                        style={{ cursor: 'grab' }}
                        onPointerDown={grab(i, side)}
                      />
                      {/* A generous invisible target: a 9px circle is a hard
                          thing to hit with a finger. */}
                      <circle cx={hx} cy={hy} r={22} fill="transparent" style={{ cursor: 'grab' }} onPointerDown={grab(i, side)} />
                    </g>
                  );
                })}
              </g>
            ))}

          {/* Anchors. */}
          {points.slice(0, placed).map((p, i) => (
            <motion.rect
              key={`a-${i}`}
              x={p.x - 7}
              y={p.y - 7}
              width={14}
              height={14}
              rx={2}
              fill="#0b1020"
              stroke="#ffffff"
              strokeWidth={2.5}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            />
          ))}

          {/* The pen, while it is still placing points. */}
          {!taken && (
            <motion.g
              animate={{ x: cursorAt.x, y: cursorAt.y, opacity: placed >= points.length && curved === 1 ? 0 : 1 }}
              transition={{ x: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }, y: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.4 } }}
            >
              <path
                d="M0 0 L0 26 L7 20 L11.5 29.5 L16.5 27.5 L11.7 18.2 L21 18.2 Z"
                fill="#ffffff"
                stroke="#0b1020"
                strokeWidth={1.6}
                strokeLinejoin="round"
              />
            </motion.g>
          )}
        </svg>

        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-fx-text-secondary/70">
          {taken ? 'your curve now' : 'drag a handle to take over'}
        </span>
      </div>
    </div>
  );
}
