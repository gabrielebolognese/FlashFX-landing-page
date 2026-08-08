'use client';

import { useEffect, useRef, useState } from 'react';
import { cappedPixelRatio } from '@/lib/render-gate';
import { scaleForTier } from '@/lib/motion';
import { useDemo } from './demo-kit';

/*
 * Six hundred squares, arranging themselves into ten different animations.
 *
 * ── The one idea this is built on ───────────────────────────────────────────
 *
 * A formation is not a set of positions. It is a *function of time*: given a
 * square's index and the clock, it returns where that square is now, how big it
 * is, how it is turned and how bright it is.
 *
 * That single decision is what makes this hypnotic rather than a slideshow of
 * shapes. A formation is already moving before the morph starts and is still
 * moving after it ends, and during the crossing both are evaluated live and
 * blended — so a rotating kaleidoscope becomes a travelling waveform without
 * either of them ever holding still. There is no keyframe anywhere in the file.
 *
 * ── Squares, not points ─────────────────────────────────────────────────────
 *
 * Each one is a real square with its own size and rotation, drawn through a
 * single `setTransform` with the scale baked into the matrix — one state change
 * and one `fillRect` per square, instead of the save/translate/rotate/restore
 * quartet that would cost four.
 *
 * ── Canvas 2D, and only 2D ──────────────────────────────────────────────────
 *
 * No projection, no depth. Formations work in a space where y runs −1..1 and x
 * runs −aspect..+aspect, so "full width" is a coordinate rather than a guess,
 * and the waveform and ribbon genuinely span the frame at any window size.
 */

/** Held, then crossed. The crossing is the brief's 1200 ms. */
const HOLD = 2200;
const MORPH = 1200;

const COUNT = 620;

/*
 * Six colours, and every arm count below is a multiple of six on purpose: with
 * `arm = i % arms` and `colour = i % 6`, a 6-fold kaleidoscope gives each arm a
 * single colour and a 12-fold alternates two per arm. The symmetry comes out of
 * the arithmetic rather than being painted on.
 */
const BUCKETS = ['#F5C518', '#FFD866', '#7C5CBF', '#5B8DEF', '#4ADE80', '#E6EDF3'];

const TAU = Math.PI * 2;
/** Golden angle, for the phyllotaxis spiral. */
const GOLDEN = Math.PI * (3 - Math.sqrt(5));

type Sq = { x: number; y: number; s: number; r: number; a: number };

/**
 * A formation: fills `out` for square `i` at time `t`.
 *
 * `k` is the index normalised to 0..1, `ar` the half-width in the same units as
 * y, so a formation that wants the full frame reaches ±ar.
 */
type Formation = (out: Sq, i: number, n: number, k: number, t: number, ar: number) => void;

const FORMATIONS: { name: string; fn: Formation }[] = [
  {
    name: 'grid',
    fn: (o, i, n, k, t, ar) => {
      const cols = Math.max(8, Math.round(Math.sqrt(n * ar)));
      const rows = Math.ceil(n / cols);
      const cx = i % cols;
      const cy = Math.floor(i / cols);
      o.x = ((cx / (cols - 1)) - 0.5) * 2 * ar * 0.96;
      o.y = ((cy / Math.max(1, rows - 1)) - 0.5) * 1.6;
      // A wave crossing the grid diagonally, so it breathes rather than pulses.
      const w = Math.sin(t * 1.6 - cx * 0.34 - cy * 0.26);
      o.s = 0.026 + w * 0.011;
      o.r = w * 0.5;
      o.a = 0.5 + w * 0.32;
    },
  },
  {
    name: 'waveform',
    fn: (o, i, n, k, t, ar) => {
      /*
       * A proper equaliser: columns spanning the full width, each with its own
       * amplitude, squares stacked outward from the centre line. A square past
       * its column's current amplitude does not disappear — it dims and shrinks,
       * which is what gives the bars a soft head instead of a hard edge.
       */
      const perCol = 9;
      const cols = Math.ceil(n / perCol);
      const c = i % cols;
      const j = Math.floor(i / cols);
      const u = c / (cols - 1);
      const amp =
        0.34 * Math.sin(t * 2.1 + u * 9) +
        0.24 * Math.sin(t * 3.4 - u * 15) +
        0.18 * Math.sin(t * 1.3 + u * 4);
      const level = Math.abs(amp) + 0.14;
      const slot = ((j % perCol) - (perCol - 1) / 2) * 0.13;
      const reach = Math.abs(slot);
      const inside = reach <= level;
      o.x = (u - 0.5) * 2 * ar * 0.97;
      o.y = slot;
      o.s = inside ? 0.03 : 0.014;
      o.r = 0;
      o.a = inside ? 0.95 : 0.12;
    },
  },
  {
    name: 'kaleidoscope · 6',
    fn: (o, i, n, k, t, ar) => {
      const arms = 6;
      const arm = i % arms;
      const idx = Math.floor(i / arms);
      const total = Math.ceil(n / arms);
      const rad = 0.1 + (idx / total) * 0.86;
      // The twist is what makes it a kaleidoscope rather than a wheel: the arm
      // bends by an amount that depends on how far out you are.
      const a = arm * (TAU / arms) + t * 0.55 + Math.sin(rad * 5.5 - t * 1.3) * 0.55;
      o.x = Math.cos(a) * rad * ar * 0.92;
      o.y = Math.sin(a) * rad;
      o.s = 0.03 - rad * 0.012 + Math.sin(rad * 9 - t * 2.4) * 0.008;
      o.r = a + t;
      o.a = 0.55 + Math.sin(rad * 7 - t * 2) * 0.35;
    },
  },
  {
    name: 'kaleidoscope · 12',
    fn: (o, i, n, k, t, ar) => {
      const arms = 12;
      const arm = i % arms;
      const idx = Math.floor(i / arms);
      const total = Math.ceil(n / arms);
      const rad = 0.08 + Math.pow(idx / total, 0.78) * 0.9;
      // Counter-rotating against the 6-fold, so consecutive formations do not
      // read as the same thing twice.
      const a = arm * (TAU / arms) - t * 0.42 + Math.cos(rad * 7 + t) * 0.42;
      o.x = Math.cos(a) * rad * ar * 0.9;
      o.y = Math.sin(a) * rad;
      o.s = 0.024 - rad * 0.008;
      o.r = -a * 2 + t * 1.4;
      o.a = 0.4 + Math.cos(rad * 10 + t * 1.6) * 0.4;
    },
  },
  {
    name: 'mandala',
    fn: (o, i, n, k, t, ar) => {
      /* A kaleidoscope whose arms are themselves petals: the radius is a
         function of the angle, so the silhouette is a flower that turns. */
      const arms = 18;
      const arm = i % arms;
      const idx = Math.floor(i / arms);
      const total = Math.ceil(n / arms);
      const base = arm * (TAU / arms) + t * 0.3;
      /* 0.54 + 0.30 peaks at 0.84, and 0.12 + 0.84 = 0.96 — just inside the
         frame. At 0.62 + 0.34 it reached 1.08 and the outer petals were being
         clipped off the top and bottom of the canvas. */
      const petal = 0.54 + 0.3 * Math.sin(base * 3 + t * 0.9);
      const rad = 0.12 + (idx / total) * petal;
      o.x = Math.cos(base) * rad * ar * 0.94;
      o.y = Math.sin(base) * rad;
      o.s = 0.026 * (1 - rad * 0.4);
      o.r = base * 3 - t;
      o.a = 0.35 + (rad / petal) * 0.6;
    },
  },
  {
    name: 'spiral',
    fn: (o, i, n, k, t, ar) => {
      const a = i * GOLDEN + t * 0.5;
      const rad = Math.sqrt(k) * 0.95;
      o.x = Math.cos(a) * rad * ar * 0.9;
      o.y = Math.sin(a) * rad;
      o.s = 0.008 + (1 - rad) * 0.026;
      o.r = a;
      o.a = 0.3 + (1 - rad) * 0.65;
    },
  },
  {
    name: 'rings',
    fn: (o, i, n, k, t, ar) => {
      const rings = 8;
      const ring = i % rings;
      const idx = Math.floor(i / rings);
      const total = Math.ceil(n / rings);
      const dir = ring % 2 === 0 ? 1 : -1;
      const a = (idx / total) * TAU + t * 0.45 * dir;
      const rad = 0.14 + ring * 0.105;
      o.x = Math.cos(a) * rad * ar * 0.9;
      o.y = Math.sin(a) * rad;
      o.s = 0.022 + Math.sin(t * 2 + ring) * 0.006;
      o.r = a * dir + t;
      o.a = 0.4 + (ring / rings) * 0.5;
    },
  },
  {
    name: 'ribbon',
    fn: (o, i, n, k, t, ar) => {
      /* A Lissajous figure drawn across the whole frame — the other full-width
         formation, and the one that reads as a single continuous line. */
      const u = k * TAU;
      o.x = Math.sin(u * 3 + t * 0.6) * ar * 0.94;
      o.y = Math.sin(u * 2 + t * 0.35) * 0.84;
      o.s = 0.017 + Math.sin(u * 6 - t * 2) * 0.008;
      o.r = u * 2 + t;
      o.a = 0.45 + Math.sin(u * 4 + t) * 0.4;
    },
  },
  {
    name: 'ripple',
    fn: (o, i, n, k, t, ar) => {
      const cols = Math.max(8, Math.round(Math.sqrt(n * ar)));
      const rows = Math.ceil(n / cols);
      const cx = i % cols;
      const cy = Math.floor(i / cols);
      const x = ((cx / (cols - 1)) - 0.5) * 2 * ar * 0.96;
      const y = ((cy / Math.max(1, rows - 1)) - 0.5) * 1.6;
      const d = Math.sqrt(x * x + y * y);
      // A wave travelling out from the centre, displacing and resizing as it
      // passes — the grid, but disturbed.
      const w = Math.sin(d * 7 - t * 3);
      o.x = x + (x / (d || 1)) * w * 0.045;
      o.y = y + (y / (d || 1)) * w * 0.045;
      o.s = 0.024 + w * 0.013;
      o.r = w * 0.9;
      o.a = 0.4 + w * 0.4;
    },
  },
  {
    name: 'tunnel',
    fn: (o, i, n, k, t, ar) => {
      /* Concentric squares scaling outward for ever. Each ring's scale wraps on
         a sawtooth, so rings appear at the centre and leave at the edge without
         the sequence ever restarting. */
      const layers = 10;
      const layer = i % layers;
      const idx = Math.floor(i / layers);
      const total = Math.ceil(n / layers);
      const p = ((layer / layers + t * 0.16) % 1 + 1) % 1;
      /*
       * Travel stops exactly at the frame edge rather than past it, and the
       * alpha below reaches zero at the same moment. Sending them further —
       * 1.18 was the first attempt — meant a square crossed the edge at p≈0.92
       * while still 40% opaque, and got sliced by the canvas boundary instead of
       * fading out of it. Arriving and vanishing together reads as depth; being
       * cut in half reads as a bug.
       */
      const rad = Math.pow(p, 1.7);
      const side = idx / total;
      // Walk the perimeter of a square rather than a circle.
      const q = side * 4;
      const e = Math.floor(q);
      const f = q - e;
      const sx = e === 0 ? -1 + f * 2 : e === 1 ? 1 : e === 2 ? 1 - f * 2 : -1;
      const sy = e === 0 ? -1 : e === 1 ? -1 + f * 2 : e === 2 ? 1 : 1 - f * 2;
      o.x = sx * rad * ar * 0.92;
      o.y = sy * rad;
      o.s = 0.006 + p * 0.03;
      o.r = t * 0.8 + p * 2;
      // In fast, out to nothing: `p^5` stays near 1 for most of the travel and
      // then collapses, so the fade happens entirely at the frame edge.
      o.a = Math.min(1, p * 4) * Math.max(0, 1 - Math.pow(p, 5));
    },
  },
];

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function ProceduralMorph() {
  const { ref, active } = useDemo();
  const canvas = useRef<HTMLCanvasElement>(null);
  const [label, setLabel] = useState(FORMATIONS[0].name);
  // The loop reads this; a rAF closure captures the value from the render that
  // started it and would never see a change.
  const live = useRef(active);
  live.current = active;

  useEffect(() => {
    const cv = canvas.current;
    if (!cv) return;
    const g = cv.getContext('2d');
    if (!g) return;

    const n = scaleForTier(COUNT, 220);

    /* Scratch objects, reused every frame for every square. Allocating two per
       square per frame would hand the collector 74,000 objects a second. */
    const A: Sq = { x: 0, y: 0, s: 0, r: 0, a: 0 };
    const B: Sq = { x: 0, y: 0, s: 0, r: 0, a: 0 };

    // Fixed per square, so each keeps its colour and its stagger for life.
    const stagger = new Float32Array(n);
    const seed = rng(1337);
    for (let i = 0; i < n; i++) stagger[i] = seed() * 0.4;

    let index = 0;
    let previous = 0;
    let morphStart = -MORPH * 2;
    let w = 0;
    let h = 0;
    let dpr = 1;

    const resize = () => {
      const rect = cv.getBoundingClientRect();
      dpr = cappedPixelRatio();
      const nw = Math.max(1, Math.floor(rect.width * dpr));
      const nh = Math.max(1, Math.floor(rect.height * dpr));
      if (nw === w && nh === h) return;
      w = nw;
      h = nh;
      cv.width = w;
      cv.height = h;
    };
    resize();

    let raf = 0;
    let last = 0;
    let clock = 0;
    const easeInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!last) last = now;
      const dt = Math.min(64, now - last);
      last = now;
      resize();

      /*
       * Without a governor grant the clock simply stops advancing. The frame
       * already drawn stays on screen — `active: false` means a still frame,
       * never an empty one.
       */
      if (live.current) {
        clock += dt;
        if (clock - morphStart > HOLD + MORPH) {
          morphStart = clock;
          previous = index;
          index = (index + 1) % FORMATIONS.length;
          setLabel(FORMATIONS[index].name);
        }
      }

      const t = clock / 1000;
      const raw = (clock - morphStart) / MORPH;
      const fromFn = FORMATIONS[previous].fn;
      const toFn = FORMATIONS[index].fn;

      g.setTransform(1, 0, 0, 1, 0, 0);
      g.clearRect(0, 0, w, h);
      g.globalCompositeOperation = 'lighter';

      const cx = w / 2;
      const cy = h / 2;
      // y spans −1..1 over the height; x reaches ±ar, so ±ar is the frame edge.
      const unit = h / 2;
      const ar = w / h;

      for (let b = 0; b < BUCKETS.length; b++) {
        g.fillStyle = BUCKETS[b];
        for (let i = b; i < n; i += BUCKETS.length) {
          const k = i / (n - 1);

          // Both formations are evaluated at the *current* time, so neither
          // freezes while the crossing happens.
          toFn(A, i, n, k, t, ar);
          const p = Math.max(0, Math.min(1, (raw - stagger[i]) / (1 - stagger[i])));

          let x = A.x;
          let y = A.y;
          let s = A.s;
          let r = A.r;
          let a = A.a;

          if (p < 1) {
            fromFn(B, i, n, k, t, ar);
            const e = easeInOut(p);
            x = B.x + (A.x - B.x) * e;
            y = B.y + (A.y - B.y) * e;
            s = B.s + (A.s - B.s) * e;
            r = B.r + (A.r - B.r) * e;
            a = B.a + (A.a - B.a) * e;
          }

          const size = Math.max(1, s * unit);
          const co = Math.cos(r) * size;
          const si = Math.sin(r) * size;

          // Scale baked into the matrix: one state change and one fill per
          // square, rather than save/translate/rotate/restore.
          g.globalAlpha = Math.max(0, Math.min(1, a));
          g.setTransform(co, si, -si, co, cx + x * unit, cy + y * unit);
          g.fillRect(-0.5, -0.5, 1, 1);
        }
      }

      g.setTransform(1, 0, 0, 1, 0, 0);
      g.globalAlpha = 1;
      g.globalCompositeOperation = 'source-over';
    };

    raf = requestAnimationFrame(frame);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div ref={ref} className="relative w-full h-full">
      <canvas ref={canvas} className="absolute inset-0 w-full h-full" />
      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-[11px] tracking-widest uppercase text-fx-text-secondary/70">
        {label}
      </span>
    </div>
  );
}
