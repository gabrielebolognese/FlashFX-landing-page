'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Paperclip, Image as ImageIcon, Mic, Sparkles, ArrowRight } from 'lucide-react';
import { useDemo } from './demo-kit';

/*
 * Prompt in, animation out — the demo for "Edit in plain English".
 *
 * The claim of the section is that Claude *operates* the editor, so the demo
 * shows the operating rather than the result: a request is typed, sent, worked
 * on, and then edited further by a cursor that is visibly not yours — selecting
 * the vase, dragging out a copy, and switching on a particle effect.
 *
 * ── The sequence ────────────────────────────────────────────────────────────
 *
 *   1s pause   nothing, deliberately
 *   box        the chat box arrives, glowing
 *   typing     five words are typed; the rest lands at once — see TYPED_WORDS
 *   ready      "Edit now" comes out of its disabled state
 *   click      the button is pressed, with a ring
 *   slide      the box leaves left, slowly, at full size
 *   loading    a 300 ms spinner where the artwork will be
 *   square     a plain square, which is where every animation starts
 *   morph      the square becomes a vase; flowers and leaves grow out of it
 *   cursors    two cursors arrive — somebody else is in the document
 *   select     the vase is boxed in a yellow selection
 *   duplicate  a copy is dragged out to the right and dropped smaller
 *   button     a "rain particles" control appears over the flowers
 *   press      a cursor presses it, the control disappears
 *   raining    rain falls on both, and nothing stops moving again
 *
 * Every duration is in `STEP`, and the effect adds them up in order. One clock,
 * one place to change it.
 *
 * ── Why the loops are gated ─────────────────────────────────────────────────
 *
 * The sway, the rain, the water line and the box's glow run forever, so they go
 * through `useDemo()` — `useAmbient` at demo priority — rather than a bare
 * `repeat: Infinity`. Without a slot the scene holds grown flowers and stops
 * moving; it never goes blank.
 */

const PROMPT = 'a vase that grows flowers when watered, make the flowers move dynamically';

/*
 * How many words are typed before the rest appears at once.
 *
 * Typing all 73 characters took two and a half seconds, which is most of the
 * sequence spent watching a caret. Five words is enough to establish that it is
 * being typed rather than pasted; after that the point has been made and the
 * remainder can land in one go.
 */
const TYPED_WORDS = 5;
const HEAD = PROMPT.split(' ').slice(0, TYPED_WORDS).join(' ');

/** Milliseconds, each measured from the end of the step before it. */
const STEP = {
  wait: 1000,
  box: 700,
  perChar: 42,
  head: 420,
  ready: 460,
  click: 300,
  /* Slow, and eased at both ends. The box is leaving, not being flicked away —
     a fast exit reads as a glitch on something this large. */
  slide: 1400,
  loading: 300,
  square: 520,
  morph: 1600,
  cursors: 520,
  select: 560,
  duplicate: 1050,
  button: 820,
  press: 340,
};

const S = {
  idle: 0,
  box: 1,
  typing: 2,
  ready: 3,
  click: 4,
  slide: 5,
  loading: 6,
  square: 7,
  morph: 8,
  cursors: 9,
  select: 10,
  duplicate: 11,
  button: 12,
  press: 13,
  raining: 14,
} as const;

const YELLOW = '#F5C518';
const PURPLE = '#7C5CBF';
const BLUE = '#2D6BE4';
const GREEN = '#4ADE80';
const PINK = '#E86A9B';

/*
 * Square and vase share a command structure — M, L, Q, L, Q, L, Z, sixteen
 * numbers each — which is what lets framer-motion interpolate `d` between them.
 * Change one and the other must change in the same shape, or the morph becomes
 * a cut.
 */
const SQUARE_PATH = 'M150,206 L150,314 Q150,314 158,314 L242,314 Q250,314 250,314 L250,206 Z';
const VASE_PATH = 'M168,244 L174,300 Q176,314 190,314 L210,314 Q224,314 226,300 L232,244 Z';

const FLOWERS = [
  { tip: [122, 138], ctrl: [148, 196], colour: YELLOW, lean: 3.2, beat: 3.9 },
  { tip: [162, 100], ctrl: [176, 172], colour: PINK, lean: 2.4, beat: 3.2 },
  { tip: [200, 84], ctrl: [200, 168], colour: BLUE, lean: 1.8, beat: 4.4 },
  { tip: [240, 104], ctrl: [226, 174], colour: GREEN, lean: 2.6, beat: 3.5 },
  { tip: [278, 142], ctrl: [252, 198], colour: PURPLE, lean: 3.4, beat: 4.1 },
] as const;

/* Leaves fanning out of the vase mouth, under the stems. */
const LEAVES = [
  { x: 168, y: 236, rx: 21, ry: 8, rot: -34 },
  { x: 186, y: 230, rx: 17, ry: 7, rot: -16 },
  { x: 214, y: 230, rx: 17, ry: 7, rot: 16 },
  { x: 232, y: 236, rx: 21, ry: 8, rot: 34 },
] as const;

/* Index-derived, not random: Math.random() at render differs between server and
   client and trips a hydration mismatch. */
const RAIN = Array.from({ length: 18 }, (_, i) => ({
  x: 16 + ((i * 137) % 372),
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
    /* Sway pivots at the vase mouth, not the group's centre — a stem bends where
       it is held. `transformBox: view-box` resolves "200px 246px" in the SVG's
       own coordinates. */
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
        strokeWidth={3.4}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: grown ? 1 : 0 }}
        transition={{ duration: 0.8, delay: grown ? index * 0.1 : 0, ease: 'easeOut' }}
      />

      <motion.ellipse
        cx={(200 + tx) / 2 + (tx > 200 ? 9 : -9)}
        cy={(246 + ty) / 2 + 12}
        rx={12}
        ry={5.5}
        fill="#3FBF6E"
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: grown ? 1 : 0, opacity: grown ? 0.9 : 0, rotate: tx > 200 ? 24 : -24 }}
        transition={{ duration: 0.45, delay: grown ? 0.42 + index * 0.1 : 0 }}
      />

      <motion.g
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        initial={{ scale: 0 }}
        animate={{ scale: grown ? 1 : 0 }}
        transition={{ duration: 0.5, delay: grown ? 0.62 + index * 0.1 : 0, ease: [0.34, 1.56, 0.64, 1] }}
      >
        {Array.from({ length: 6 }, (_, p) => (
          <ellipse
            key={p}
            cx={tx}
            cy={ty - 13}
            rx={7}
            ry={13}
            fill={flower.colour}
            opacity={0.92}
            transform={`rotate(${p * 60} ${tx} ${ty})`}
          />
        ))}
        <circle cx={tx} cy={ty} r={6.5} fill="#FDF3C7" />
      </motion.g>
    </motion.g>
  );
}

/**
 * One vase and everything in it.
 *
 * Rendered twice — the original and the copy dragged out of it — so it takes no
 * position of its own. Whatever transform the caller puts on the wrapping group
 * is what places it.
 */
function VaseContent({ grown, active, raining }: { grown: boolean; active: boolean; raining: boolean }) {
  return (
    <>
      {FLOWERS.map((flower, i) => (
        <Flower key={i} flower={flower} index={i} grown={grown} active={active} />
      ))}

      {LEAVES.map((leaf, i) => (
        <motion.ellipse
          key={i}
          cx={leaf.x}
          cy={leaf.y}
          rx={leaf.rx}
          ry={leaf.ry}
          fill="#37A863"
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: grown ? 1 : 0, opacity: grown ? 0.95 : 0, rotate: leaf.rot }}
          transition={{ duration: 0.5, delay: grown ? 0.3 + i * 0.08 : 0, ease: [0.34, 1.56, 0.64, 1] }}
        />
      ))}

      {/*
       * The square and the vase are the same element. Morphing `d` rather than
       * cross-fading two shapes is what makes the square *become* the vase
       * instead of one being swapped for the other.
       */}
      <motion.path
        initial={{ d: SQUARE_PATH }}
        animate={{ d: grown ? VASE_PATH : SQUARE_PATH }}
        transition={{ duration: 0.85, ease: [0.65, 0, 0.35, 1] }}
        fill="url(#fx-vase)"
        stroke="#46579B"
        strokeWidth={1.5}
      />

      <motion.ellipse
        cx={200}
        cy={244}
        rx={32}
        ry={7}
        fill="#2C3A72"
        stroke="#4A5C9F"
        strokeWidth={1.5}
        animate={{ opacity: grown ? 1 : 0 }}
        transition={{ duration: 0.4, delay: grown ? 0.5 : 0 }}
      />
      <motion.path
        d="M180,252 Q176,282 183,306"
        fill="none"
        stroke="rgba(255,255,255,0.16)"
        strokeWidth={3}
        strokeLinecap="round"
        animate={{ opacity: grown ? 1 : 0 }}
        transition={{ duration: 0.4, delay: grown ? 0.5 : 0 }}
      />

      <motion.ellipse
        cx={200}
        cy={244}
        rx={26}
        ry={4.5}
        fill="#6FA8FF"
        animate={
          raining && active
            ? { rx: [26, 28, 26], opacity: [0.42, 0.6, 0.42] }
            : { rx: 26, opacity: grown ? 0.5 : 0 }
        }
        transition={
          raining && active
            ? { duration: 2.8, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }
            : { duration: 0.4, delay: grown ? 0.5 : 0 }
        }
      />
    </>
  );
}

/** The editor's selection box: dashed yellow, with corner handles. */
function SelectionBox({ shown }: { shown: boolean }) {
  const x = 100;
  const y = 62;
  const w = 200;
  const h = 260;

  return (
    <motion.g animate={{ opacity: shown ? 1 : 0 }} transition={{ duration: 0.26 }}>
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={YELLOW} strokeWidth={2} strokeDasharray="7 5" opacity={0.9} />
      {[
        [x, y],
        [x + w, y],
        [x, y + h],
        [x + w, y + h],
      ].map(([hx, hy], i) => (
        <rect key={i} x={hx - 4.5} y={hy - 4.5} width={9} height={9} fill={YELLOW} stroke="#0b1020" strokeWidth={1} />
      ))}
    </motion.g>
  );
}

function Cursor({
  x,
  y,
  colour,
  name,
  visible,
  delay = 0,
  travel = 0.75,
}: {
  x: number;
  y: number;
  colour: string;
  name: string;
  visible: boolean;
  delay?: number;
  travel?: number;
}) {
  return (
    <motion.div
      className="absolute z-20 pointer-events-none"
      initial={false}
      animate={{ left: `${x}%`, top: `${y}%`, opacity: visible ? 1 : 0, scale: visible ? 1 : 0.6 }}
      transition={{
        opacity: { duration: 0.3, delay },
        scale: { duration: 0.3, delay },
        // The travel is the slow part — a cursor that teleports reads as a state
        // change rather than as somebody moving.
        left: { duration: travel, ease: [0.22, 1, 0.36, 1] },
        top: { duration: travel, ease: [0.22, 1, 0.36, 1] },
      }}
    >
      <svg width="20" height="22" viewBox="0 0 20 22" fill="none">
        <path d="M2 1.5 L2 17 L6.2 13.2 L9 19.6 L12 18.2 L9.2 12 L15 12 Z" fill={colour} stroke="#0b1020" strokeWidth={1.3} strokeLinejoin="round" />
      </svg>
      <span
        className="absolute left-4 top-4 px-1.5 py-0.5 rounded font-mono text-[9px] whitespace-nowrap"
        style={{ background: colour, color: '#0b1020' }}
      >
        {name}
      </span>
    </motion.div>
  );
}

function VaseScene({ step, active }: { step: number; active: boolean }) {
  const grown = step >= S.morph;
  const selected = step >= S.select && step <= S.duplicate;
  const duplicated = step >= S.duplicate;
  const raining = step >= S.raining;

  /*
   * The arrangement is drawn around x=200 but only occupies about a third of the
   * frame at scale 1, which is what made it read as small. It sits at 1.22 while
   * it is the only thing on screen, then steps back to 0.94 and slides left when
   * the copy needs room. Scaled about the vase's foot, so it grows upward off
   * the ground rather than out of its own middle.
   */
  const mainScale = duplicated ? 0.94 : 1.22;
  const mainX = duplicated ? -62 : 0;

  return (
    <svg viewBox="0 0 400 330" className="w-full h-full" role="img" aria-label="A square morphing into a vase of flowers, copied and rained on">
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

      <ellipse cx={200} cy={180} rx={190} ry={150} fill="url(#fx-vase-glow)" />

      {/* Rain falls on the whole scene, so it is drawn once at scene level and
          not inside either vase. It exists only after the control is pressed —
          a control shown being pressed has to visibly cause something. */}
      {raining &&
        RAIN.map((drop, i) => (
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

      {/* The copy. It starts exactly on top of the original at the same size, so
          what you see is one being pulled out of the other rather than a second
          one fading in somewhere else. */}
      <motion.g
        style={{ transformBox: 'view-box', transformOrigin: '200px 314px' }}
        initial={false}
        animate={
          duplicated
            ? { opacity: 1, x: 112, scale: 0.6 }
            : { opacity: 0, x: mainX, scale: mainScale }
        }
        transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
      >
        <VaseContent grown={grown} active={active} raining={raining} />
      </motion.g>

      <motion.g
        style={{ transformBox: 'view-box', transformOrigin: '200px 314px' }}
        initial={false}
        animate={{ x: mainX, scale: mainScale }}
        transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
      >
        <VaseContent grown={grown} active={active} raining={raining} />
        <SelectionBox shown={selected} />
      </motion.g>
    </svg>
  );
}

export function PromptToArt() {
  const { ref, active } = useDemo();
  const [step, setStep] = useState<number>(S.idle);
  const [typed, setTyped] = useState('');
  const [wide, setWide] = useState(true);
  const started = useRef(false);

  /*
   * How far the box leaves by depends on whether the artwork has a column of its
   * own. From `lg` the art sits in the right 52%, so the box can stop with a
   * third of itself still showing. Below that the art is full width and a sliver
   * of chat box would sit on top of the vase, so it goes all the way out. Read
   * after mount, to keep server and client markup identical.
   */
  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)');
    const sync = () => setWide(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));

    const run = () => {
      if (started.current) return;
      started.current = true;

      // Reduced motion gets the finished state, not a faster sequence: the
      // outcome is the artwork, so the artwork is what it gets.
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setTyped(PROMPT);
        setStep(S.raining);
        return;
      }

      let t = STEP.wait;
      const then = (ms: number, s: number) => {
        t += ms;
        at(t, () => setStep(s));
      };

      at(t, () => setStep(S.box));

      t += STEP.box;
      at(t, () => setStep(S.typing));
      // Only the first five words are typed out.
      for (let i = 1; i <= HEAD.length; i++) {
        at(t + i * STEP.perChar, () => setTyped(HEAD.slice(0, i)));
      }
      t += HEAD.length * STEP.perChar;
      /* Then the rest lands in one go, and the send button ungreys on the same
         frame — the button becoming live *is* the signal that the prompt is
         complete, so it cannot lag behind the text. */
      t += STEP.head;
      at(t, () => {
        setTyped(PROMPT);
        setStep(S.ready);
      });

      then(STEP.ready, S.click);
      then(STEP.click, S.slide);
      then(STEP.slide, S.loading);
      then(STEP.loading, S.square);
      then(STEP.square, S.morph);
      then(STEP.morph, S.cursors);
      then(STEP.cursors, S.select);
      then(STEP.select, S.duplicate);
      then(STEP.duplicate, S.button);
      then(STEP.button, S.press);
      then(STEP.press, S.raining);
    };

    /* Starts on arrival. A sequence that finished before you scrolled to it has
       shown nobody anything. */
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

  const boxIn = step >= S.box;
  const typing = step === S.typing;
  const ready = step >= S.ready;
  const pressed = step === S.click;
  const slid = step >= S.slide;
  const artIn = step >= S.square;
  const cursorsIn = step >= S.cursors;
  const buttonIn = step >= S.button && step <= S.press;
  const buttonPressed = step === S.press;

  /*
   * Where Claude's cursor is at each stage: idle, then on the vase to select it,
   * then carrying the copy out to the right, then up to the control.
   */
  const claudeAt =
    step >= S.button
      ? { x: 50, y: 14 }
      : step >= S.duplicate
        ? { x: 74, y: 62 }
        : step >= S.select
          ? { x: 44, y: 54 }
          : { x: 80, y: 72 };

  return (
    <div ref={ref} className="relative w-full h-[64vh] min-h-[440px] md:min-h-[560px] overflow-hidden">
      {/* Artwork. Positioning on the wrapper, animation on the child — an inline
          transform from framer would otherwise overwrite Tailwind's translate. */}
      <div className="absolute inset-y-0 right-0 w-full lg:w-[54%] flex items-center justify-center px-4 pointer-events-none">
        <motion.div
          className="relative w-full max-w-[560px] aspect-[400/330]"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={artIn ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <VaseScene step={step} active={active} />

          {/* The control the cursor presses. Sits above the flowers. */}
          <motion.div
            className="absolute z-10 -translate-x-1/2"
            style={{ left: '50%', top: '7%' }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: buttonIn ? 1 : 0, y: buttonIn ? 0 : -8 }}
            transition={{ duration: 0.28 }}
          >
            <motion.span
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-mono text-[10px] sm:text-[11px] tracking-wide whitespace-nowrap"
              style={{
                background: 'rgba(22, 33, 68, 0.95)',
                borderColor: 'rgba(245,197,24,0.5)',
                color: YELLOW,
              }}
              animate={{ scale: buttonPressed ? 0.9 : 1 }}
              transition={{ duration: 0.16 }}
            >
              <Sparkles className="w-3 h-3" strokeWidth={2} />
              rain particles
              <motion.span
                className="absolute inset-0 rounded-full border-2 pointer-events-none"
                style={{ borderColor: YELLOW }}
                initial={{ opacity: 0, scale: 1 }}
                animate={buttonPressed ? { opacity: [0.9, 0], scale: [1, 1.8] } : { opacity: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </motion.span>
          </motion.div>

          {/*
           * Two cursors, because the point is that somebody who is not you is
           * working in the document. The yellow one does the work; the blue one
           * just exists, which is what makes the first read as one of several
           * rather than a scripted pointer.
           */}
          <Cursor {...claudeAt} colour={YELLOW} name="Claude" visible={cursorsIn} travel={0.9} />
          <Cursor x={18} y={30} colour="#6FA8FF" name="You" visible={cursorsIn} delay={0.18} />
        </motion.div>
      </div>

      {/* The wait, where the artwork will be. */}
      <div className="absolute inset-y-0 right-0 w-full lg:w-[54%] flex items-center justify-center pointer-events-none">
        <motion.span
          className="w-9 h-9 rounded-full border-2 border-fx-border"
          style={{ borderTopColor: YELLOW }}
          animate={step === S.loading ? { opacity: 1, rotate: 360 } : { opacity: 0, rotate: 0 }}
          transition={{
            rotate: { duration: 0.55, repeat: Number.POSITIVE_INFINITY, ease: 'linear' },
            opacity: { duration: 0.14 },
          }}
        />
      </div>

      {/* The chat box. Centred by the flex parent, then moved with `x`, so no
          Tailwind translate is involved for framer to overwrite. */}
      <div className="absolute inset-0 flex items-center justify-center px-4 pointer-events-none">
        <motion.div
          className="relative w-[92vw] sm:w-[74vw] lg:w-[50vw] rounded-[28px] sm:rounded-[34px] border flex flex-col p-5 sm:p-6"
          style={{
            minHeight: '20vh',
            background: 'rgba(22, 33, 68, 0.94)',
            borderColor: 'rgba(245, 197, 24, 0.75)',
          }}
          initial={{ opacity: 0, y: 46, scale: 0.9 }}
          animate={{
            opacity: boxIn ? 1 : 0,
            y: boxIn ? 0 : 46,
            scale: boxIn ? 1 : 0.9,
            /* Leaves at full size — no scale. Most of it ends up past the left
               edge, which is the point: it has had its turn. `overflow-hidden`
               on the stage clips it. */
            x: slid ? (wide ? '-78%' : '-118%') : '0%',
          }}
          /* The exit is slow and eased at both ends; the arrival is not. They
             are different gestures and should not share a curve. */
          transition={
            slid
              ? { duration: STEP.slide / 1000, ease: [0.5, 0, 0.5, 1] }
              : { duration: 0.62, ease: [0.22, 1, 0.36, 1] }
          }
        >
          {/* The glow. A separate layer animating `opacity` only — an animated
              box-shadow would repaint the whole box every frame. */}
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 rounded-[inherit] pointer-events-none"
            style={{ boxShadow: '0 0 38px rgba(245,197,24,0.5), inset 0 0 26px rgba(245,197,24,0.12)' }}
            animate={active && boxIn ? { opacity: [0.5, 1, 0.5] } : { opacity: 0.75 }}
            transition={
              active && boxIn
                ? { duration: 2.6, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }
                : { duration: 0.4 }
            }
          />

          <p
            className="flex-1 text-base sm:text-lg lg:text-xl leading-relaxed text-fx-text-primary"
            style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
          >
            {typed || <span className="text-fx-text-secondary">Describe the animation you want&hellip;</span>}
            {typing && (
              <motion.span
                className="inline-block w-[2px] h-[1.05em] align-[-0.15em] ml-0.5 bg-fx-accent-yellow"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.9, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
              />
            )}
          </p>

          {/* `mt-auto` pins the row to the bottom of the box however tall it
              gets — it used to sit against the text and float mid-height. */}
          <div className="mt-auto pt-5 flex items-center gap-2">
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

            {/* Disabled until there is something to send. A live-looking button
                over an empty field is the small lie that makes the rest of the
                sequence feel staged. */}
            <motion.span
              className="relative flex items-center gap-2 px-3.5 sm:px-5 py-2 rounded-full font-semibold text-xs sm:text-sm"
              animate={{
                scale: pressed ? 0.93 : 1,
                background: ready
                  ? 'linear-gradient(135deg, #ffd84d 0%, #f5c518 44%, #e9a908 100%)'
                  : 'linear-gradient(135deg, #33406e 0%, #2b3760 100%)',
                color: ready ? '#0b1020' : 'rgba(230,237,243,0.38)',
              }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              Edit now
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
              <motion.span
                className="absolute inset-0 rounded-full border-2 border-fx-accent-yellow pointer-events-none"
                initial={{ opacity: 0, scale: 1 }}
                animate={pressed ? { opacity: [0.9, 0], scale: [1, 1.7] } : { opacity: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </motion.span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
