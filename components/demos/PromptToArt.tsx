'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Paperclip, Image as ImageIcon, Mic, Sparkles, ArrowRight } from 'lucide-react';
import { useDemo } from './demo-kit';

/*
 * Prompt in, animation out — the demo for "Edit in plain English".
 *
 * A chat box types a request, the request is sent, and the thing it asked for
 * appears and keeps running. The point of the section is that FlashFX is an
 * editor an AI can operate, so the demo has to show the operating, not just the
 * result: the typing, the send, the wait, and only then the artwork.
 *
 * ── The sequence ────────────────────────────────────────────────────────────
 *
 *   appear   the box arrives from behind, centred
 *   typing   the prompt is typed a character at a time
 *   click    the send button is pressed, with a ring
 *   slide    the box moves left and shrinks, making room
 *   loading  a 300 ms spinner, because instant would read as pre-rendered
 *   playing  the vase grows, and then never stops moving
 *
 * Timings are declared once in `STEP` below. Nothing reads the clock twice.
 *
 * ── Why the loops are gated ─────────────────────────────────────────────────
 *
 * The sway and the rain run forever, so they go through `useDemo()` (which is
 * `useAmbient` at demo priority) rather than a bare `repeat: Infinity`. When the
 * governor withholds a slot the scene holds a composed still frame — grown
 * flowers, no motion — never an empty box.
 */

const PROMPT = 'a vase that grows flowers when watered, make the flowers move dynamically';

/* Milliseconds. Cumulative, so each stage reads as "when does this begin". */
const STEP = {
  appear: 260,
  type: 620,
  perChar: 34,
  click: 260,
  slide: 420,
  /* The brief asked for 300 ms exactly. It is short enough to feel like
     machinery rather than a wait, long enough that the artwork reads as having
     been produced rather than having been there all along. */
  loading: 300,
};

type Stage = 'appear' | 'typing' | 'click' | 'slide' | 'loading' | 'playing';

const YELLOW = '#F5C518';
const PURPLE = '#7C5CBF';
const BLUE = '#2D6BE4';
const GREEN = '#4ADE80';
const PINK = '#E86A9B';

/*
 * Five stems, each rising from the vase mouth at (200, 246) to its own tip.
 * `lean` is the sway amplitude in degrees — the outer stems move most, which is
 * what stops the bunch reading as one rigid object.
 */
const FLOWERS = [
  { tip: [122, 138], ctrl: [148, 196], colour: YELLOW, lean: 3.2, beat: 3.9 },
  { tip: [162, 100], ctrl: [176, 172], colour: PINK, lean: 2.4, beat: 3.2 },
  { tip: [200, 84], ctrl: [200, 168], colour: BLUE, lean: 1.8, beat: 4.4 },
  { tip: [240, 104], ctrl: [226, 174], colour: GREEN, lean: 2.6, beat: 3.5 },
  { tip: [278, 142], ctrl: [252, 198], colour: PURPLE, lean: 3.4, beat: 4.1 },
] as const;

/* Deterministic, because Math.random() during render would differ between the
   server and the client and produce a hydration mismatch. */
const RAIN = Array.from({ length: 16 }, (_, i) => ({
  x: 44 + ((i * 137) % 320),
  delay: ((i * 7) % 21) / 10,
  span: 1.5 + ((i * 13) % 9) / 10,
  length: 9 + ((i * 5) % 8),
}));

function Flower({
  flower,
  index,
  grown,
  active,
}: {
  flower: (typeof FLOWERS)[number];
  index: number;
  grown: boolean;
  active: boolean;
}) {
  const [tx, ty] = flower.tip;
  const [cx, cy] = flower.ctrl;

  return (
    /*
     * Sway lives on this group, and the origin is the vase mouth rather than the
     * group's own box — a stem should pivot where it is held, not about its
     * middle. `transformBox: view-box` makes the origin resolve in the SVG's
     * coordinate space, so "200px 246px" means the vase mouth.
     */
    <motion.g
      style={{ transformBox: 'view-box', transformOrigin: '200px 246px' }}
      animate={active && grown ? { rotate: [-flower.lean, flower.lean, -flower.lean] } : { rotate: 0 }}
      transition={
        active && grown
          ? { duration: flower.beat, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut', delay: index * 0.14 }
          : { duration: 0.4 }
      }
    >
      <motion.path
        d={`M200,246 Q${cx},${cy} ${tx},${ty}`}
        fill="none"
        stroke="#4ADE80"
        strokeWidth={3}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: grown ? 1 : 0 }}
        transition={{ duration: 0.9, delay: grown ? index * 0.11 : 0, ease: 'easeOut' }}
      />

      {/* A leaf, so the stem is not a bare line. */}
      <motion.ellipse
        cx={(200 + tx) / 2 + (tx > 200 ? 9 : -9)}
        cy={(246 + ty) / 2 + 12}
        rx={11}
        ry={5}
        fill="#3FBF6E"
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: grown ? 1 : 0, opacity: grown ? 0.9 : 0, rotate: tx > 200 ? 24 : -24 }}
        transition={{ duration: 0.5, delay: grown ? 0.5 + index * 0.11 : 0 }}
      />

      <motion.g
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        initial={{ scale: 0 }}
        animate={{ scale: grown ? 1 : 0 }}
        transition={{ duration: 0.55, delay: grown ? 0.75 + index * 0.11 : 0, ease: [0.34, 1.56, 0.64, 1] }}
      >
        {/* Six petals, then a centre. Rotated about the tip. */}
        {Array.from({ length: 6 }, (_, p) => (
          <ellipse
            key={p}
            cx={tx}
            cy={ty - 12}
            rx={6.5}
            ry={12}
            fill={flower.colour}
            opacity={0.92}
            transform={`rotate(${p * 60} ${tx} ${ty})`}
          />
        ))}
        <circle cx={tx} cy={ty} r={6} fill="#FDF3C7" />
      </motion.g>
    </motion.g>
  );
}

function VaseScene({ grown, active }: { grown: boolean; active: boolean }) {
  return (
    <svg viewBox="0 0 400 330" className="w-full h-full" role="img" aria-label="An animated vase of flowers growing in the rain">
      <defs>
        <linearGradient id="fx-vase" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3C4C86" />
          <stop offset="55%" stopColor="#243060" />
          <stop offset="100%" stopColor="#161f45" />
        </linearGradient>
        <radialGradient id="fx-vase-glow" cx="50%" cy="50%">
          <stop offset="0%" stopColor="rgba(245,197,24,0.16)" />
          <stop offset="60%" stopColor="rgba(124,92,191,0.08)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      <ellipse cx={200} cy={180} rx={165} ry={140} fill="url(#fx-vase-glow)" />

      {/*
       * The rain. Subtle on purpose — it is the reason the flowers grow, not the
       * subject. Each drop falls on its own cycle so the field never pulses.
       */}
      {RAIN.map((drop, i) => (
        <motion.line
          key={i}
          x1={drop.x}
          y1={-14}
          x2={drop.x - 3}
          y2={-14 + drop.length}
          stroke="#8FB8FF"
          strokeWidth={1.4}
          strokeLinecap="round"
          opacity={0.34}
          animate={active ? { y: [0, 344] } : { y: 150 }}
          transition={
            active
              ? { duration: drop.span, repeat: Number.POSITIVE_INFINITY, ease: 'linear', delay: drop.delay }
              : { duration: 0 }
          }
        />
      ))}

      {FLOWERS.map((flower, i) => (
        <Flower key={i} flower={flower} index={i} grown={grown} active={active} />
      ))}

      {/* Vase last, so the stems disappear behind its rim rather than in front. */}
      <path
        d="M168,244 L174,300 Q176,314 190,314 L210,314 Q224,314 226,300 L232,244 Z"
        fill="url(#fx-vase)"
        stroke="#46579B"
        strokeWidth={1.5}
      />
      <ellipse cx={200} cy={244} rx={32} ry={7} fill="#2C3A72" stroke="#4A5C9F" strokeWidth={1.5} />
      {/* A highlight down one side, so it reads as ceramic rather than a shape. */}
      <path d="M180,252 Q176,282 183,306" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth={3} strokeLinecap="round" />

      {/* Water catching the light at the vase mouth. */}
      <motion.ellipse
        cx={200}
        cy={244}
        rx={26}
        ry={4.5}
        fill="#6FA8FF"
        opacity={0.5}
        animate={active ? { rx: [26, 28, 26], opacity: [0.42, 0.6, 0.42] } : { rx: 26, opacity: 0.5 }}
        transition={active ? { duration: 2.8, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' } : { duration: 0 }}
      />
    </svg>
  );
}

export function PromptToArt() {
  const { ref, active } = useDemo();
  const [stage, setStage] = useState<Stage>('appear');
  const [typed, setTyped] = useState('');
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));

    const run = () => {
      if (started.current) return;
      started.current = true;

      // Reduced motion gets the finished state, not a faster version of the
      // sequence: the point is the outcome, and the outcome is the artwork.
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setTyped(PROMPT);
        setStage('playing');
        return;
      }

      const typingStarts = STEP.appear + STEP.type;
      at(typingStarts, () => setStage('typing'));

      for (let i = 1; i <= PROMPT.length; i++) {
        at(typingStarts + i * STEP.perChar, () => setTyped(PROMPT.slice(0, i)));
      }

      const typingEnds = typingStarts + PROMPT.length * STEP.perChar;
      at(typingEnds, () => setStage('click'));
      at(typingEnds + STEP.click, () => setStage('slide'));
      at(typingEnds + STEP.click + STEP.slide, () => setStage('loading'));
      at(typingEnds + STEP.click + STEP.slide + STEP.loading, () => setStage('playing'));
    };

    /*
     * Starts on arrival, not on mount. A sequence that has already finished by
     * the time it is scrolled to has shown nobody anything.
     */
    const observer = new IntersectionObserver(
      (records) => {
        if (records.some((r) => r.isIntersecting)) {
          run();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [ref]);

  const slid = stage === 'slide' || stage === 'loading' || stage === 'playing';
  const pressed = stage === 'click';
  const playing = stage === 'playing';

  return (
    <div ref={ref} className="relative w-full h-[64vh] min-h-[440px] md:min-h-[520px]">
      {/* The artwork half. Positioning is on the wrapper and animation on the
          child — an inline transform from framer would otherwise overwrite the
          Tailwind translate utilities. */}
      <div className="absolute inset-y-0 right-0 w-full lg:w-[46%] flex items-center justify-center px-6 pointer-events-none">
        <motion.div
          className="w-full max-w-[420px] aspect-[400/330]"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={playing ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <VaseScene grown={playing} active={active && playing} />
        </motion.div>
      </div>

      {/* The chat box. Centred by the flex parent, then moved by `x` so no
          Tailwind translate is involved. */}
      <div className="absolute inset-0 flex items-center justify-center px-4 pointer-events-none">
        <motion.div
          className="relative w-[92vw] sm:w-[74vw] lg:w-[50vw] rounded-[28px] sm:rounded-[34px] border shadow-2xl"
          style={{
            minHeight: '20vh',
            background: 'rgba(22, 33, 68, 0.92)',
            borderColor: 'rgba(230, 237, 243, 0.14)',
          }}
          initial={{ opacity: 0, y: 46, scale: 0.9 }}
          animate={{
            opacity: 1,
            y: 0,
            /* Percent of its own width, so the distance scales with the box
               rather than being a pixel guess that breaks at another size. */
            x: slid ? '-50%' : '0%',
            scale: slid ? 0.66 : 1,
          }}
          transition={{ duration: stage === 'appear' ? 0.6 : 0.52, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex flex-col h-full p-5 sm:p-6">
            <p
              className="flex-1 text-base sm:text-lg lg:text-xl leading-relaxed text-fx-text-primary"
              style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
            >
              {typed || <span className="text-fx-text-secondary">Describe the animation you want…</span>}
              {stage === 'typing' && (
                <motion.span
                  className="inline-block w-[2px] h-[1.05em] align-[-0.15em] ml-0.5 bg-fx-accent-yellow"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.9, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
                />
              )}
            </p>

            <div className="mt-5 flex items-center gap-2">
              {[
                { Icon: Paperclip, label: 'Add file' },
                { Icon: ImageIcon, label: 'Image' },
                { Icon: Mic, label: 'Voice' },
              ].map(({ Icon, label }) => (
                <span
                  key={label}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-fx-border text-fx-text-secondary"
                >
                  <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
                  <span className="hidden sm:inline font-mono text-[10px] tracking-wide">{label}</span>
                </span>
              ))}

              <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-fx-accent-yellow/30 text-fx-accent-yellow">
                <Sparkles className="w-3.5 h-3.5" strokeWidth={1.75} />
                <span className="hidden sm:inline font-mono text-[10px] tracking-wide">Claude</span>
              </span>

              <span className="flex-1" />

              <motion.span
                className="relative flex items-center gap-2 px-3.5 sm:px-5 py-2 rounded-full font-semibold text-fx-bg-base text-xs sm:text-sm"
                style={{ background: 'linear-gradient(135deg, #ffd84d 0%, #f5c518 44%, #e9a908 100%)' }}
                animate={{ scale: pressed ? 0.93 : 1 }}
                transition={{ duration: 0.16, ease: 'easeOut' }}
              >
                Edit now
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />

                {/* The ring, fired by the press and gone with it. */}
                <motion.span
                  className="absolute inset-0 rounded-full border-2 border-fx-accent-yellow pointer-events-none"
                  initial={{ opacity: 0, scale: 1 }}
                  animate={pressed ? { opacity: [0.9, 0], scale: [1, 1.7] } : { opacity: 0, scale: 1 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </motion.span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* The wait. Sits where the artwork will be. */}
      <div className="absolute inset-y-0 right-0 w-full lg:w-[46%] flex items-center justify-center pointer-events-none">
        <motion.span
          className="w-9 h-9 rounded-full border-2 border-fx-border"
          style={{ borderTopColor: '#f5c518' }}
          animate={
            stage === 'loading'
              ? { opacity: 1, rotate: 360 }
              : { opacity: 0, rotate: 0 }
          }
          transition={{
            rotate: { duration: 0.55, repeat: Number.POSITIVE_INFINITY, ease: 'linear' },
            opacity: { duration: 0.14 },
          }}
        />
      </div>
    </div>
  );
}
