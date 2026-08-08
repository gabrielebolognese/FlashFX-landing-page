'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Layers, MessageSquare, Puzzle, Users } from 'lucide-react';
import { useDemo } from './demo-kit';

/*
 * The five demos for the "Not convinced yet?" block.
 *
 * Together in one file because they are five small pieces that share a clock
 * helper and a palette, and five files of forty lines each would be five files
 * to keep in step. Each is exported on its own and lazily loaded through
 * `convince-demos.tsx`.
 *
 * These are first-pass mockups. They are built to be replaced or refined once
 * the copy settles — the shapes are right, the detail is deliberately cheap.
 */

const Y = '#F5C518';
const P = '#7C5CBF';
const B = '#5B8DEF';
const G = '#4ADE80';
const K = '#E86A9B';

/** A repeating 0..1 clock, in seconds, that stops without a governor grant. */
function useClock(seconds: number, active: boolean) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      setT((((now - start) / 1000) % seconds) / seconds);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seconds, active]);
  return t;
}

const shell = 'relative w-full rounded-xl border border-fx-border overflow-hidden';
const shellBg = { background: 'rgba(16, 24, 52, 0.72)' };

/* ── 1. Six agents, six spans, all at once ─────────────────────────────── */

const AGENTS = [
  { from: 0.0, to: 0.19, colour: Y, label: '0:00 – 0:20' },
  { from: 0.19, to: 0.33, colour: B, label: '0:20 – 0:35' },
  { from: 0.33, to: 0.5, colour: G, label: '0:35 – 0:52' },
  { from: 0.5, to: 0.66, colour: K, label: '0:52 – 1:09' },
  { from: 0.66, to: 0.84, colour: P, label: '1:09 – 1:28' },
  { from: 0.84, to: 1.0, colour: Y, label: '1:28 – 1:45' },
];

export function AgentLanes() {
  const { ref, active } = useDemo();
  const t = useClock(4.2, active);

  return (
    <div ref={ref} className={`${shell} aspect-[4/3] p-3 sm:p-4 flex flex-col`} style={shellBg}>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-3.5 h-3.5 text-fx-accent-yellow" strokeWidth={2} />
        <span className="font-mono text-[10px] uppercase tracking-widest text-fx-text-secondary">
          6 agents · one timeline
        </span>
      </div>

      <div className="flex-1 min-h-0 flex flex-col justify-center gap-2 sm:gap-2.5">
        {AGENTS.map((a, i) => {
          /*
           * Each agent sweeps its own span, and every sweep runs off the same
           * clock — which is the entire point. Staggering them would show six
           * agents taking turns, which is the opposite of the claim.
           */
          const width = a.to - a.from;
          const progress = Math.min(1, Math.max(0, t * 1.25 - i * 0.02));
          return (
            <div key={i} className="relative h-6 sm:h-7 rounded" style={{ background: 'rgba(230,237,243,0.05)' }}>
              <div
                className="absolute inset-y-0 rounded flex items-center px-1.5 overflow-hidden"
                style={{ left: `${a.from * 100}%`, width: `${width * 100 - 0.8}%`, background: `${a.colour}22`, border: `1px solid ${a.colour}66` }}
              >
                <motion.span
                  className="absolute inset-y-0 left-0 rounded"
                  style={{ background: a.colour, opacity: 0.42 }}
                  animate={{ width: `${progress * 100}%` }}
                  transition={{ duration: 0.1, ease: 'linear' }}
                />
                <span className="relative font-mono text-[8px] sm:text-[9px] truncate" style={{ color: a.colour }}>
                  agent {i + 1}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex justify-between font-mono text-[8px] text-fx-text-secondary/60">
        <span>0:00</span>
        <span>1:45</span>
      </div>
    </div>
  );
}

/* ── 2. It edits, it does not generate ─────────────────────────────────── */

const LAYERS = [
  { name: 'title', colour: Y, keys: [0.12, 0.4, 0.72] },
  { name: 'subject', colour: K, keys: [0.05, 0.33, 0.58, 0.86] },
  { name: 'trees', colour: G, keys: [0.2, 0.55, 0.9] },
  { name: 'sky', colour: B, keys: [0.08, 0.62] },
];

export function EditNotGenerate() {
  const { ref, active } = useDemo();
  const t = useClock(9, active);
  // One pass: a flat clip, then it comes apart into its layers, then one is
  // picked and shown to be a real object with real keyframes.
  const split = t > 0.22;
  const picked = t > 0.55;

  return (
    <div ref={ref} className={`${shell} aspect-[16/7] p-4 sm:p-6 flex flex-col`} style={shellBg}>
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-[10px] uppercase tracking-widest text-fx-text-secondary">
          {split ? 'a project, opened' : 'the finished clip'}
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest" style={{ color: split ? G : Y }}>
          <Layers className="w-3 h-3" strokeWidth={2.5} />
          {split ? 'every element editable' : 'not a video file'}
        </span>
      </div>

      <div className="flex-1 min-h-0 flex items-center justify-center">
        <div className="relative w-full max-w-3xl">
          {LAYERS.map((l, i) => {
            const gap = split ? (i - (LAYERS.length - 1) / 2) * 34 : 0;
            const lean = split ? -14 : 0;
            const isPicked = picked && i === 1;
            return (
              <motion.div
                key={l.name}
                className="absolute left-1/2 top-1/2 w-full"
                style={{ transformStyle: 'preserve-3d' }}
                animate={{
                  x: '-50%',
                  y: `calc(-50% + ${gap}px)`,
                  rotateX: lean,
                  scale: isPicked ? 1.04 : 1,
                  opacity: picked && !isPicked ? 0.35 : 1,
                }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <div
                  className="h-9 sm:h-11 rounded-md flex items-center gap-2 px-3"
                  style={{
                    background: `${l.colour}1e`,
                    border: `1.5px solid ${isPicked ? l.colour : `${l.colour}55`}`,
                    boxShadow: isPicked ? `0 0 24px ${l.colour}55` : 'none',
                  }}
                >
                  <span className="font-mono text-[9px] sm:text-[10px] w-14 flex-shrink-0" style={{ color: l.colour }}>
                    {l.name}
                  </span>
                  {/* Keyframes: the proof that the layer is animated rather
                      than baked into a picture. */}
                  <span className="relative flex-1 h-full">
                    {l.keys.map((k) => (
                      <motion.span
                        key={k}
                        className="absolute top-1/2 w-2 h-2 -mt-1 -ml-1 rotate-45"
                        style={{ left: `${k * 100}%`, background: l.colour }}
                        animate={{ opacity: split ? 1 : 0, scale: split ? 1 : 0.4 }}
                        transition={{ duration: 0.4, delay: split ? 0.3 + i * 0.06 : 0 }}
                      />
                    ))}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="mt-3 text-center font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-fx-text-secondary/60">
        generated video hands you a file · this hands you the project
      </div>
    </div>
  );
}

/* ── 3. Ask it how ─────────────────────────────────────────────────────── */

const QUESTION = 'how do I edit the interpolation?';

export function AskAI() {
  const { ref, active } = useDemo();
  const t = useClock(10, active);
  const typed = QUESTION.slice(0, Math.floor(Math.min(1, t * 3.4) * QUESTION.length));
  const answered = t > 0.42;

  return (
    <div ref={ref} className={`${shell} aspect-[4/3] p-3 sm:p-4 flex flex-col gap-3`} style={shellBg}>
      {/* The question. */}
      <div className="rounded-lg border p-3" style={{ borderColor: 'rgba(245,197,24,0.4)', background: 'rgba(245,197,24,0.06)' }}>
        <div className="flex items-center gap-1.5 mb-1.5">
          <MessageSquare className="w-3 h-3 text-fx-accent-yellow" strokeWidth={2.5} />
          <span className="font-mono text-[9px] uppercase tracking-widest text-fx-text-secondary">you</span>
        </div>
        <span className="text-sm sm:text-base text-fx-text-primary" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
          {typed}
          {typed.length < QUESTION.length && <span className="inline-block w-[2px] h-[1em] align-middle ml-0.5 bg-fx-accent-yellow" />}
        </span>
      </div>

      {/* The answer, and the panel it is pointing at. */}
      <motion.div
        className="flex-1 min-h-0 rounded-lg border p-3 flex flex-col"
        style={{ borderColor: 'rgba(230,237,243,0.12)', background: 'rgba(11,17,38,0.7)' }}
        animate={{ opacity: answered ? 1 : 0.25 }}
        transition={{ duration: 0.4 }}
      >
        <span className="font-mono text-[9px] uppercase tracking-widest text-fx-text-secondary mb-2">flashfx</span>
        <span className="text-xs sm:text-sm text-fx-text-secondary leading-relaxed">
          Select the keyframe, then open the easing panel. Drag either handle to reshape the curve.
        </span>

        {/* The easing curve, ringed when the answer lands. */}
        <motion.div
          className="mt-auto relative rounded-md p-2"
          animate={{
            borderColor: answered ? 'rgba(245,197,24,0.75)' : 'rgba(230,237,243,0.1)',
            boxShadow: answered ? '0 0 22px rgba(245,197,24,0.3)' : '0 0 0 rgba(0,0,0,0)',
          }}
          transition={{ duration: 0.5 }}
          style={{ border: '1.5px solid rgba(230,237,243,0.1)', background: 'rgba(230,237,243,0.03)' }}
        >
          <svg viewBox="0 0 120 54" className="w-full h-12 sm:h-16">
            <path d="M4,50 C40,50 46,6 116,6" fill="none" stroke={Y} strokeWidth={2.5} strokeLinecap="round" />
            <circle cx={4} cy={50} r={3.5} fill="#0b1020" stroke="#fff" strokeWidth={1.6} />
            <circle cx={116} cy={6} r={3.5} fill="#0b1020" stroke="#fff" strokeWidth={1.6} />
            <motion.circle
              cx={40}
              cy={50}
              r={4}
              fill={Y}
              animate={answered ? { cy: [50, 34, 50] } : { cy: 50 }}
              transition={answered ? { duration: 2.6, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' } : { duration: 0 }}
            />
          </svg>
          <span className="absolute top-1.5 right-2 font-mono text-[8px] uppercase tracking-widest text-fx-text-secondary/60">
            easing
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ── 4. Inspired by the best ───────────────────────────────────────────── */

const SOURCES = [
  { name: 'CapCut', trait: 'speed', colour: G, x: -1 },
  { name: 'Premiere Pro', trait: 'depth', colour: P, x: 0 },
  { name: 'Figma', trait: 'the canvas', colour: B, x: 1 },
];

export function InspiredBy() {
  const { ref, active } = useDemo();
  const t = useClock(6, active);

  return (
    <div ref={ref} className={`${shell} aspect-[4/3] p-4 flex flex-col items-center justify-center gap-6`} style={shellBg}>
      <div className="flex items-start justify-center gap-3 sm:gap-5 w-full">
        {SOURCES.map((s, i) => (
          <div key={s.name} className="flex-1 max-w-[120px] text-center">
            <div
              className="mx-auto w-full aspect-square rounded-xl flex items-center justify-center"
              style={{ background: `${s.colour}18`, border: `1.5px solid ${s.colour}55` }}
            >
              <span className="font-mono text-[9px] sm:text-[10px]" style={{ color: s.colour }}>
                {s.trait}
              </span>
            </div>
            <span className="mt-2 block font-mono text-[8px] sm:text-[9px] text-fx-text-secondary truncate">{s.name}</span>
          </div>
        ))}
      </div>

      {/* Three streams converging. The dots run the same path every cycle, so
          what you read is direction rather than decoration. */}
      <svg viewBox="0 0 240 60" className="w-full max-w-[280px] h-12">
        {SOURCES.map((s, i) => {
          const x0 = 40 + i * 80;
          const d = `M${x0},2 C${x0},34 120,26 120,56`;
          const at = (t + i * 0.14) % 1;
          return (
            <g key={s.name}>
              <path d={d} fill="none" stroke={`${s.colour}55`} strokeWidth={1.5} />
              <circle r={3.5} fill={s.colour}>
                <animateMotion dur="2s" repeatCount="indefinite" path={d} begin={`${i * 0.3}s`} />
              </circle>
            </g>
          );
        })}
      </svg>

      <div
        className="px-5 py-2.5 rounded-full flex items-center gap-2"
        style={{ background: 'rgba(245,197,24,0.12)', border: `1.5px solid ${Y}` }}
      >
        <Sparkles className="w-4 h-4" style={{ color: Y }} strokeWidth={2.5} />
        <span className="text-base sm:text-lg" style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 700, color: Y }}>
          FlashFX
        </span>
      </div>
    </div>
  );
}

/* ── 5. The possibilities are endless ──────────────────────────────────── */

const KINDS = [
  { label: 'Plugins', Icon: Puzzle, colour: Y },
  { label: 'Templates', Icon: Layers, colour: B },
  { label: 'Presets', Icon: Sparkles, colour: K },
  { label: 'Community', Icon: Users, colour: G },
];

export function Endless() {
  const { ref, active } = useDemo();
  const t = useClock(7, active);

  return (
    <div ref={ref} className={`${shell} p-5 sm:p-8`} style={{ ...shellBg, minHeight: 300 }}>
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {KINDS.map(({ label, Icon, colour }) => (
          <span
            key={label}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-widest"
            style={{ background: `${colour}14`, border: `1px solid ${colour}44`, color: colour }}
          >
            <Icon className="w-3 h-3" strokeWidth={2.5} />
            {label}
          </span>
        ))}
      </div>

      {/*
        A field of tiles that keeps arriving. Each one fades in on its own
        offset from a single clock, so the grid never settles — which is the
        only honest way to draw "endless" without claiming a number.
      */}
      <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5 sm:gap-2">
        {Array.from({ length: 60 }, (_, i) => {
          const kind = KINDS[i % KINDS.length];
          const phase = (t + i * 0.017) % 1;
          const official = i % 5 === 0;
          return (
            <motion.span
              key={i}
              className="aspect-square rounded-md"
              style={{
                background: `${kind.colour}${official ? '33' : '16'}`,
                border: `1px solid ${kind.colour}${official ? '88' : '33'}`,
              }}
              animate={{ opacity: 0.25 + Math.sin(phase * Math.PI * 2) * 0.35 + 0.4, scale: 0.94 + phase * 0.08 }}
              transition={{ duration: 0.2, ease: 'linear' }}
            />
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-center gap-5 font-mono text-[9px] uppercase tracking-widest text-fx-text-secondary/70">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ background: `${Y}55`, border: `1px solid ${Y}` }} />
          official
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ background: `${Y}18`, border: `1px solid ${Y}44` }} />
          made by users
        </span>
      </div>
    </div>
  );
}
