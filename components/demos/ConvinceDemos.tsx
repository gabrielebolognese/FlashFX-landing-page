'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Layers, MessageSquare, Puzzle, Undo2, Redo2, Scissors, Move, Trash2 } from 'lucide-react';
import { useDemo } from './demo-kit';

/*
 * The demos for the "Not convinced yet?" block.
 *
 * ── The rule they are built on ──────────────────────────────────────────────
 *
 * Each plays itself until somebody touches it, then stops and hands over.
 * `VectorPen` established that pattern on this site and it is the right one for
 * a page arguing its product is an editor: a demonstration you can take the
 * controls of is a different claim from one you watch, and the second is what
 * every competitor's landing page already has.
 *
 * So the scripted pass is a trailer, not the product. Once `taken` flips it does
 * not run again — replaying would drag the visitor's own state out from under
 * them, which is worse than never having offered.
 *
 * ── And the second rule ─────────────────────────────────────────────────────
 *
 * One source of state per demo; everything else derives from it. The undo demo
 * keeps a real history array and a pointer, so undo restores the numbers it
 * actually started from rather than easing toward a second set that resembles
 * them. That distinction is the entire section.
 */

const Y = '#F5C518';
const P = '#7C5CBF';
const B = '#5B8DEF';
const G = '#4ADE80';
const K = '#E86A9B';
const O = '#F0883E';

const panel = 'relative w-full rounded-2xl border border-fx-border overflow-hidden';
const panelBg = { background: 'rgba(14, 21, 46, 0.7)' };

/** A repeating 0..1 clock. Stops dead without a governor grant. */
function useClock(seconds: number, running: boolean) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      setT((((now - start) / 1000) % seconds) / seconds);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seconds, running]);
  return t;
}

/* ══ 1 ══ Multi-agent editing ═════════════════════════════════════════════ */

const AGENTS = [
  { id: 0, colour: Y, span: [0.0, 0.19] },
  { id: 1, colour: B, span: [0.19, 0.36] },
  { id: 2, colour: G, span: [0.36, 0.52] },
  { id: 3, colour: K, span: [0.52, 0.68] },
  { id: 4, colour: P, span: [0.68, 0.85] },
  { id: 5, colour: O, span: [0.85, 1.0] },
];

type Act = 'move' | 'trim' | 'cut';
const ACT_ICON = { move: Move, trim: Scissors, cut: Trash2 } as const;

/* Clips derived from each agent's span, so ownership is structural rather than
   a colour someone remembered to keep in step. */
const CLIPS = AGENTS.flatMap((a) => {
  const width = a.span[1] - a.span[0];
  const n = 2 + (a.id % 2);
  return Array.from({ length: n }, (_, j) => ({
    key: `${a.id}-${j}`,
    agent: a.id,
    from: a.span[0] + (width / n) * j + width * 0.05,
    w: (width / n) * 0.8,
    act: (['move', 'trim', 'cut'] as Act[])[(a.id + j) % 3],
  }));
});

const SEATS = [
  { x: 15, y: 28 }, { x: 38, y: 66 }, { x: 61, y: 24 },
  { x: 29, y: 80 }, { x: 84, y: 58 }, { x: 69, y: 84 },
];

export function AgentLanes() {
  const { ref, active } = useDemo();
  const [focus, setFocus] = useState<number | null>(null);
  const t = useClock(9, active);

  return (
    <div ref={ref} className="relative w-full">
      {/*
        Six chips, and hovering one isolates that agent everywhere at once — on
        the canvas, in the ownership band and on the track. Six simultaneous
        edits are unreadable otherwise; this is the handle that makes the claim
        inspectable instead of just busy.
      */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-3">
        {AGENTS.map((a) => {
          const on = focus === null || focus === a.id;
          return (
            <button
              key={a.id}
              type="button"
              onMouseEnter={() => setFocus(a.id)}
              onMouseLeave={() => setFocus(null)}
              onFocus={() => setFocus(a.id)}
              onBlur={() => setFocus(null)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[9px] sm:text-[10px] uppercase tracking-widest transition-all duration-200"
              style={{
                background: focus === a.id ? `${a.colour}2e` : 'rgba(230,237,243,0.05)',
                border: `1px solid ${focus === a.id ? a.colour : 'rgba(230,237,243,0.12)'}`,
                color: on ? a.colour : 'rgba(230,237,243,0.3)',
                opacity: on ? 1 : 0.4,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: a.colour }} />
              agent {a.id + 1}
            </button>
          );
        })}
      </div>

      {/* The canvas all six are working on. */}
      <div
        className="relative w-full aspect-[16/8] rounded-xl overflow-hidden"
        style={{ background: 'rgba(10, 16, 36, 0.8)', border: '1px solid rgba(230,237,243,0.08)' }}
      >
        <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
          <defs>
            <pattern id="fx-ag-grid" width="5" height="5" patternUnits="userSpaceOnUse">
              <path d="M5 0 L0 0 0 5" fill="none" stroke="rgba(230,237,243,0.05)" strokeWidth="0.25" />
            </pattern>
          </defs>
          <rect width="100" height="50" fill="url(#fx-ag-grid)" />
        </svg>

        {AGENTS.map((a, i) => {
          const seat = SEATS[i];
          const phase = (t + i / AGENTS.length) % 1;
          const on = focus === null || focus === a.id;
          return (
            <motion.div
              key={a.id}
              className="absolute"
              style={{
                left: `${seat.x + Math.sin(phase * Math.PI * 2) * 6}%`,
                top: `${seat.y + Math.cos(phase * Math.PI * 2) * 9}%`,
              }}
              animate={{ opacity: on ? 1 : 0.16, scale: focus === a.id ? 1.25 : 1 }}
              transition={{ duration: 0.25 }}
            >
              {/* A selection marquee under each pointer: an agent has something
                  selected, it is not merely hovering. */}
              <motion.span
                className="absolute rounded"
                style={{
                  left: -34, top: -20, width: 70, height: 40,
                  border: `1.5px dashed ${a.colour}`,
                  background: `${a.colour}12`,
                }}
                animate={{ opacity: [0.3, 0.9, 0.3] }}
                transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, delay: i * 0.4 }}
              />
              <svg width="18" height="20" viewBox="0 0 20 22" fill="none" className="relative">
                <path d="M2 1.5 L2 17 L6.2 13.2 L9 19.6 L12 18.2 L9.2 12 L15 12 Z" fill={a.colour} stroke="#0b1020" strokeWidth={1.3} strokeLinejoin="round" />
              </svg>
              <span
                className="absolute left-3.5 top-4 px-1 py-0.5 rounded font-mono text-[8px] leading-none"
                style={{ background: a.colour, color: '#0b1020' }}
              >
                {a.id + 1}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Who owns which stretch of the edit. */}
      <div className="relative h-2.5 mt-2">
        {AGENTS.map((a) => (
          <motion.div
            key={a.id}
            className="absolute inset-y-0 rounded-full"
            style={{
              left: `${a.span[0] * 100}%`,
              width: `${(a.span[1] - a.span[0]) * 100 - 0.4}%`,
              background: a.colour,
            }}
            animate={{ opacity: focus === null || focus === a.id ? 0.85 : 0.12 }}
            transition={{ duration: 0.25 }}
          />
        ))}
      </div>

      {/* The one timeline all six are working. */}
      <div
        className="relative w-full h-16 sm:h-20 mt-1.5 rounded-xl overflow-hidden"
        style={{ background: 'rgba(10, 16, 36, 0.9)', border: '1px solid rgba(230,237,243,0.08)' }}
      >
        {CLIPS.map((c, i) => {
          const a = AGENTS[c.agent];
          const phase = (t + i * 0.083) % 1;
          const beat = Math.sin(phase * Math.PI * 2);
          const on = focus === null || focus === c.agent;
          const Icon = ACT_ICON[c.act];

          // Each verb reads differently: move slides, trim breathes at the
          // width, cut drops out and comes back.
          const shift = c.act === 'move' ? beat * 1.6 : 0;
          const grow = c.act === 'trim' ? beat * 1.9 : 0;
          const gone = c.act === 'cut' && phase > 0.58 && phase < 0.78;

          return (
            <motion.div
              key={c.key}
              className="absolute top-2 bottom-2 rounded-md flex items-center gap-1 px-1.5 overflow-hidden"
              style={{
                left: `${c.from * 100 + shift}%`,
                width: `${Math.max(2.5, c.w * 100 + grow)}%`,
                background: `${a.colour}2a`,
                border: `1px solid ${a.colour}`,
              }}
              animate={{ opacity: gone ? 0 : on ? 1 : 0.14, scaleY: gone ? 0.66 : 1 }}
              transition={{ duration: 0.24 }}
            >
              <Icon className="w-2.5 h-2.5 flex-shrink-0" style={{ color: a.colour }} strokeWidth={2.5} />
              <span className="font-mono text-[7px] sm:text-[8px] truncate" style={{ color: a.colour }}>
                {c.act}
              </span>
            </motion.div>
          );
        })}

        <div
          className="absolute inset-y-0 w-[2px] pointer-events-none"
          style={{ left: `${t * 100}%`, background: '#fff', opacity: 0.5, boxShadow: '0 0 10px rgba(255,255,255,0.6)' }}
        />
      </div>

      <div className="mt-2.5 flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-fx-text-secondary/60">
        <span>0:00</span>
        <span style={{ color: focus !== null ? AGENTS[focus].colour : undefined }}>
          {focus !== null ? `agent ${focus + 1} only` : 'hover an agent to isolate it'}
        </span>
        <span>1:45</span>
      </div>
    </div>
  );
}

/* ══ 2 ══ Non-destructive: a real undo stack ══════════════════════════════ */

const PROPS = [
  { key: 'scale', name: 'Scale', min: 40, max: 200, unit: '%' },
  { key: 'rotation', name: 'Rotation', min: -45, max: 45, unit: '°' },
  { key: 'opacity', name: 'Opacity', min: 0, max: 100, unit: '%' },
  { key: 'blur', name: 'Blur', min: 0, max: 24, unit: 'px' },
] as const;

type Values = Record<string, number>;
const BASE: Values = { scale: 100, rotation: 0, opacity: 100, blur: 0 };
const EDITED: Values = { scale: 148, rotation: 18, opacity: 68, blur: 9 };

const EDIT_LAYERS = [
  { name: 'title', colour: Y },
  { name: 'subject', colour: K },
  { name: 'trees', colour: G },
  { name: 'sky', colour: B },
];

export function EditNotGenerate() {
  const { ref, active } = useDemo();

  /*
   * A genuine history: snapshots in an array, a pointer into it. Undo moves the
   * pointer back, redo forward, and a fresh edit truncates whatever was ahead —
   * exactly as an editor does when you change something after undoing.
   *
   * Nothing interpolates toward a second hard-coded state, which is the
   * difference between demonstrating undo and miming it.
   */
  const [history, setHistory] = useState<Values[]>([BASE]);
  const [ptr, setPtr] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [taken, setTaken] = useState(false);
  const [drag, setDrag] = useState<string | null>(null);
  const tracks = useRef<Record<string, HTMLDivElement | null>>({});

  const values = history[ptr];
  const canUndo = ptr > 0;
  const canRedo = ptr < history.length - 1;

  const take = useCallback(() => setTaken(true), []);

  /* The scripted pass: pick a layer, apply an edit, undo it, redo it. */
  useEffect(() => {
    if (!active || taken) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));

    setHistory([BASE]);
    setPtr(0);
    setPicked(null);

    at(700, () => setPicked(1));
    at(1600, () => {
      setHistory([BASE, EDITED]);
      setPtr(1);
    });
    at(3800, () => setPtr(0));
    at(5400, () => setPtr(1));
    at(7800, () => setPicked(null));
    at(8600, () => {
      setHistory([BASE]);
      setPtr(0);
    });
    return () => timers.forEach(clearTimeout);
  }, [active, taken]);

  /* Dragging a value. Committed on release, so one drag is one undo step rather
     than four hundred. */
  useEffect(() => {
    if (!drag) return;
    const prop = PROPS.find((p) => p.key === drag)!;

    const move = (e: PointerEvent) => {
      const el = tracks.current[drag];
      if (!el) return;
      const r = el.getBoundingClientRect();
      const f = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      const v = Math.round(prop.min + f * (prop.max - prop.min));
      setHistory((h) => {
        const next = [...h];
        next[next.length - 1] = { ...next[next.length - 1], [drag]: v };
        return next;
      });
    };
    const up = () => setDrag(null);

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }, [drag]);

  const grab = (key: string) => (e: React.PointerEvent) => {
    e.preventDefault();
    if (!taken) {
      take();
      setPicked((p) => p ?? 1);
    }
    // Open a new snapshot to edit, discarding any redo branch ahead of us.
    setHistory((h) => [...h.slice(0, ptr + 1), { ...h[ptr] }]);
    setPtr((p) => p + 1);
    setDrag(key);
  };

  return (
    <div ref={ref} className={`${panel} aspect-[4/3] flex flex-col`} style={panelBg}>
      {/* The two buttons the section rests on, and they genuinely work. */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-fx-border flex-shrink-0">
        {([
          { Icon: Undo2, label: 'undo', on: canUndo, run: () => { take(); setPtr((p) => Math.max(0, p - 1)); } },
          { Icon: Redo2, label: 'redo', on: canRedo, run: () => { take(); setPtr((p) => p + 1); } },
        ] as const).map(({ Icon, label, on, run }) => (
          <button
            key={label}
            type="button"
            onClick={on ? run : undefined}
            disabled={!on}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md font-mono text-[9px] uppercase tracking-wide transition-all duration-150"
            style={{
              border: `1px solid ${on ? 'rgba(245,197,24,0.55)' : 'rgba(230,237,243,0.1)'}`,
              color: on ? Y : 'rgba(230,237,243,0.25)',
              background: on ? 'rgba(245,197,24,0.1)' : 'transparent',
              cursor: on ? 'pointer' : 'default',
            }}
          >
            <Icon className="w-3 h-3" strokeWidth={2.5} />
            {label}
          </button>
        ))}

        <span className="flex-1" />
        {/* The stack, drawn. Seeing where the pointer sits is what makes undo
            legible rather than magical. */}
        <span className="flex items-center gap-1">
          {history.slice(0, 7).map((_, i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full transition-all duration-150"
              style={{ background: i === ptr ? Y : 'rgba(230,237,243,0.2)', transform: i === ptr ? 'scale(1.5)' : 'none' }}
            />
          ))}
        </span>
      </div>

      <div className="relative flex-1 min-h-0 flex">
        <div className="w-[36%] flex-shrink-0 border-r border-fx-border p-2 space-y-1.5">
          {EDIT_LAYERS.map((l, i) => (
            <button
              key={l.name}
              type="button"
              onClick={() => {
                take();
                setPicked(i);
              }}
              className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded transition-colors duration-200"
              style={{
                background: picked === i ? `${l.colour}26` : 'rgba(230,237,243,0.04)',
                border: `1px solid ${picked === i ? l.colour : 'transparent'}`,
              }}
            >
              <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: l.colour }} />
              <span className="font-mono text-[9px] truncate" style={{ color: picked === i ? l.colour : 'rgba(230,237,243,0.55)' }}>
                {l.name}
              </span>
            </button>
          ))}
        </div>

        <div className="flex-1 min-w-0 p-3 flex flex-col justify-center gap-2.5">
          {PROPS.map((prop) => {
            const v = values[prop.key];
            const pct = (v - prop.min) / (prop.max - prop.min);
            const live = picked !== null;
            return (
              <div key={prop.key} style={{ opacity: live ? 1 : 0.28, transition: 'opacity 250ms' }}>
                <div className="flex items-baseline justify-between mb-1">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-fx-text-secondary">{prop.name}</span>
                  <span className="font-mono text-[10px] tabular-nums" style={{ color: Y }}>
                    {v}
                    {prop.unit}
                  </span>
                </div>
                <div
                  ref={(n) => {
                    tracks.current[prop.key] = n;
                  }}
                  onPointerDown={live ? grab(prop.key) : undefined}
                  className="relative h-4 flex items-center"
                  style={{ cursor: live ? 'ew-resize' : 'default', touchAction: 'none' }}
                >
                  <span className="absolute inset-x-0 h-1 rounded-full" style={{ background: 'rgba(230,237,243,0.1)' }} />
                  <span className="absolute h-1 rounded-full" style={{ width: `${pct * 100}%`, background: Y }} />
                  <span
                    className="absolute w-3 h-3 rounded-full border-2 transition-transform duration-100"
                    style={{
                      left: `calc(${pct * 100}% - 6px)`,
                      background: '#0b1020',
                      borderColor: Y,
                      transform: drag === prop.key ? 'scale(1.4)' : 'none',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div
        className="flex-shrink-0 border-t border-fx-border px-3 py-2 text-center font-mono text-[8px] sm:text-[9px] uppercase tracking-widest"
        style={{ color: taken ? Y : 'rgba(230,237,243,0.45)' }}
      >
        {taken ? 'every change is a step you can walk back' : 'pick a layer, then drag a value'}
      </div>
    </div>
  );
}

/* ══ 3 ══ Ask it how ══════════════════════════════════════════════════════ */

const ASKS = [
  {
    panel: 'easing',
    q: 'how do I edit the interpolation?',
    a: 'Select the keyframe, open the easing panel, then drag either handle to reshape the curve.',
  },
  {
    panel: 'export',
    q: 'how do I export with transparency?',
    a: 'Choose PNG sequence on export. Alpha is kept, so it drops straight onto footage.',
  },
  {
    panel: 'presets',
    q: 'how do I make text animate in?',
    a: 'Add a text layer and apply a reveal preset. It animates by character, word or line.',
  },
];

export function AskAI() {
  const { ref, active } = useDemo();
  const [index, setIndex] = useState(0);
  const [taken, setTaken] = useState(false);
  const [qLen, setQLen] = useState(0);
  const [aLen, setALen] = useState(0);

  const ask = ASKS[index];

  /*
   * The answer types only once the question has finished, and the guarantee is
   * structural: the answer's first timer is scheduled at the question's last
   * one plus a gap. There is no shared clock whose windows could be retuned into
   * overlapping.
   */
  useEffect(() => {
    if (!active) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    setQLen(0);
    setALen(0);

    const qStart = 500;
    const qPer = 34;
    for (let i = 1; i <= ask.q.length; i++) timers.push(setTimeout(() => setQLen(i), qStart + i * qPer));

    const aStart = qStart + ask.q.length * qPer + 520;
    for (let i = 1; i <= ask.a.length; i++) timers.push(setTimeout(() => setALen(i), aStart + i * 16));

    if (!taken) {
      const end = aStart + ask.a.length * 16 + 3400;
      timers.push(setTimeout(() => setIndex((n) => (n + 1) % ASKS.length), end));
    }
    return () => timers.forEach(clearTimeout);
  }, [active, index, ask.q, ask.a, taken]);

  const typingQ = qLen > 0 && qLen < ask.q.length;
  const typingA = aLen > 0 && aLen < ask.a.length;
  const done = aLen >= ask.a.length;

  return (
    <div ref={ref} className={`${panel} aspect-[4/3] flex flex-col p-3 gap-2.5`} style={panelBg}>
      {/* Three real questions to choose between. Picking one stops the carousel
          and asks it, which is the difference between a script and an answer. */}
      <div className="flex flex-wrap gap-1.5 flex-shrink-0">
        {ASKS.map((a, i) => (
          <button
            key={a.panel}
            type="button"
            onClick={() => {
              setTaken(true);
              setIndex(i);
            }}
            className="px-2 py-1 rounded-full font-mono text-[8px] sm:text-[9px] uppercase tracking-widest transition-all duration-200"
            style={{
              background: index === i ? 'rgba(245,197,24,0.14)' : 'rgba(230,237,243,0.05)',
              border: `1px solid ${index === i ? Y : 'rgba(230,237,243,0.12)'}`,
              color: index === i ? Y : 'rgba(230,237,243,0.5)',
            }}
          >
            {a.panel}
          </button>
        ))}
      </div>

      <div className="rounded-lg border p-2.5 flex-shrink-0" style={{ borderColor: 'rgba(245,197,24,0.35)', background: 'rgba(245,197,24,0.06)' }}>
        <div className="flex items-center gap-1.5 mb-1">
          <MessageSquare className="w-3 h-3" style={{ color: Y }} strokeWidth={2.5} />
          <span className="font-mono text-[8px] uppercase tracking-widest text-fx-text-secondary">you</span>
        </div>
        <span className="text-xs sm:text-sm text-fx-text-primary block min-h-[1.4em]" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
          {ask.q.slice(0, qLen)}
          {typingQ && <span className="inline-block w-[2px] h-[1em] align-middle ml-0.5" style={{ background: Y }} />}
        </span>
      </div>

      <motion.div
        className="flex-1 min-h-0 rounded-lg border p-2.5 flex flex-col"
        style={{ borderColor: 'rgba(230,237,243,0.12)', background: 'rgba(11,17,38,0.7)' }}
        animate={{ opacity: aLen > 0 ? 1 : 0.3 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-1.5 mb-1.5">
          <Sparkles className="w-3 h-3" style={{ color: G }} strokeWidth={2.5} />
          <span className="font-mono text-[8px] uppercase tracking-widest text-fx-text-secondary">flashfx</span>
        </div>
        <span className="text-xs sm:text-sm text-fx-text-secondary leading-relaxed block min-h-[3em]">
          {ask.a.slice(0, aLen)}
          {typingA && <span className="inline-block w-[2px] h-[1em] align-middle ml-0.5" style={{ background: G }} />}
        </span>

        {/* The panel the answer points at, lighting only once it has finished. */}
        <motion.div
          className="mt-auto rounded-md p-2 relative"
          style={{ border: '1.5px solid rgba(230,237,243,0.1)', background: 'rgba(230,237,243,0.03)' }}
          animate={{
            borderColor: done ? 'rgba(245,197,24,0.8)' : 'rgba(230,237,243,0.1)',
            boxShadow: done ? '0 0 22px rgba(245,197,24,0.28)' : '0 0 0 rgba(0,0,0,0)',
          }}
          transition={{ duration: 0.45 }}
        >
          <svg viewBox="0 0 120 46" className="w-full h-10 sm:h-12">
            {ask.panel === 'easing' && (
              <>
                <path d="M4,42 C40,42 46,6 116,6" fill="none" stroke={Y} strokeWidth={2.5} strokeLinecap="round" />
                <circle cx={4} cy={42} r={3} fill="#0b1020" stroke="#fff" strokeWidth={1.5} />
                <circle cx={116} cy={6} r={3} fill="#0b1020" stroke="#fff" strokeWidth={1.5} />
              </>
            )}
            {ask.panel === 'export' && (
              <>
                {Array.from({ length: 12 }, (_, i) => (
                  <rect key={i} x={6 + i * 9.4} y={8} width={7} height={24} rx={1.5} fill={i % 2 ? 'rgba(230,237,243,0.12)' : `${Y}55`} />
                ))}
                <text x={60} y={43} textAnchor="middle" fill="rgba(230,237,243,0.5)" style={{ fontSize: 7, fontFamily: 'var(--font-jetbrains), monospace' }}>
                  PNG · alpha kept
                </text>
              </>
            )}
            {ask.panel === 'presets' && (
              <>
                {'FLASHFX'.split('').map((ch, i) => (
                  <motion.text
                    key={i}
                    x={14 + i * 14}
                    y={30}
                    fill={Y}
                    style={{ fontSize: 13, fontFamily: 'var(--font-inter), sans-serif', fontWeight: 700 }}
                    animate={done ? { y: [30, 22, 30], opacity: [0.4, 1, 0.4] } : { y: 30, opacity: 0.6 }}
                    transition={done ? { duration: 1.6, repeat: Number.POSITIVE_INFINITY, delay: i * 0.09 } : { duration: 0 }}
                  >
                    {ch}
                  </motion.text>
                ))}
              </>
            )}
          </svg>
          <span className="absolute top-1 right-2 font-mono text-[7px] uppercase tracking-widest text-fx-text-secondary/50">
            {ask.panel}
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ══ 5 ══ Three feeds, piped into the mark above ══════════════════════════ */

const FEEDS = [
  { label: 'Plugins', Icon: Puzzle, colour: Y, x: 66, exit: 166 },
  { label: 'Templates', Icon: Layers, colour: B, x: 200, exit: 200 },
  { label: 'Presets', Icon: Sparkles, colour: K, x: 334, exit: 234 },
];

const TVB = { w: 400, h: 520 };

/** A tube from a box, up and off the top of the frame. */
function tubePath(sx: number, ex: number, i: number) {
  return `M${sx},430 C${sx},${338 - i * 24} ${ex},${256 + i * 28} ${ex},-14`;
}

export function Endless() {
  const { ref, active } = useDemo();
  const [extra, setExtra] = useState<Record<string, number>>({});

  return (
    <div ref={ref} className={`${panel} aspect-[4/5]`} style={panelBg}>
      <svg viewBox={`0 0 ${TVB.w} ${TVB.h}`} className="absolute inset-0 w-full h-full">
        <defs>
          {FEEDS.map((f) => (
            <linearGradient key={f.label} id={`fx-tube-${f.label}`} x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor={f.colour} stopOpacity="0.9" />
              <stop offset="100%" stopColor={f.colour} stopOpacity="0.2" />
            </linearGradient>
          ))}
        </defs>

        {FEEDS.map((f, i) => {
          const d = tubePath(f.x, f.exit, i);
          const count = 3 + Math.min(4, extra[f.label] ?? 0);
          return (
            <g key={f.label}>
              {/*
                Casing, gradient body, hairline highlight. Three strokes on one
                path is what turns a line into a pipe — and they are far heavier
                than the cables in the section above (20 against 3) because these
                carry things and those only connect.
              */}
              <path d={d} fill="none" stroke="#0b1230" strokeWidth={20} strokeLinecap="round" />
              <path d={d} fill="none" stroke={`url(#fx-tube-${f.label})`} strokeWidth={13} strokeLinecap="round" />
              <path d={d} fill="none" stroke={f.colour} strokeWidth={1.5} strokeLinecap="round" opacity={0.45} />

              {active &&
                Array.from({ length: count }, (_, k) => (
                  <rect key={k} x={-5} y={-5} width={10} height={10} rx={2.5} fill={f.colour}>
                    {/* keyPoints "1;0" runs the motion backwards along the path,
                        so cargo travels upward without a reversed second copy. */}
                    <animateMotion
                      dur="3.2s"
                      begin={`${i * 0.45 + (k * 3.2) / count}s`}
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

        {FEEDS.map((f) => (
          <rect
            key={`b-${f.label}`}
            x={f.x - 48}
            y={430}
            width={96}
            height={66}
            rx={13}
            fill="rgba(20, 31, 64, 0.96)"
            stroke={f.colour}
            strokeWidth={2}
          />
        ))}
      </svg>

      {/* Sources as buttons: pressing one sends more up its own tube. */}
      {FEEDS.map((f) => (
        <button
          key={f.label}
          type="button"
          onClick={() => setExtra((e) => ({ ...e, [f.label]: (e[f.label] ?? 0) + 1 }))}
          className="absolute -translate-x-1/2 flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-transform duration-150 active:scale-95"
          style={{ left: `${(f.x / TVB.w) * 100}%`, top: `${(442 / TVB.h) * 100}%` }}
        >
          <f.Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: f.colour }} strokeWidth={2.5} />
          <span className="font-mono text-[8px] sm:text-[10px] uppercase tracking-widest" style={{ color: f.colour }}>
            {f.label}
          </span>
        </button>
      ))}

      <span className="absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[9px] uppercase tracking-widest text-fx-text-secondary/45 whitespace-nowrap pointer-events-none">
        tap a source to send more
      </span>
    </div>
  );
}
