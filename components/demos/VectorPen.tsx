'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { animate, motion } from 'framer-motion';
import type { AnimationPlaybackControls } from 'framer-motion';
import { useDemo } from './demo-kit';

/*
 * The pen tool: points placed one at a time, then the curve handed over.
 *
 * ── The order matters ───────────────────────────────────────────────────────
 *
 * Move, click, *then* the point. The cursor flies to where the next anchor will
 * be and nothing happens until it presses; the anchor and the segment behind it
 * arrive on the click, not on the approach.
 *
 * This used to place the point and move the cursor from the same instant, so the
 * anchor appeared under a pen that was still travelling and the segment drew
 * itself out of an empty canvas. It read as the drawing happening *to* the
 * cursor rather than because of it, which is the opposite of what a pen tool is.
 * Nothing here should ever land before the press that causes it.
 *
 * ── The morph is a morph ────────────────────────────────────────────────────
 *
 * `curved` blends every segment from a straight run to its full bezier, and it
 * is *animated* from 0 to 1 rather than set. It was a single assignment before,
 * so the polyline snapped into a curve between two frames with nothing to watch:
 * the interesting part of a pen tool, the moment straight lines become curves,
 * was happening in the gap between one render and the next. It now eases over a
 * second, and because the handle arms are drawn at `cx * curved` they grow out
 * of the anchors as it goes rather than appearing at full length.
 *
 * ── Then it stops being a demo ──────────────────────────────────────────────
 *
 * The handles are draggable, and the first time anyone touches one the scripted
 * part shuts down for good — you are editing the curve, not watching one be
 * edited. That is a different claim from the other two features on this page,
 * and worth the extra code.
 *
 * ── Why the geometry lives in one place ─────────────────────────────────────
 *
 * `ANCHORS` holds each point and its outgoing control offset. The segments, the
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

/** Where the pen waits before the first move. */
const START = { x: 70, y: 350 };

const STEP = {
  lead: 520,
  /** Cursor flight to the next anchor. */
  travel: 640,
  /** The press itself. The point lands at the end of this, not the start. */
  press: 180,
  /** A beat after a point lands, before the pen sets off again. */
  settle: 300,
  handles: 640,
  morph: 1000,
  hold: 2800,
};

/** One segment, blended between straight and fully curved. */
function segment(a: Point, b: Point, curved: number) {
  const c1x = a.x + a.cx * curved;
  const c1y = a.y + a.cy * curved;
  const c2x = b.x - b.cx * curved;
  const c2y = b.y - b.cy * curved;
  return `M${a.x},${a.y} C${c1x},${c1y} ${c2x},${c2y} ${b.x},${b.y}`;
}

export function VectorPen() {
  const { ref, active } = useDemo();
  const svg = useRef<SVGSVGElement>(null);
  const morph = useRef<AnimationPlaybackControls | null>(null);

  const [points, setPoints] = useState<Point[]>(() => ANCHORS.map((a) => ({ ...a })));
  /*
   * Opens on the finished curve rather than on an empty grid. A demo the
   * governor has not granted a slot to has to hold a composed still frame, and
   * "nothing drawn yet" is not one.
   */
  const [placed, setPlaced] = useState<number>(ANCHORS.length);
  const [curved, setCurved] = useState(1);
  const [showHandles, setShowHandles] = useState(true);
  const [cursor, setCursor] = useState<{ x: number; y: number }>(START);
  const [pressing, setPressing] = useState(false);
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
    setPressing(false);
    setCursor(START);
    setPoints(ANCHORS.map((a) => ({ ...a })));

    t += STEP.lead;

    ANCHORS.forEach((anchor, i) => {
      // Fly there.
      timers.push(setTimeout(() => setCursor({ x: anchor.x, y: anchor.y }), t));
      t += STEP.travel;

      // Press.
      timers.push(setTimeout(() => setPressing(true), t));
      t += STEP.press;

      // Only now does the anchor exist, and the segment behind it draw.
      timers.push(
        setTimeout(() => {
          setPressing(false);
          setPlaced(i + 1);
        }, t)
      );
      t += STEP.settle;
    });

    t += STEP.handles;
    timers.push(setTimeout(() => setShowHandles(true), t));
    t += 180;

    timers.push(
      setTimeout(() => {
        // Driven rather than assigned: this is the moment the section exists to
        // show, and it cannot happen between two frames.
        morph.current = animate(0, 1, {
          duration: STEP.morph / 1000,
          ease: [0.22, 1, 0.36, 1],
          onUpdate: setCurved,
        });
      }, t)
    );

    t += STEP.morph + STEP.hold;
    timers.push(setTimeout(() => setCycle((c) => c + 1), t));

    return () => {
      timers.forEach(clearTimeout);
      morph.current?.stop();
      morph.current = null;
    };
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
    // A morph still running would keep writing over the curve being dragged.
    morph.current?.stop();
    morph.current = null;
    setTaken(true);
    setPlaced(ANCHORS.length);
    setShowHandles(true);
    setCurved(1);
    setPressing(false);
    setDragging({ index, side });
  };

  const penGone = placed >= points.length && curved > 0.999;

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
            {/*
              `userSpaceOnUse`, not the default. The curve is drawn as one path
              per segment now, and an object-bounding-box gradient would restart
              on each of them — four little rainbows instead of one sweep across
              the whole curve.
            */}
            <linearGradient id="fx-pen-stroke" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={W} y2="0">
              <stop offset="0%" stopColor="#F5C518" />
              <stop offset="55%" stopColor="#E86A9B" />
              <stop offset="100%" stopColor="#5B8DEF" />
            </linearGradient>
          </defs>

          <rect width={W} height={H} fill="url(#fx-pen-grid)" />

          {/*
            One path per segment, each drawing itself in on the click that
            created it. A single path for the whole curve cannot do that: its `d`
            would grow by a whole segment in one frame, and there is no way to
            draw on only the part that is new.
          */}
          {points.slice(0, Math.max(0, placed - 1)).map((_, i) => (
            <motion.path
              key={`s-${i}`}
              d={segment(points[i], points[i + 1], curved)}
              fill="none"
              stroke="url(#fx-pen-stroke)"
              strokeWidth={5}
              strokeLinecap="round"
              initial={{ pathLength: taken ? 1 : 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
          ))}

          {/* Handles: the arms, then the grips at their ends. Both are drawn at
              `cx * curved`, so they grow out of the anchor as the curve forms
              instead of arriving at full length. */}
          {showHandles &&
            points.slice(0, placed).map((p, i) => (
              <motion.g key={`h-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
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
              </motion.g>
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
              animate={{ x: cursor.x, y: cursor.y, opacity: penGone ? 0 : 1 }}
              transition={{
                x: { duration: STEP.travel / 1000, ease: [0.4, 0, 0.2, 1] },
                y: { duration: STEP.travel / 1000, ease: [0.4, 0, 0.2, 1] },
                opacity: { duration: 0.4 },
              }}
            >
              {/* The click, as a ring leaving the tip. Without it the press is a
                  180ms pause that looks like the animation stalling. */}
              <motion.circle
                cx={0}
                cy={0}
                r={16}
                fill="none"
                stroke="#F5C518"
                strokeWidth={2.5}
                initial={false}
                animate={pressing ? { scale: [0.25, 1.3], opacity: [0.95, 0] } : { scale: 0.25, opacity: 0 }}
                transition={{ duration: (STEP.press + 120) / 1000, ease: 'easeOut' }}
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              />

              <motion.path
                d="M0 0 L0 26 L7 20 L11.5 29.5 L16.5 27.5 L11.7 18.2 L21 18.2 Z"
                fill="#ffffff"
                stroke="#0b1020"
                strokeWidth={1.6}
                strokeLinejoin="round"
                animate={{ scale: pressing ? 0.84 : 1 }}
                transition={{ duration: 0.14, ease: 'easeOut' }}
                // The tip is the path's own origin, so scaling about the top
                // left of its box presses the nib into the canvas rather than
                // shrinking the whole pen towards its middle.
                style={{ transformBox: 'fill-box', transformOrigin: '0% 0%' }}
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
