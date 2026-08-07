'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { cappedPixelRatio } from '@/lib/render-gate';
import { useAmbient, scaleForTier } from '@/lib/motion';
import { DEMO_PRIORITY } from './demo-kit';
import type { Controls, Preset, Shape } from './particle-config';

/*
 * A live particle emitter (immersionmilestones.md I8).
 *
 * Canvas 2D rather than WebGL. The homepage already runs two WebGL contexts —
 * the hero shader and the carousel — and a few hundred flat sprites is exactly
 * the workload canvas 2D is good at. It also means this costs no three.js.
 *
 * Controls are React state so the sliders show their values, mirrored into a
 * ref that the simulation reads. Without the mirror the loop would close over
 * the values from the render it started in and quietly ignore every change.
 */

interface Recipe {
  /** Downward acceleration, px/s². Negative rises. */
  gravity: number;
  drag: number;
  /** Base launch speed before the speed control. */
  launch: number;
  life: [number, number];
  size: [number, number];
  colours: string[];
  /** Fire and magic read better added together than painted over. */
  additive: boolean;
  /** Growth per second, as a multiplier. Smoke swells, fire shrinks. */
  swell: number;
  spin: number;
  /** Emitted from a point at the base, or across the floor. */
  from: 'point' | 'wide';
}

const RECIPES: Record<Preset, Recipe> = {
  confetti: {
    gravity: 620,
    drag: 0.36,
    launch: 780,
    life: [1.6, 2.8],
    size: [5, 12],
    colours: ['#F5C518', '#F97362', '#7C5CBF', '#2D6BE4', '#4ADE80', '#E6EDF3', '#FB7185'],
    additive: false,
    swell: 1,
    spin: 7,
    from: 'point',
  },
  fire: {
    gravity: -260,
    drag: 1.5,
    launch: 300,
    life: [0.5, 1.1],
    size: [10, 26],
    colours: ['#FFE27A', '#FFB020', '#F97316', '#EA580C', '#B91C1C'],
    additive: true,
    swell: 0.35,
    spin: 1,
    from: 'wide',
  },
  smoke: {
    gravity: -70,
    drag: 0.9,
    launch: 170,
    life: [2.2, 4],
    size: [16, 40],
    colours: ['rgba(200,208,220,1)', 'rgba(150,160,178,1)', 'rgba(110,120,140,1)'],
    additive: false,
    swell: 2.4,
    spin: 0.6,
    from: 'wide',
  },
  magic: {
    gravity: 90,
    drag: 0.7,
    launch: 520,
    life: [1.2, 2.4],
    size: [4, 10],
    colours: ['#F5C518', '#C084FC', '#7C5CBF', '#E6EDF3', '#38BDF8'],
    additive: true,
    swell: 0.8,
    spin: 4,
    from: 'point',
  },
};

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; max: number;
  size: number; rot: number; vrot: number;
  colour: string;
  /** Fixed per particle so tumble and twinkle are stable, not jittery. */
  seed: number;
}

/** Cap on live particles. Scaled down on weak hardware — see device-tier. */
const MAX_PARTICLES = 1400;

function drawShape(ctx: CanvasRenderingContext2D, shape: Shape, s: number, seed: number) {
  switch (shape) {
    case 'circle':
      ctx.beginPath();
      ctx.arc(0, 0, s / 2, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'triangle':
      ctx.beginPath();
      ctx.moveTo(0, -s / 2);
      ctx.lineTo(s / 2, s / 2);
      ctx.lineTo(-s / 2, s / 2);
      ctx.closePath();
      ctx.fill();
      break;
    case 'ribbon':
      // Squashed on one axis and tumbling, which is what makes real confetti
      // flash as it turns.
      ctx.fillRect(-s / 2, -s / 6, s, s / 3);
      break;
    case 'star': {
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const r = i % 2 ? s / 4.6 : s / 2;
        const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
        const fn = i ? ctx.lineTo : ctx.moveTo;
        fn.call(ctx, Math.cos(a) * r, Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.fill();
      break;
    }
    default:
      ctx.fillRect(-s / 2, -s / 2, s, s * (0.6 + (seed % 5) / 10));
  }
}

export function ParticleStudio({
  controls,
  className,
}: {
  controls: Controls;
  className?: string;
}) {
  const { ref, active } = useAmbient<HTMLDivElement>({ priority: DEMO_PRIORITY });
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  // The loop reads this, not the prop: a rAF closure captures the values from
  // the render that started it and would ignore every later change.
  const live = useRef(controls);
  live.current = controls;
  const activeRef = useRef(active);
  activeRef.current = active;
  /** Wakes the loop. Set by the mount effect, called when a grant arrives. */
  const wake = useRef<(() => void) | null>(null);

  useEffect(() => {
    const el = host.current;
    const cv = canvas.current;
    const ctx = cv?.getContext('2d');
    if (!el || !cv || !ctx) return;

    let w = 1;
    let h = 1;
    let dpr = cappedPixelRatio();

    const resize = () => {
      const r = el.getBoundingClientRect();
      w = Math.max(1, r.width);
      h = Math.max(1, r.height);
      dpr = cappedPixelRatio();
      cv.width = Math.floor(w * dpr);
      cv.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    const cap = scaleForTier(MAX_PARTICLES, 220);
    const pool: Particle[] = [];
    let carry = 0;
    let frame = 0;
    let last = 0;
    let running = false;

    const spawn = (c: Controls, r: Recipe) => {
      if (pool.length >= cap) return;
      const seed = pool.length + Math.floor(carry * 1000);
      // A cone opening upward: 90° is straight up in screen terms.
      const half = (c.spread * Math.PI) / 180 / 2;
      const a = -Math.PI / 2 + (Math.random() * 2 - 1) * half;
      const v = r.launch * c.speed * (0.65 + Math.random() * 0.6);
      const originX = r.from === 'point' ? w / 2 : w * (0.5 + (Math.random() - 0.5) * 0.34);

      pool.push({
        x: originX + (Math.random() - 0.5) * (r.from === 'point' ? 14 : 40),
        y: h * 0.93,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v,
        life: 0,
        max: r.life[0] + Math.random() * (r.life[1] - r.life[0]),
        size: (r.size[0] + Math.random() * (r.size[1] - r.size[0])) * c.size,
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * r.spin,
        colour: r.colours[Math.floor(Math.random() * r.colours.length)],
        seed,
      });
    };

    const tick = (now: number) => {
      if (!last) last = now;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const c = live.current;
      const r = RECIPES[c.preset];

      carry += c.rate * dt;
      while (carry >= 1) {
        spawn(c, r);
        carry -= 1;
      }

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = r.additive ? 'lighter' : 'source-over';

      for (let i = pool.length - 1; i >= 0; i--) {
        const p = pool[i];
        p.life += dt;
        if (p.life >= p.max || p.y > h + 80) {
          pool.splice(i, 1);
          continue;
        }

        p.vy += r.gravity * dt;
        p.vx -= p.vx * r.drag * dt;
        p.vy -= p.vy * r.drag * dt * 0.4;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rot += p.vrot * dt;

        const u = p.life / p.max;
        // Fade in fast, out slow — a particle that appears at full opacity
        // reads as a pop rather than an emission.
        const alpha = Math.min(1, u * 12) * (1 - u * u);
        const size = p.size * (1 + (r.swell - 1) * u);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = alpha * (c.preset === 'smoke' ? 0.32 : 1);
        ctx.fillStyle = p.colour;
        drawShape(ctx, c.shape, size, p.seed);
        ctx.restore();
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';

      if (activeRef.current || pool.length) {
        frame = requestAnimationFrame(tick);
      } else {
        running = false;
        last = 0;
      }
    };

    wake.current = () => {
      if (running) return;
      running = true;
      last = 0;
      frame = requestAnimationFrame(tick);
    };
    if (activeRef.current) wake.current();

    return () => {
      wake.current = null;
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
    /*
     * Mount-only. Depending on `active` would tear down the canvas, the
     * observer and every live particle each time the section crossed the
     * viewport edge; the loop already parks itself and the effect below wakes
     * it.
     */
  }, []);

  useEffect(() => {
    if (active) wake.current?.();
  }, [active]);

  return (
    <div ref={ref} className={className}>
      <div ref={host} className="absolute inset-0">
        <canvas ref={canvas} className="absolute inset-0 w-full h-full" />
      </div>
    </div>
  );
}

