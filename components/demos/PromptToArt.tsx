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
 * on, and then edited further by cursors that are visibly not yours.
 *
 * ── The sequence ────────────────────────────────────────────────────────────
 *
 *   1s pause   nothing, deliberately — see `run()`
 *   box        the chat box arrives, glowing
 *   typing     the prompt is typed a character at a time
 *   ready      "Edit now" comes out of its disabled state
 *   click      the button is pressed, with a ring
 *   slide      the box leaves to the left, at full size, partly off screen
 *   loading    a 300 ms spinner where the artwork will be
 *   square     a plain square, which is where every animation starts
 *   morph      the square becomes a vase and five flowers grow out of it
 *   cursors    two cursors arrive — somebody else is in the document
 *   button     a "rain particles" control appears over the flowers
 *   click      a cursor presses it, the control disappears
 *   raining    rain falls, and nothing stops moving again
 *
 * Every duration is in `STEP`, and `run()` adds them up in order. There is one
 * clock and one place to change it.
 *
 * ── Why the loops are gated ─────────────────────────────────────────────────
 *
 * The sway, the rain, the water line and the box's glow all run forever, so
 * they go through `useDemo()` — `useAmbient` at demo priority — rather than a
 * bare `repeat: Infinity`. Without a slot the scene holds grown flowers and
 * stops moving; it never goes blank.
 */

const PROMPT = 'a vase that grows flowers when watered, make the flowers move dynamically';

/* Milliseconds, each measured from the end of the step before it. */
const STEP = {
  /* The brief asked for a second of stillness before anything happens. It is
     what makes the box read as arriving rather than as having always been
     there, and it gives the eye time to reach the section. */
  wait: 1000,
  box: 700,
  perChar: 34,
  ready: 420,
  click: 300,
  slide: 620,
  loading: 300,
  square: 520,
  morph: 1500,
  cursors: 520,
  button: 900,
  press: 340,
};

/*
 * The sequence as one ordered list. `step` below is an index into this, so a
 * stage is `step >= S.morph` rather than a string comparison nobody can audit.
 */
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
  button: 10,
  press: 11,
  raining: 12,
} as const;

const YELLOW = '#F5C518';
const PURPLE = '#7C5CBF';
const BLUE = '#2D6BE4';
const GREEN = '#4ADE80';
const PINK = '#E86A9B';

/*
 * Square and vase share a command structure — M, L, Q, L, Q, L, Z, sixteen
 * numbers each — which is the condition for framer-motion to interpolate `d`
 * between them. Change one and you must change the other in the same shape, or
 * the morph turns into a cut.
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

/* Index-derived, not random: Math.random() during render differs between the
   server and the client and trips a hydration mismatch. */
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
     * Sway pivots at the vase mouth, not the group's own centre — a stem bends
     * where it is held. `transformBox: view-box` makes "200px 246px" resolve in
     * the SVG's coordinate space rather than the element's bounding box.
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
        transition={{ duration: 0.8, delay: grown ? index * 0.1 : 0, ease: 'easeOut' }}
      />

      <motion.ellipse
        cx={(200 + tx) / 2 + (tx > 200 ? 9 : -9)}
        cy={(246 + ty) / 2 + 12}
        rx={11}
        ry={5}
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

/** A collaborator's pointer. Positioned in percentages of the art box. */
function Cursor({
  x,
  y,
  colour,
  name,
  visible,
  delay = 0,
}: {
  x: number;
  y: number;
  colour: string;
  name: string;
  visible: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      className="absolute z-20 pointer-events-none"
      initial={{ opacity: 0, scale: 0.6, left: `${x}%`, top: `${y}%` }}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.6, left: `${x}%`, top: `${y}%` }}
      transition={{
        opacity: { duration: 0.3, delay },
        scale: { duration: 0.3, delay },
        // The travel itself is the slow part — a cursor that teleports reads as
        // a state change rather than as somebody moving.
        left: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
        top: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
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
  const raining = step >= S.raining;

  return (
    <svg viewBox="0 0 400 330" className="w-full h-full" role="img" aria-label="A square morphing into a vase of flowers, watered by rain">
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

      {/* Rain only exists once the control has been pressed — that press is what
          the section is demonstrating, so it must visibly cause something. */}
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

      {FLOWERS.map((flower, i) => (
        <Flower key={i} flower={flower} index={i} grown={grown} active={active} />
      ))}

      {/*
       * The square and the vase are the same element. Morphing `d` rather than
       * cross-fading two shapes is what makes it read as the square *becoming*
       * the vase instead of one being swapped for the other.
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
   * third of itself still showing. Below that the art is full width, and a
   * sliver of chat box would sit on top of the vase — so it goes all the way
   * out. Read once, after mount, to keep the server and client markup identical.
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

      // One running clock. Each `then` reads as "and then, this long later".
      let t = STEP.wait;
      const then = (ms: number, s: number) => {
        t += ms;
        at(t, () => setStep(s));
      };

      at(t, () => setStep(S.box));

      t += STEP.box;
      at(t, () => setStep(S.typing));
      for (let i = 1; i <= PROMPT.length; i++) {
        at(t + i * STEP.perChar, () => setTyped(PROMPT.slice(0, i)));
      }
      t += PROMPT.length * STEP.perChar;
      at(t, () => setStep(S.ready));

      then(STEP.ready, S.click);
      then(STEP.click, S.slide);
      then(STEP.slide, S.loading);
      then(STEP.loading, S.square);
      then(STEP.square, S.morph);
      then(STEP.morph, S.cursors);
      then(STEP.cursors, S.button);
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

  return (
    <div ref={ref} className="relative w-full h-[64vh] min-h-[440px] md:min-h-[520px] overflow-hidden">
      {/* Artwork. Positioning on the wrapper, animation on the child — an inline
          transform from framer would otherwise overwrite Tailwind's translate. */}
      <div className="absolute inset-y-0 right-0 w-full lg:w-[52%] flex items-center justify-center px-6 pointer-events-none">
        <motion.div
          className="relative w-full max-w-[440px] aspect-[400/330]"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={artIn ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <VaseScene step={step} active={active} />

          {/* The control the cursor presses. Sits over the flowers. */}
          <motion.div
            className="absolute z-10 -translate-x-1/2"
            style={{ left: '50%', top: '20%' }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: buttonIn ? 1 : 0, y: buttonIn ? 0 : -8 }}
            transition={{ duration: 0.28 }}
          >
            <motion.span
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-mono text-[10px] sm:text-[11px] tracking-wide whitespace-nowrap"
              style={{
                background: 'rgba(22, 33, 68, 0.95)',
                borderColor: 'rgba(245,197,24,0.5)',
                color: '#F5C518',
              }}
              animate={{ scale: buttonPressed ? 0.9 : 1 }}
              transition={{ duration: 0.16 }}
            >
              <Sparkles className="w-3 h-3" strokeWidth={2} />
              rain particles
              <motion.span
                className="absolute inset-0 rounded-full border-2 pointer-events-none"
                style={{ borderColor: '#F5C518' }}
                initial={{ opacity: 0, scale: 1 }}
                animate={buttonPressed ? { opacity: [0.9, 0], scale: [1, 1.8] } : { opacity: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </motion.span>
          </motion.div>

          {/*
           * Two cursors, because the point is that somebody who is not you is
           * working in the document. The first travels to the control and
           * presses it; the second just exists, which is what makes the first
           * read as one of several rather than as a scripted pointer.
           */}
          <Cursor
            x={buttonIn || buttonPressed || step >= S.raining ? 52 : 78}
            y={buttonIn || buttonPressed || step >= S.raining ? 27 : 68}
            colour="#F5C518"
            name="Claude"
            visible={cursorsIn}
          />
          <Cursor x={22} y={58} colour="#6FA8FF" name="You" visible={cursorsIn} delay={0.18} />
        </motion.div>
      </div>

      {/* The wait, where the artwork will be. */}
      <div className="absolute inset-y-0 right-0 w-full lg:w-[52%] flex items-center justify-center pointer-events-none">
        <motion.span
          className="w-9 h-9 rounded-full border-2 border-fx-border"
          style={{ borderTopColor: '#f5c518' }}
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
            /*
             * Leaves at full size — no scale. Most of it ends up past the left
             * edge of the section, which is deliberate: it has had its turn, and
             * the artwork is the subject now. `overflow-hidden` on the stage
             * clips it cleanly.
             */
            x: slid ? (wide ? '-78%' : '-118%') : '0%',
          }}
          transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* The glow. A separate layer animating `opacity` only, rather than an
              animated box-shadow, which would repaint the box every frame. */}
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

          {/* `mt-auto` pins the row to the bottom of the box however tall the
              box gets — it used to sit against the text and float mid-height. */}
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

            {/*
             * Disabled until there is something to send. A live-looking button
             * over an empty field is the small lie that makes the rest of the
             * sequence feel staged; greying it out until the last character
             * lands is what makes the send read as a consequence.
             */}
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
