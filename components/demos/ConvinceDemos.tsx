'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Layers, MessageSquare, Puzzle, Undo2, Redo2 } from 'lucide-react';
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

/* ── 1. Six agents on one edit ─────────────────────────────────────────── */

/*
 * A canvas with six cursors on it and the timeline they are all working.
 *
 * Every clip is owned by an agent, marked by a colour band above the track, and
 * each agent does something to its own clips on its own beat: one slides, one
 * trims, one deletes. That they are all mid-edit in the same frame is the claim,
 * so nothing here waits its turn.
 *
 * No panel around it — this reads as the editor itself rather than a screenshot
 * of one, which is why `FeatureBlock` gets it without a card.
 */

const AGENT_COLOURS = [Y, B, G, K, P, '#F0883E'];

/** Clip id, owning agent, start and width in track fractions, and its verb. */
const CLIPS = [
  { agent: 0, from: 0.0, w: 0.15, act: 'move' },
  { agent: 0, from: 0.16, w: 0.09, act: 'trim' },
  { agent: 1, from: 0.26, w: 0.13, act: 'delete' },
  { agent: 1, from: 0.4, w: 0.08, act: 'move' },
  { agent: 2, from: 0.49, w: 0.12, act: 'trim' },
  { agent: 3, from: 0.62, w: 0.1, act: 'move' },
  { agent: 3, from: 0.73, w: 0.07, act: 'delete' },
  { agent: 4, from: 0.81, w: 0.09, act: 'trim' },
  { agent: 5, from: 0.91, w: 0.09, act: 'move' },
];

/* Where each agent's cursor sits on the canvas, and how far it drifts. */
const CURSORS = [
  { x: 18, y: 26, dx: 7, dy: 5 },
  { x: 44, y: 62, dx: -6, dy: 8 },
  { x: 68, y: 30, dx: 8, dy: -6 },
  { x: 30, y: 74, dx: 5, dy: -7 },
  { x: 82, y: 58, dx: -7, dy: 6 },
  { x: 56, y: 18, dx: 6, dy: 7 },
];

export function AgentLanes() {
  const { ref, active } = useDemo();
  const t = useClock(8, active);

  return (
    <div ref={ref} className="relative w-full aspect-[16/10] flex flex-col gap-2">
      {/* Canvas, with every agent's pointer live on it at once. */}
      <div
        className="relative flex-1 min-h-0 rounded-lg overflow-hidden"
        style={{ background: 'rgba(12, 18, 40, 0.75)', border: '1px solid rgba(230,237,243,0.08)' }}
      >
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
          <defs>
            <pattern id="fx-agent-grid" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M8 0 L0 0 0 8" fill="none" stroke="rgba(230,237,243,0.05)" strokeWidth="0.4" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#fx-agent-grid)" />
        </svg>

        {CURSORS.map((c, i) => {
          // Each drifts on its own phase, so six pointers never move as one.
          const phase = (t + i / CURSORS.length) % 1;
          const wob = Math.sin(phase * Math.PI * 2);
          return (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${c.x + c.dx * wob}%`,
                top: `${c.y + c.dy * Math.cos(phase * Math.PI * 2)}%`,
                transition: 'left 120ms linear, top 120ms linear',
              }}
            >
              <svg width="17" height="19" viewBox="0 0 20 22" fill="none">
                <path
                  d="M2 1.5 L2 17 L6.2 13.2 L9 19.6 L12 18.2 L9.2 12 L15 12 Z"
                  fill={AGENT_COLOURS[i]}
                  stroke="#0b1020"
                  strokeWidth={1.3}
                  strokeLinejoin="round"
                />
              </svg>
              <span
                className="absolute left-3.5 top-3.5 px-1 py-0.5 rounded font-mono text-[8px] whitespace-nowrap"
                style={{ background: AGENT_COLOURS[i], color: '#0b1020' }}
              >
                agent {i + 1}
              </span>
            </div>
          );
        })}
      </div>

      {/* Ownership band: which stretch of the edit belongs to whom. */}
      <div className="relative h-3 flex-shrink-0">
        {AGENT_COLOURS.map((colour, i) => {
          const own = CLIPS.filter((c) => c.agent === i);
          if (!own.length) return null;
          const from = Math.min(...own.map((c) => c.from));
          const to = Math.max(...own.map((c) => c.from + c.w));
          return (
            <div
              key={i}
              className="absolute inset-y-0 rounded-full flex items-center justify-center"
              style={{ left: `${from * 100}%`, width: `${(to - from) * 100 - 0.5}%`, background: `${colour}55`, border: `1px solid ${colour}` }}
            >
              <span className="font-mono text-[7px] leading-none" style={{ color: colour }}>
                {i + 1}
              </span>
            </div>
          );
        })}
      </div>

      {/* The track. Each clip acts on its own phase of the same clock. */}
      <div
        className="relative h-12 sm:h-14 flex-shrink-0 rounded-lg overflow-hidden"
        style={{ background: 'rgba(11, 17, 38, 0.9)', border: '1px solid rgba(230,237,243,0.08)' }}
      >
        {CLIPS.map((c, i) => {
          const phase = (t + i * 0.11) % 1;
          const beat = Math.sin(phase * Math.PI * 2);

          // move: slides along the track. trim: its width breathes. delete: it
          // drops out for part of the cycle and comes back.
          const shift = c.act === 'move' ? beat * 2.2 : 0;
          const grow = c.act === 'trim' ? beat * 2.6 : 0;
          const gone = c.act === 'delete' && phase > 0.55 && phase < 0.8;
          const colour = AGENT_COLOURS[c.agent];

          return (
            <motion.div
              key={i}
              className="absolute top-1.5 bottom-1.5 rounded flex items-center px-1.5"
              style={{
                left: `${c.from * 100 + shift}%`,
                width: `${Math.max(3, c.w * 100 + grow) - 0.6}%`,
                background: `${colour}30`,
                border: `1px solid ${colour}`,
              }}
              animate={{ opacity: gone ? 0 : 1, scaleY: gone ? 0.7 : 1 }}
              transition={{ duration: 0.26 }}
            >
              <span className="font-mono text-[7px] sm:text-[8px] truncate" style={{ color: colour }}>
                {c.act}
              </span>
            </motion.div>
          );
        })}

        {/* One playhead over the whole edit, so it reads as a single timeline
            rather than six unrelated strips. */}
        <div
          className="absolute inset-y-0 w-[2px] pointer-events-none"
          style={{ left: `${t * 100}%`, background: '#fff', opacity: 0.55 }}
        />
      </div>

      <div className="flex-shrink-0 flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-fx-text-secondary/70">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3 h-3" style={{ color: Y }} strokeWidth={2.5} />
          six agents, one edit
        </span>
        <span>all at once</span>
      </div>
    </div>
  );
}

/* -- 2. It edits, and every edit is reversible --------------------------- */

/*
 * A layer gets selected, its properties get changed, and then the change gets
 * taken back.
 *
 * Undo and redo are the whole argument in two buttons. A generated video has no
 * undo — there is nothing to step back through, only a file. Watching values
 * move and then unmove is the shortest way to say that what the AI produced is
 * a document with a history rather than a render.
 *
 * The values are derived from where the cycle is, not animated toward a second
 * hard-coded set, so "undo" genuinely returns the numbers it started from.
 */

const PROPS = [
  { name: 'Scale', from: 100, to: 148, unit: '%' },
  { name: 'Rotation', from: 0, to: 24, unit: '°' },
  { name: 'Opacity', from: 100, to: 62, unit: '%' },
  { name: 'Blur', from: 0, to: 12, unit: 'px' },
];

const EDIT_LAYERS = [
  { name: 'title', colour: Y },
  { name: 'subject', colour: K },
  { name: 'trees', colour: G },
  { name: 'sky', colour: B },
];

/** Stages of one pass, as fractions of the cycle. */
const PICK = 0.14;
const CHANGE = 0.3;
const UNDO = 0.62;
const REDO = 0.82;

export function EditNotGenerate() {
  const { ref, active } = useDemo();
  const t = useClock(11, active);

  const picked = t > PICK;
  const changing = t > CHANGE;
  const undone = t > UNDO && t < REDO;
  const redone = t > REDO;
  const applied = changing && !undone;

  /* Applied, taken back, put back. Ramping from whichever stage we are in keeps
     the sliders in step with the buttons instead of drifting past them. */
  const ramp = !changing || undone ? 0 : Math.min(1, (t - (redone ? REDO : CHANGE)) / 0.12);

  return (
    <div ref={ref} className={`${shell} aspect-[4/3] flex flex-col`} style={shellBg}>
      {/* The two buttons that carry the claim. */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-fx-border flex-shrink-0">
        {([
          { Icon: Undo2, label: 'undo', on: undone },
          { Icon: Redo2, label: 'redo', on: redone },
        ] as const).map(({ Icon, label, on }) => (
          <motion.span
            key={label}
            className="flex items-center gap-1 px-2 py-1 rounded font-mono text-[9px] uppercase tracking-wide"
            style={{ border: '1px solid' }}
            animate={{
              borderColor: on ? Y : 'rgba(230,237,243,0.16)',
              color: on ? Y : 'rgba(230,237,243,0.5)',
              backgroundColor: on ? 'rgba(245,197,24,0.14)' : 'rgba(0,0,0,0)',
              scale: on ? 0.94 : 1,
            }}
            transition={{ duration: 0.18 }}
          >
            <Icon className="w-3 h-3" strokeWidth={2.5} />
            {label}
          </motion.span>
        ))}

        <span className="flex-1" />
        <span
          className="font-mono text-[9px] uppercase tracking-widest"
          style={{ color: undone ? Y : applied ? G : 'rgba(230,237,243,0.4)' }}
        >
          {undone ? 'reverted' : applied ? 'edited' : 'ready'}
        </span>
      </div>

      <div className="relative flex-1 min-h-0 flex">
        {/* Layers, one of which gets picked. */}
        <div className="w-[38%] flex-shrink-0 border-r border-fx-border p-2 space-y-1.5">
          {EDIT_LAYERS.map((l, i) => {
            const isPicked = picked && i === 1;
            return (
              <motion.div
                key={l.name}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded"
                style={{ border: '1px solid transparent' }}
                animate={{
                  backgroundColor: isPicked ? `${l.colour}26` : 'rgba(230,237,243,0.04)',
                  borderColor: isPicked ? l.colour : 'rgba(0,0,0,0)',
                }}
                transition={{ duration: 0.25 }}
              >
                <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: l.colour }} />
                <span
                  className="font-mono text-[9px] truncate"
                  style={{ color: isPicked ? l.colour : 'rgba(230,237,243,0.55)' }}
                >
                  {l.name}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Properties: sliders that move, then move back. */}
        <div className="flex-1 min-w-0 p-3 flex flex-col justify-center gap-3">
          {PROPS.map((prop, i) => {
            const value = prop.from + (prop.to - prop.from) * ramp;
            const span = Math.abs(prop.to - prop.from) || 1;
            const pct = Math.min(1, Math.max(0, (value - Math.min(prop.from, prop.to)) / span));
            return (
              <motion.div
                key={prop.name}
                animate={{ opacity: picked ? 1 : 0.25 }}
                transition={{ duration: 0.3, delay: picked ? i * 0.05 : 0 }}
              >
                <div className="flex items-baseline justify-between mb-1">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-fx-text-secondary">
                    {prop.name}
                  </span>
                  <span
                    className="font-mono text-[10px] tabular-nums"
                    style={{ color: applied ? Y : 'rgba(230,237,243,0.5)' }}
                  >
                    {Math.round(value)}
                    {prop.unit}
                  </span>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(230,237,243,0.1)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: Y }}
                    animate={{ width: `${pct * 100}%` }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* The pointer: to the layer, then up to whichever button is firing. */}
        <motion.div
          className="absolute pointer-events-none z-10"
          animate={{
            left: undone ? '6%' : redone ? '17%' : picked ? '26%' : '16%',
            top: undone || redone ? '-6%' : picked ? '26%' : '62%',
          }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <svg width="16" height="18" viewBox="0 0 20 22" fill="none">
            <path
              d="M2 1.5 L2 17 L6.2 13.2 L9 19.6 L12 18.2 L9.2 12 L15 12 Z"
              fill="#ffffff"
              stroke="#0b1020"
              strokeWidth={1.3}
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </div>

      <div className="flex-shrink-0 border-t border-fx-border px-3 py-2 text-center font-mono text-[8px] sm:text-[9px] uppercase tracking-widest text-fx-text-secondary/60">
        a generated video has no undo
      </div>
    </div>
  );
}

/* ── 3. Ask it how ─────────────────────────────────────────────────────── */

const QUESTION = 'how do I edit the interpolation?';
const ANSWER = 'Select the keyframe, then open the easing panel. Drag either handle to reshape the curve.';

/*
 * The question types, and only then does the answer. Running both off one clock
 * with fixed windows is what guarantees the order: the answer cannot start
 * early, because its window does not open until the question's has closed.
 */
const Q_END = 0.3;
const A_START = 0.36;
const A_END = 0.78;

export function AskAI() {
  const { ref, active } = useDemo();
  const t = useClock(12, active);

  const typed = QUESTION.slice(0, Math.round(Math.min(1, t / Q_END) * QUESTION.length));
  const asking = t < Q_END;

  const answerProgress = Math.min(1, Math.max(0, (t - A_START) / (A_END - A_START)));
  const answer = ANSWER.slice(0, Math.round(answerProgress * ANSWER.length));
  const answering = t >= A_START && answerProgress < 1;
  const answered = t >= A_START;

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
          {asking && <span className="inline-block w-[2px] h-[1em] align-middle ml-0.5 bg-fx-accent-yellow" />}
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
        <span className="text-xs sm:text-sm text-fx-text-secondary leading-relaxed min-h-[2.5em]">
          {answer}
          {answering && <span className="inline-block w-[2px] h-[1em] align-middle ml-0.5 bg-fx-accent-yellow" />}
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
              animate={answerProgress >= 1 ? { cy: [50, 34, 50] } : { cy: 50 }}
              transition={answerProgress >= 1 ? { duration: 2.6, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' } : { duration: 0 }}
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

/* -- 5. Three sources feeding the thing above ---------------------------- */

/*
 * Plugins, templates and presets, piped upward into the FlashFX mark that ends
 * the section above this one.
 *
 * The two animations are meant to read as one. Up there, four cables come down
 * into FlashFX; down here, three tubes leave the top of the frame heading for
 * the same place. Everything on the page flows into the middle from both
 * directions, and this half is the half that never stops arriving.
 *
 * The tubes are deliberately heavier than those cables — 16 against 3 — and
 * drawn as a dark casing with a lit core inside it, so they read as something
 * carrying cargo rather than as a thicker line. Each bows differently but none
 * crosses another: they run parallel out of the top, which is what makes them
 * look like three feeds into one socket instead of a knot.
 */

const FEEDS = [
  { label: 'Plugins', Icon: Puzzle, colour: Y, x: 70, exit: 168 },
  { label: 'Templates', Icon: Layers, colour: B, x: 200, exit: 200 },
  { label: 'Presets', Icon: Sparkles, colour: K, x: 330, exit: 232 },
];

const TUBE_VB = { w: 400, h: 520 };

/** A tube from a box up and off the top of the frame. */
function tubePath(sx: number, ex: number, i: number) {
  return `M${sx},438 C${sx},${348 - i * 26} ${ex},${262 + i * 30} ${ex},-10`;
}

export function Endless() {
  const { ref, active } = useDemo();

  return (
    <div ref={ref} className={`${shell} aspect-[4/5]`} style={shellBg}>
      <svg viewBox={`0 0 ${TUBE_VB.w} ${TUBE_VB.h}`} className="absolute inset-0 w-full h-full">
        <defs>
          {FEEDS.map((f) => (
            <linearGradient key={f.label} id={`fx-tube-${f.label}`} x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor={f.colour} stopOpacity="0.85" />
              <stop offset="100%" stopColor={f.colour} stopOpacity="0.25" />
            </linearGradient>
          ))}
        </defs>

        {FEEDS.map((f, i) => {
          const d = tubePath(f.x, f.exit, i);
          return (
            <g key={f.label}>
              {/* Casing, then the lit core inside it. Two strokes on one path
                  is what turns a line into a pipe. */}
              <path d={d} fill="none" stroke="#0d1430" strokeWidth={16} strokeLinecap="round" />
              <path d={d} fill="none" stroke={`url(#fx-tube-${f.label})`} strokeWidth={10} strokeLinecap="round" />
              <path d={d} fill="none" stroke={f.colour} strokeWidth={2} strokeLinecap="round" opacity={0.5} />

              {/* Cargo, travelling the path itself so it follows every bend. */}
              {active &&
                [0, 1, 2].map((k) => (
                  <rect key={k} x={-5} y={-5} width={10} height={10} rx={2.5} fill={f.colour}>
                    <animateMotion
                      dur="3.4s"
                      begin={`${i * 0.5 + k * 1.13}s`}
                      repeatCount="indefinite"
                      path={d}
                      keyPoints="1;0"
                      keyTimes="0;1"
                      calcMode="linear"
                    />
                  </rect>
                ))}
            </g>
          );
        })}

        {/* The three sources. */}
        {FEEDS.map((f) => (
          <g key={`box-${f.label}`}>
            <rect
              x={f.x - 46}
              y={438}
              width={92}
              height={62}
              rx={12}
              fill="rgba(20, 31, 64, 0.95)"
              stroke={f.colour}
              strokeWidth={2}
            />
          </g>
        ))}
      </svg>

      {/* Labels and icons as DOM, so the type stays crisp at any size. */}
      {FEEDS.map((f) => (
        <div
          key={`lbl-${f.label}`}
          className="absolute -translate-x-1/2 flex flex-col items-center gap-1"
          style={{ left: `${(f.x / TUBE_VB.w) * 100}%`, top: `${(452 / TUBE_VB.h) * 100}%` }}
        >
          <f.Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: f.colour }} strokeWidth={2.5} />
          <span className="font-mono text-[8px] sm:text-[10px] uppercase tracking-widest" style={{ color: f.colour }}>
            {f.label}
          </span>
        </div>
      ))}

      <span className="absolute top-3 left-1/2 -translate-x-1/2 font-mono text-[9px] uppercase tracking-widest text-fx-text-secondary/60 whitespace-nowrap">
        official and user-made, always arriving
      </span>
    </div>
  );
}
