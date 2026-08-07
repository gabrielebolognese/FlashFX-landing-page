'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

/*
 * Easing curves as a rollercoaster (immersionmilestones.md I8, 2026-08-07).
 *
 * Replaced a scrollable column of small static curve charts. Charts describe an
 * easing; a coaster lets you feel one.
 *
 * ── The idea that makes it read ─────────────────────────────────────────────
 *
 * The track *is* the curve. The train advances at a constant rate horizontally
 * — equal time per unit of x — while its height follows the easing. So where
 * the curve is steep the train covers far more track per second and visibly
 * accelerates, and where it flattens it coasts.
 *
 * That is not a metaphor bolted on: it is exactly what an easing curve means.
 * Linear is a constant slope and a constant speed. Ease-in creeps along the
 * crest and then plunges. Ease-out drops off the edge and coasts to the
 * station. Bounce hits the bottom and bounces. Nobody has to be told.
 *
 * The alternative — driving the train's x by the easing along a flat track —
 * was rejected: the track shape would then mean nothing, and the whole point is
 * that the shape is the thing being explained.
 */

const bounceOut = (t: number): number => {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (t < 1 / d1) return n1 * t * t;
  if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
  if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
  return n1 * (t -= 2.625 / d1) * t + 0.984375;
};

interface Curve {
  id: string;
  label: string;
  note: string;
  fn: (t: number) => number;
}

/*
 * Eight, not the twenty-five the old chart list carried. Every one here has a
 * silhouette you can tell apart at a glance from the others, which is the whole
 * requirement for a row of chips.
 */
const CURVES: Curve[] = [
  { id: 'linear', label: 'Linear', note: 'One speed, start to finish.', fn: (t) => t },
  { id: 'ease-in', label: 'Ease in', note: 'Creeps over the crest, then plunges.', fn: (t) => t * t * t },
  { id: 'ease-out', label: 'Ease out', note: 'Drops off the edge and coasts in.', fn: (t) => 1 - Math.pow(1 - t, 3) },
  {
    id: 'ease-in-out',
    label: 'Ease in out',
    note: 'Slow, fast, slow — the classic hill.',
    fn: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  },
  {
    id: 'expo',
    label: 'Expo',
    note: 'Almost nothing, then everything at once.',
    fn: (t) => (t === 0 ? 0 : Math.pow(2, 10 * t - 10)),
  },
  {
    id: 'back',
    label: 'Back',
    note: 'Rolls back up before it commits.',
    fn: (t) => 2.70158 * t * t * t - 1.70158 * t * t,
  },
  { id: 'bounce', label: 'Bounce', note: 'Lands hard and bounces twice.', fn: bounceOut },
  {
    id: 'elastic',
    label: 'Elastic',
    note: 'Overshoots the station and springs back.',
    fn: (t) => {
      if (t === 0) return 0;
      if (t === 1) return 1;
      const p = 0.3;
      return Math.pow(2, -10 * t) * Math.sin(((t - p / 4) * (2 * Math.PI)) / p) + 1;
    },
  },
];

/** Samples across the track. Enough that the rail reads as smooth. */
const N = 220;

/*
 * A fixed vertical range shared by every curve, rather than fitting each one to
 * the frame. Back and elastic overshoot past 0 and 1, and rescaling per curve
 * would make a gentle ease look as dramatic as a bounce — the comparison
 * between them is the point.
 */
const V_MIN = -0.32;
const V_MAX = 1.32;
const yOf = (v: number) => (v - V_MIN) / (V_MAX - V_MIN);

/** Seconds for one run, and how long the train waits at the station. */
const RIDE = 2.9;
const PAUSE = 900;

/** Carriages, and the gap between them in track-time. */
const CARS = 5;
const CAR_GAP = 0.028;

const MORPH = 520;

function sample(fn: (t: number) => number): Float64Array {
  const out = new Float64Array(N + 1);
  for (let i = 0; i <= N; i++) out[i] = fn(i / N);
  return out;
}

export function KeyframeInterpolation() {
  const [curveId, setCurveId] = useState('linear');
  const [running, setRunning] = useState(false);

  const stage = useRef<HTMLDivElement>(null);
  const rail = useRef<SVGPathElement>(null);
  const bed = useRef<SVGPathElement>(null);
  const pillars = useRef<SVGGElement>(null);
  const cars = useRef<(HTMLDivElement | null)[]>([]);
  const readout = useRef<HTMLSpanElement>(null);

  /* Live values live in refs: at 60 fps a setState per frame would reconcile
     the chips, the track and every carriage sixty times a second. */
  const samples = useRef(sample(CURVES[0].fn));
  const morphFrom = useRef<Float64Array | null>(null);
  const morphTo = useRef<Float64Array | null>(null);
  const morphAt = useRef(0);
  const progress = useRef(0);
  const runningRef = useRef(false);
  const box = useRef({ w: 1, h: 1 });
  /** Wakes the loop. Set by the effect, called by the handlers. */
  const wake = useRef<(() => void) | null>(null);

  const curve = CURVES.find((c) => c.id === curveId) ?? CURVES[0];

  /** Height at t, reading the live (possibly mid-morph) track. */
  const valueAt = useCallback((t: number) => {
    const s = samples.current;
    const x = Math.min(1, Math.max(0, t)) * N;
    const i = Math.floor(x);
    const f = x - i;
    return i >= N ? s[N] : s[i] + (s[i + 1] - s[i]) * f;
  }, []);

  const paintTrack = useCallback(() => {
    const s = samples.current;
    let d = '';
    for (let i = 0; i <= N; i++) {
      d += `${i ? 'L' : 'M'}${((i / N) * 1000).toFixed(2)} ${(yOf(s[i]) * 1000).toFixed(2)}`;
    }
    rail.current?.setAttribute('d', d);
    bed.current?.setAttribute('d', d);

    // Supports drop from the rail to the ground, so the track reads as built
    // rather than floating.
    if (pillars.current) {
      const ground = yOf(V_MAX) * 1000;
      let g = '';
      for (let k = 0; k <= 26; k++) {
        const t = k / 26;
        const x = (t * 1000).toFixed(2);
        const y = (yOf(valueAt(t)) * 1000).toFixed(2);
        g += `<line x1="${x}" y1="${y}" x2="${x}" y2="${ground}" stroke="rgba(245,197,24,0.16)" stroke-width="2" vector-effect="non-scaling-stroke" />`;
      }
      pillars.current.innerHTML = g;
    }
  }, [valueAt]);

  const paintTrain = useCallback(() => {
    const { w, h } = box.current;
    const head = progress.current;
    for (let i = 0; i < CARS; i++) {
      const node = cars.current[i];
      if (!node) continue;
      const t = Math.min(1, Math.max(0, head - i * CAR_GAP));
      const v = valueAt(t);

      // Tangent in pixels, not in curve units — the angle depends on the
      // frame's aspect ratio, and a percentage-space angle would be wrong on
      // every screen but one.
      const d = 0.006;
      const a = yOf(valueAt(Math.max(0, t - d))) * h;
      const b = yOf(valueAt(Math.min(1, t + d))) * h;
      const angle = (Math.atan2(b - a, 2 * d * w) * 180) / Math.PI;

      node.style.left = `${t * 100}%`;
      node.style.top = `${yOf(v) * 100}%`;
      node.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
    }
    if (readout.current) {
      readout.current.textContent = `${Math.round(progress.current * 100)}% · value ${valueAt(progress.current).toFixed(2)}`;
    }
  }, [valueAt]);

  /* ── One loop for morphing, riding and resizing ───────────────────────── */
  useEffect(() => {
    const el = stage.current;
    if (!el) return;

    const measure = () => {
      const r = el.getBoundingClientRect();
      box.current = { w: r.width || 1, h: r.height || 1 };
      paintTrack();
      paintTrain();
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();

    let frame = 0;
    let last = 0;

    const tick = (now: number) => {
      if (!last) last = now;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      let busy = false;

      if (morphTo.current && morphFrom.current) {
        morphAt.current += dt * 1000;
        const u = Math.min(1, morphAt.current / MORPH);
        const e = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
        const from = morphFrom.current;
        const to = morphTo.current;
        const s = samples.current;
        for (let i = 0; i <= N; i++) s[i] = from[i] + (to[i] - from[i]) * e;
        paintTrack();
        if (u >= 1) {
          morphFrom.current = null;
          morphTo.current = null;
        }
        busy = true;
      }

      if (runningRef.current) {
        progress.current = Math.min(1, progress.current + dt / RIDE);
        if (progress.current >= 1) {
          runningRef.current = false;
          window.setTimeout(() => {
            progress.current = 0;
            setRunning(false);
            paintTrain();
          }, PAUSE);
        }
        busy = true;
      }

      paintTrain();
      frame = busy ? requestAnimationFrame(tick) : 0;
      if (!busy) last = 0;
    };

    wake.current = () => {
      if (!frame) {
        last = 0;
        frame = requestAnimationFrame(tick);
      }
    };

    return () => {
      wake.current = null;
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, [paintTrack, paintTrain]);

  const pick = (c: Curve) => {
    if (c.id === curveId) return;
    setCurveId(c.id);
    morphFrom.current = Float64Array.from(samples.current);
    morphTo.current = sample(c.fn);
    morphAt.current = 0;
    // Send the train back to the station: watching it teleport onto a track
    // that is still bending would undo the illusion.
    progress.current = 0;
    runningRef.current = false;
    setRunning(false);
    wake.current?.();
  };

  const ride = () => {
    progress.current = 0;
    runningRef.current = true;
    setRunning(true);
    wake.current?.();
  };

  return (
    <section id="keyframe-interpolation" className="relative w-full py-12 md:py-16">
      <div className="px-6">
        <h3
          className="text-center text-3xl sm:text-4xl md:text-5xl leading-[1.06] text-white mb-3"
          style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 700, letterSpacing: '-0.035em' }}
        >
          Keyframe interpolation
        </h3>
        <p className="text-center text-fx-text-secondary text-base md:text-lg max-w-2xl mx-auto">
          The track is the curve. Pick one, then send the train — it speeds up
          wherever the track steepens.
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
          {CURVES.map((c) => (
            <button
              key={c.id}
              onClick={() => pick(c)}
              className={`px-3.5 py-1.5 rounded-full border font-mono text-[11px] tracking-wide transition-colors duration-200 ${
                c.id === curveId
                  ? 'bg-fx-accent-yellow text-fx-bg-base border-fx-accent-yellow'
                  : 'text-fx-text-secondary border-fx-border hover:border-fx-accent-yellow/50 hover:text-fx-text-primary'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Full width and uncontained, like the timelines above it. */}
      <div ref={stage} className="relative w-full h-[42vh] min-h-[260px] md:h-[48vh] mt-8 select-none">
        <svg
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
          aria-hidden="true"
        >
          <g ref={pillars} />
          {/* Two passes: a soft bed under a bright rail, so the track has depth
              at any width. `non-scaling-stroke` keeps them even, because
              preserveAspectRatio="none" would otherwise stretch the stroke. */}
          <path
            ref={bed}
            fill="none"
            stroke="rgba(245,197,24,0.18)"
            strokeWidth="14"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            ref={rail}
            fill="none"
            stroke="#F5C518"
            strokeWidth="3"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {Array.from({ length: CARS }, (_, i) => (
          <div
            key={i}
            ref={(node) => {
              cars.current[i] = node;
            }}
            className="absolute will-change-transform"
            style={{ left: 0, top: 0 }}
          >
            <svg width={i === 0 ? 46 : 40} height={26} viewBox="0 0 46 26" className="drop-shadow-lg">
              <rect
                x="3"
                y="3"
                width="40"
                height="14"
                rx="5"
                fill={i === 0 ? '#F5C518' : '#7C5CBF'}
                stroke="rgba(0,0,0,0.35)"
              />
              <rect x="8" y="6" width="11" height="8" rx="2" fill="rgba(10,14,26,0.75)" />
              <rect x="23" y="6" width="11" height="8" rx="2" fill="rgba(10,14,26,0.75)" />
              <circle cx="13" cy="20" r="4.5" fill="#0a0e1a" stroke={i === 0 ? '#F5C518' : '#7C5CBF'} strokeWidth="1.5" />
              <circle cx="33" cy="20" r="4.5" fill="#0a0e1a" stroke={i === 0 ? '#F5C518' : '#7C5CBF'} strokeWidth="1.5" />
            </svg>
          </div>
        ))}
      </div>

      <div className="px-6 mt-6 flex flex-col items-center gap-3">
        <button
          onClick={ride}
          disabled={running}
          className="fx-cta group inline-flex items-center gap-2.5 rounded-full px-7 py-3 text-fx-bg-base font-semibold text-base sm:text-lg tracking-tight disabled:opacity-70"
          style={{ fontFamily: 'var(--font-inter), sans-serif' }}
        >
          {running ? <RotateCcw className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
          {running ? 'Riding…' : 'Simulate'}
        </button>

        <p className="font-mono text-[11px] text-fx-text-secondary/70 text-center">
          {curve.note} <span ref={readout} className="text-fx-accent-yellow ml-1" />
        </p>
      </div>
    </section>
  );
}
