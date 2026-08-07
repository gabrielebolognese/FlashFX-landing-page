'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

/*
 * Easing curves as a rollercoaster (immersionmilestones.md I8).
 *
 * The track *is* the curve. The train advances at a constant rate horizontally
 * — equal time per unit of x — while its height follows the easing. Where the
 * curve steepens it covers far more track per second and visibly accelerates;
 * where it flattens it coasts.
 *
 * That is not a metaphor bolted on: it is what an easing curve means. Linear is
 * a constant slope and a constant speed. Ease-in creeps over the crest then
 * plunges. Bounce lands hard and bounces. Nobody has to be told.
 *
 * ── Second pass ────────────────────────────────────────────────────────────
 *
 * Everything that was below the track — the Simulate button, the explanatory
 * paragraph, the curve note and the progress readout — is gone or moved into
 * the frame's top corners. That reclaimed vertical space went into the track,
 * which is the only part that carries meaning: a curve squashed flat across a
 * wide frame reads as a straight line whatever easing it is.
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
  fn: (t: number) => number;
}

const CURVES: Curve[] = [
  { id: 'linear', label: 'Linear', fn: (t) => t },
  { id: 'ease-in', label: 'Ease in', fn: (t) => t * t * t },
  { id: 'ease-out', label: 'Ease out', fn: (t) => 1 - Math.pow(1 - t, 3) },
  {
    id: 'ease-in-out',
    label: 'In out',
    fn: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  },
  { id: 'expo', label: 'Expo', fn: (t) => (t === 0 ? 0 : Math.pow(2, 10 * t - 10)) },
  { id: 'back', label: 'Back', fn: (t) => 2.70158 * t * t * t - 1.70158 * t * t },
  { id: 'bounce', label: 'Bounce', fn: bounceOut },
  {
    id: 'elastic',
    label: 'Elastic',
    fn: (t) => {
      if (t === 0) return 0;
      if (t === 1) return 1;
      const p = 0.3;
      return Math.pow(2, -10 * t) * Math.sin(((t - p / 4) * (2 * Math.PI)) / p) + 1;
    },
  },
];

const N = 220;

/*
 * The vertical range every curve shares, tightened from ±0.32 so the 0→1 span
 * fills 71% of the frame instead of 61% — most of the height increase asked
 * for comes from here rather than from the section simply getting taller.
 *
 * It cannot tighten further: `back` dips to about −0.10 and `elastic`
 * overshoots to about 1.07, and clipping either would misrepresent the curve.
 */
const V_MIN = -0.2;
const V_MAX = 1.2;
const yOf = (v: number) => (v - V_MIN) / (V_MAX - V_MIN);

const RIDE = 2.9;
const PAUSE = 900;

const CARS = 5;
const CAR_GAP = 0.03;

const MORPH = 520;

/** Bounce by default — the most obviously non-linear of the eight. */
const DEFAULT_CURVE = 'bounce';

function sample(fn: (t: number) => number): Float64Array {
  const out = new Float64Array(N + 1);
  for (let i = 0; i <= N; i++) out[i] = fn(i / N);
  return out;
}

/** A miniature of the track for each chip, drawn the same way round as the real one. */
function miniPath(fn: (t: number) => number, w = 30, h = 18, pad = 2.5): string {
  let d = '';
  for (let i = 0; i <= 24; i++) {
    const t = i / 24;
    const x = pad + t * (w - 2 * pad);
    const y = pad + yOf(fn(t)) * (h - 2 * pad);
    d += `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}

export function KeyframeInterpolation() {
  const [curveId, setCurveId] = useState(DEFAULT_CURVE);
  const [running, setRunning] = useState(false);

  const track = useRef<HTMLDivElement>(null);
  const rail = useRef<SVGPathElement>(null);
  const bed = useRef<SVGPathElement>(null);
  const pillars = useRef<SVGGElement>(null);
  const cars = useRef<(HTMLDivElement | null)[]>([]);

  const samples = useRef(sample(CURVES.find((c) => c.id === DEFAULT_CURVE)!.fn));
  const morphFrom = useRef<Float64Array | null>(null);
  const morphTo = useRef<Float64Array | null>(null);
  const morphAt = useRef(0);
  const progress = useRef(0);
  const runningRef = useRef(false);
  const box = useRef({ w: 1, h: 1 });
  const wake = useRef<(() => void) | null>(null);
  const rideRef = useRef<(() => void) | null>(null);

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

    if (pillars.current) {
      /*
       * Pulled up from the very bottom of the viewBox. At y=1000 the ground
       * line would sit on the edge with half its stroke clipped away, which is
       * what made the supports look sawn off rather than standing on anything.
       */
      const ground = 988;
      let g = '';
      for (let k = 0; k <= 30; k++) {
        const t = k / 30;
        const x = (t * 1000).toFixed(2);
        const y = (yOf(valueAt(t)) * 1000).toFixed(2);
        g += `<line x1="${x}" y1="${y}" x2="${x}" y2="${ground}" stroke="rgba(245,197,24,0.15)" stroke-width="2" vector-effect="non-scaling-stroke" />`;
      }
      // The ground the supports stand on, drawn last so it caps them.
      g += `<line x1="0" y1="${ground}" x2="1000" y2="${ground}" stroke="rgba(245,197,24,0.42)" stroke-width="2.5" vector-effect="non-scaling-stroke" />`;
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

      // Tangent measured in pixels: the angle depends on the frame's aspect
      // ratio, so an angle computed in curve units is right on one screen only.
      const d = 0.006;
      const a = yOf(valueAt(Math.max(0, t - d))) * h;
      const b = yOf(valueAt(Math.min(1, t + d))) * h;
      const angle = (Math.atan2(b - a, 2 * d * w) * 180) / Math.PI;

      node.style.left = `${t * 100}%`;
      node.style.top = `${yOf(v) * 100}%`;
      node.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
    }
  }, [valueAt]);

  useEffect(() => {
    const el = track.current;
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

    /*
     * Rides itself when the section arrives. The whole point is the motion, and
     * a visitor who has to find a button before anything moves has already been
     * shown a static chart — the thing this replaced.
     */
    const auto = new IntersectionObserver(
      (records) => {
        if (records.some((r) => r.isIntersecting) && !runningRef.current) {
          rideRef.current?.();
        }
      },
      { threshold: 0.4 }
    );
    auto.observe(el);

    return () => {
      wake.current = null;
      cancelAnimationFrame(frame);
      ro.disconnect();
      auto.disconnect();
    };
  }, [paintTrack, paintTrain]);

  const ride = useCallback(() => {
    progress.current = 0;
    runningRef.current = true;
    setRunning(true);
    wake.current?.();
  }, []);

  // Assigned in an effect rather than during render, so a double render in
  // strict mode cannot write a stale closure into the ref.
  useEffect(() => {
    rideRef.current = ride;
  }, [ride]);

  const pick = (c: Curve) => {
    if (c.id === curveId) return;
    setCurveId(c.id);
    morphFrom.current = Float64Array.from(samples.current);
    morphTo.current = sample(c.fn);
    morphAt.current = 0;
    // Back to the station: watching the train teleport onto a track that is
    // still bending would undo the illusion.
    progress.current = 0;
    runningRef.current = false;
    setRunning(false);
    wake.current?.();
    // Ride the new curve once it has finished forming.
    window.setTimeout(() => ride(), MORPH + 120);
  };

  return (
    <section id="keyframe-interpolation" className="relative w-full py-10 md:py-14">
      <h3
        className="px-6 text-center text-3xl sm:text-4xl md:text-5xl leading-[1.06] text-white"
        style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 700, letterSpacing: '-0.035em' }}
      >
        Keyframe Interpolation, <span style={{ color: '#f5c842' }}>like a rollercoaster!</span>
      </h3>

      <div className="relative w-full h-[54vh] min-h-[360px] md:h-[64vh] mt-6 select-none">
        {/* Controls sit in the frame's corners rather than under it, so the
            track keeps the height. */}
        <div className="absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-4 px-4 sm:px-8">
          <button
            onClick={ride}
            disabled={running}
            className="fx-cta group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-fx-bg-base font-semibold text-sm sm:text-base tracking-tight disabled:opacity-70 flex-shrink-0"
            style={{ fontFamily: 'var(--font-inter), sans-serif' }}
          >
            {running ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            {running ? 'Riding' : 'Simulate'}
          </button>

          <div className="flex flex-wrap justify-end gap-1.5 max-w-[64%]">
            {CURVES.map((c) => {
              const on = c.id === curveId;
              return (
                <button
                  key={c.id}
                  onClick={() => pick(c)}
                  className={`flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-md border transition-colors duration-200 ${
                    on
                      ? 'bg-fx-accent-yellow/15 border-fx-accent-yellow text-fx-accent-yellow'
                      : 'border-fx-border text-fx-text-secondary hover:border-fx-accent-yellow/50 hover:text-fx-text-primary'
                  }`}
                >
                  {/* Each chip previews the track it selects. */}
                  <svg width="30" height="18" viewBox="0 0 30 18" className="flex-shrink-0" aria-hidden="true">
                    <path
                      d={miniPath(c.fn)}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="font-mono text-[10px] tracking-wide whitespace-nowrap">{c.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* The track area proper, inset below the controls. */}
        <div ref={track} className="absolute inset-x-0 bottom-0 top-[128px] sm:top-[84px] md:top-[78px]">
          <svg
            viewBox="0 0 1000 1000"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full"
            aria-hidden="true"
          >
            <g ref={pillars} />
            <path
              ref={bed}
              fill="none"
              stroke="rgba(245,197,24,0.18)"
              strokeWidth="18"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            <path
              ref={rail}
              fill="none"
              stroke="#F5C518"
              strokeWidth="3.5"
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
              {/* 60% larger than the first pass. */}
              <svg width={i === 0 ? 74 : 64} height={42} viewBox="0 0 46 26" className="drop-shadow-lg">
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
                <circle
                  cx="13"
                  cy="20"
                  r="4.5"
                  fill="#0a0e1a"
                  stroke={i === 0 ? '#F5C518' : '#7C5CBF'}
                  strokeWidth="1.5"
                />
                <circle
                  cx="33"
                  cy="20"
                  r="4.5"
                  fill="#0a0e1a"
                  stroke={i === 0 ? '#F5C518' : '#7C5CBF'}
                  strokeWidth="1.5"
                />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
