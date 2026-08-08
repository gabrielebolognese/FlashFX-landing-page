'use client';

import { useEffect, useRef, useState } from 'react';
import { cappedPixelRatio } from '@/lib/render-gate';
import { scaleForTier } from '@/lib/motion';
import { useDemo } from './demo-kit';

/*
 * One cloud of points, becoming eight different things.
 *
 * A cube splits into four, the four shrink into a hundred, and the hundred
 * reassemble as a bowling pin, a phone, a lightning bolt and the wordmark before
 * collapsing back to where they started. Nothing is keyframed: every shape is a
 * function that returns N positions, and the animation is the cloud easing from
 * one function's output to the next. That is what makes it procedural rather
 * than a sequence of drawings, and it is the argument the section is making.
 *
 * ── Canvas 2D, not three.js ─────────────────────────────────────────────────
 *
 * The points are projected by hand. three.js would be a 150 kB chunk to draw
 * what amounts to a thousand rectangles, and the site already keeps it out of
 * everything except the A380 viewer (performancemilestones.md P5).
 *
 * ── Two things that keep it fast ────────────────────────────────────────────
 *
 * Points are drawn in colour buckets. Setting `fillStyle` a thousand times a
 * frame costs more than the drawing does, so the cloud is split into six fixed
 * groups and each is drawn in a single pass with one state change.
 *
 * Shapes are generated once, at mount, and cached. Sampling text out of an
 * offscreen canvas is far too expensive to do mid-morph.
 */

/** How long a shape is held, and how long the crossing between two takes. */
const HOLD = 2000;
const MORPH = 1250;

const POINTS = 1200;

/* Six buckets, mixed from the site palette. Points keep their colour through
   every morph, so the cloud stays recognisable as one object changing rather
   than a new object each time. */
const BUCKETS = ['#F5C518', '#FFD866', '#7C5CBF', '#2D6BE4', '#4ADE80', '#E6EDF3'];

const SHAPES = [
  'one cube',
  'four cubes',
  'four, smaller',
  'a hundred',
  'bowling pin',
  'phone',
  'lightning',
  'FlashFX',
] as const;

type Pt = { x: number; y: number; z: number };

/*
 * Seeded, because every shape must generate the same points on every call. A
 * cloud that reshuffles when a shape comes round again reads as a cut; the same
 * points returning to the same places reads as one object.
 */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Points scattered over the surface of an axis-aligned cube. */
function cube(n: number, size: number, cx: number, cy: number, cz: number, seed: number): Pt[] {
  const r = rng(seed);
  const out: Pt[] = [];
  const h = size / 2;
  for (let i = 0; i < n; i++) {
    const face = Math.floor(r() * 6);
    const u = (r() - 0.5) * size;
    const v = (r() - 0.5) * size;
    const p =
      face === 0 ? { x: h, y: u, z: v }
      : face === 1 ? { x: -h, y: u, z: v }
      : face === 2 ? { x: u, y: h, z: v }
      : face === 3 ? { x: u, y: -h, z: v }
      : face === 4 ? { x: u, y: v, z: h }
      : { x: u, y: v, z: -h };
    out.push({ x: p.x + cx, y: p.y + cy, z: p.z + cz });
  }
  return out;
}

/** N cubes on a lattice, sharing the point budget between them. */
function cubeGrid(n: number, cols: number, rows: number, deep: number, cell: number, size: number): Pt[] {
  const boxes = cols * rows * deep;
  const per = Math.max(4, Math.floor(n / boxes));
  const out: Pt[] = [];
  let seed = 7;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      for (let k = 0; k < deep; k++) {
        const cx = (i - (cols - 1) / 2) * cell;
        const cy = (j - (rows - 1) / 2) * cell;
        const cz = (k - (deep - 1) / 2) * cell;
        out.push(...cube(per, size, cx, cy, cz, (seed += 31)));
      }
    }
  }
  while (out.length < n) out.push(out[out.length % Math.max(1, out.length)] ?? { x: 0, y: 0, z: 0 });
  return out.slice(0, n);
}

/**
 * A solid of revolution from a radius profile — how the pin is built.
 *
 * `profile(t)` gives the radius at height t, so a bowling pin is four numbers
 * rather than a mesh. This is the most literally procedural thing here.
 */
function lathe(n: number, height: number, profile: (t: number) => number, seed: number): Pt[] {
  const r = rng(seed);
  const out: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const t = r();
    const a = r() * Math.PI * 2;
    const rad = profile(t);
    out.push({
      x: Math.cos(a) * rad,
      y: (t - 0.5) * height,
      z: Math.sin(a) * rad,
    });
  }
  return out;
}

/** A rounded slab: the phone. */
function slab(n: number, w: number, h: number, d: number, seed: number): Pt[] {
  const r = rng(seed);
  const out: Pt[] = [];
  for (let i = 0; i < n; i++) {
    // Most of the points on the two faces, the rest around the rim — a phone is
    // mostly screen, and scattering evenly over the whole surface loses that.
    const face = r();
    if (face < 0.8) {
      out.push({ x: (r() - 0.5) * w, y: (r() - 0.5) * h, z: (r() < 0.5 ? -1 : 1) * (d / 2) });
    } else if (face < 0.9) {
      out.push({ x: (r() < 0.5 ? -1 : 1) * (w / 2), y: (r() - 0.5) * h, z: (r() - 0.5) * d });
    } else {
      out.push({ x: (r() - 0.5) * w, y: (r() < 0.5 ? -1 : 1) * (h / 2), z: (r() - 0.5) * d });
    }
  }
  return out;
}

/**
 * Sample whatever is drawn on a 2D context into a point cloud.
 *
 * This is how the bolt and the wordmark are built: draw the shape once on an
 * offscreen canvas, read the alpha channel, and keep the pixels that are inside
 * it. It means the wordmark is generated from the same font the page uses rather
 * than traced by hand, and it costs nothing at runtime because it happens once.
 */
function sampleCanvas(
  n: number,
  draw: (g: CanvasRenderingContext2D, w: number, h: number) => void,
  scale: number,
  seed: number
): Pt[] {
  const W = 320;
  const H = 160;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const g = canvas.getContext('2d');
  if (!g) return [];

  g.clearRect(0, 0, W, H);
  g.fillStyle = '#fff';
  draw(g, W, H);

  const data = g.getImageData(0, 0, W, H).data;
  const hits: [number, number][] = [];
  for (let y = 0; y < H; y += 2) {
    for (let x = 0; x < W; x += 2) {
      if (data[(y * W + x) * 4 + 3] > 128) hits.push([x, y]);
    }
  }
  if (!hits.length) return [];

  const r = rng(seed);
  const out: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const [px, py] = hits[Math.floor(r() * hits.length)];
    out.push({
      x: (px / W - 0.5) * scale,
      y: -(py / H - 0.5) * scale * (H / W),
      // A little depth, so a flat shape still turns like an object.
      z: (r() - 0.5) * scale * 0.06,
    });
  }
  return out;
}

export function ProceduralMorph() {
  const { ref, active } = useDemo();
  const canvas = useRef<HTMLCanvasElement>(null);
  const [label, setLabel] = useState<string>(SHAPES[0]);
  // The loop reads this; a rAF closure would capture the value from the render
  // that started it and never see a change.
  const live = useRef(active);
  live.current = active;

  useEffect(() => {
    const cv = canvas.current;
    if (!cv) return;
    const g = cv.getContext('2d');
    if (!g) return;

    const n = scaleForTier(POINTS, 260);

    /* Every shape, generated once. */
    const shapes: Pt[][] = [
      cube(n, 150, 0, 0, 0, 1),
      cubeGrid(n, 2, 2, 1, 110, 88),
      cubeGrid(n, 2, 2, 1, 130, 52),
      cubeGrid(n, 5, 4, 5, 46, 22),
      lathe(n, 220, (t) => {
        // base → waist → shoulder → neck → head, as one expression
        const body = 46 * Math.sin(Math.PI * Math.min(1, t * 1.55)) + 10;
        const head = 26 * Math.exp(-Math.pow((t - 0.9) / 0.13, 2));
        return Math.max(9, Math.max(body * (1 - t * 0.55), head));
      }, 3),
      slab(n, 96, 190, 16, 5),
      sampleCanvas(
        n,
        (ctx, w, h) => {
          ctx.beginPath();
          ctx.moveTo(w * 0.56, h * 0.06);
          ctx.lineTo(w * 0.34, h * 0.55);
          ctx.lineTo(w * 0.48, h * 0.55);
          ctx.lineTo(w * 0.42, h * 0.96);
          ctx.lineTo(w * 0.68, h * 0.42);
          ctx.lineTo(w * 0.53, h * 0.42);
          ctx.lineTo(w * 0.63, h * 0.06);
          ctx.closePath();
          ctx.fill();
        },
        260,
        11
      ),
      sampleCanvas(
        n,
        (ctx, w, h) => {
          ctx.font = '700 74px var(--font-inter), Inter, system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('FlashFX', w / 2, h / 2);
        },
        300,
        13
      ),
    ];

    // A shape that produced nothing (a font that has not loaded, say) would
    // collapse the cloud to a point. Fall back to the cube rather than that.
    for (let i = 0; i < shapes.length; i++) {
      if (!shapes[i] || shapes[i].length < n) shapes[i] = shapes[0];
    }

    /* Working state: where each point is, and where it came from. */
    const cur: Pt[] = shapes[0].map((p) => ({ ...p }));
    const from: Pt[] = cur.map((p) => ({ ...p }));
    // Fixed per point, so a point keeps its colour and its stagger for life.
    const bucket = new Uint8Array(n);
    const stagger = new Float32Array(n);
    const seedR = rng(99);
    for (let i = 0; i < n; i++) {
      bucket[i] = i % BUCKETS.length;
      stagger[i] = seedR() * 0.35;
    }

    let index = 0;
    let morphStart = -MORPH;
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
    let angle = 0;
    let tilt = 0;
    let clock = 0;

    const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!last) last = now;
      const dt = Math.min(64, now - last);
      last = now;

      resize();

      /*
       * Held still rather than stopped dead when the governor withholds a slot:
       * the clock does not advance, so the cloud keeps whatever shape it had.
       * `active: false` means a still frame, never an empty one.
       */
      if (live.current) {
        clock += dt;
        angle += dt * 0.00035;
        tilt = Math.sin(clock * 0.00022) * 0.32;

        if (clock - morphStart > HOLD + MORPH) {
          morphStart = clock;
          index = (index + 1) % shapes.length;
          for (let i = 0; i < n; i++) {
            from[i].x = cur[i].x;
            from[i].y = cur[i].y;
            from[i].z = cur[i].z;
          }
          setLabel(SHAPES[index]);
        }
      }

      const target = shapes[index];
      const raw = (clock - morphStart) / MORPH;

      g.setTransform(1, 0, 0, 1, 0, 0);
      g.clearRect(0, 0, w, h);
      // Additive, so overlapping points build light instead of muddying.
      g.globalCompositeOperation = 'lighter';

      const cx = w / 2;
      const cy = h / 2;
      const scale = Math.min(w, h) / 420;
      const sinA = Math.sin(angle);
      const cosA = Math.cos(angle);
      const sinT = Math.sin(tilt);
      const cosT = Math.cos(tilt);

      for (let b = 0; b < BUCKETS.length; b++) {
        g.fillStyle = BUCKETS[b];
        for (let i = b; i < n; i += BUCKETS.length) {
          // Each point starts its crossing a little after the one before, which
          // is what makes a morph ripple through the cloud rather than snap.
          const p = Math.max(0, Math.min(1, (raw - stagger[i]) / (1 - stagger[i])));
          const e = easeInOut(p);

          const px = from[i].x + (target[i].x - from[i].x) * e;
          const py = from[i].y + (target[i].y - from[i].y) * e;
          const pz = from[i].z + (target[i].z - from[i].z) * e;
          cur[i].x = px;
          cur[i].y = py;
          cur[i].z = pz;

          // Y then X, by hand — a matrix library for two rotations is not worth
          // the bytes.
          const x1 = px * cosA + pz * sinA;
          const z1 = pz * cosA - px * sinA;
          const y1 = py * cosT - z1 * sinT;
          const z2 = z1 * cosT + py * sinT;

          const persp = 520 / (520 + z2);
          const sx = cx + x1 * persp * scale * dpr;
          const sy = cy + y1 * persp * scale * dpr;
          const size = Math.max(0.7, 2.1 * persp * scale * dpr);

          g.globalAlpha = 0.35 + persp * 0.5;
          g.fillRect(sx, sy, size, size);
        }
      }

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
