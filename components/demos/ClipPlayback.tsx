'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Volume2 } from 'lucide-react';
import { useDemo } from './demo-kit';

/*
 * A clip playing, with the timeline that is playing it.
 *
 * The picture on its own would only say "we can show a video". The timeline
 * underneath is what says the video is *on a track*, cut against other clips and
 * an audio bed, which is the actual claim: playback inside the edit rather than
 * a player bolted on.
 *
 * The playhead is the single source of truth. Clip highlighting, the frame
 * counter and the waveform all read from the same normalised position, so they
 * cannot drift out of step with each other the way three separate loops would.
 */

const LOOP = 9000; // ms for one pass of the playhead

/* Four clips across the track, as fractions of the loop. */
const CLIPS = [
  { from: 0, to: 0.3, label: 'forest-01', colour: '#4ADE80' },
  { from: 0.3, to: 0.52, label: 'wide', colour: '#5B8DEF' },
  { from: 0.52, to: 0.78, label: 'canopy', colour: '#4ADE80' },
  { from: 0.78, to: 1, label: 'out', colour: '#7C5CBF' },
];

const TREES = [
  { x: 44, scale: 1.0, sway: 2.4, beat: 5.2 },
  { x: 110, scale: 0.78, sway: 3.1, beat: 4.1 },
  { x: 178, scale: 1.15, sway: 1.9, beat: 6.0 },
  { x: 250, scale: 0.86, sway: 2.8, beat: 4.6 },
  { x: 318, scale: 1.05, sway: 2.2, beat: 5.6 },
];

/* Deterministic: Math.random() during render differs between server and client
   and trips a hydration mismatch. */
const MOTES = Array.from({ length: 14 }, (_, i) => ({
  x: 20 + ((i * 97) % 360),
  y: 60 + ((i * 53) % 120),
  r: 1.2 + ((i * 7) % 3) * 0.5,
  span: 4 + ((i * 11) % 5),
  delay: ((i * 13) % 40) / 10,
}));

function Forest({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 400 225" className="absolute inset-0 w-full h-full" aria-hidden="true">
      <defs>
        <linearGradient id="fx-forest-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7FB8E6" />
          <stop offset="55%" stopColor="#BFE0E8" />
          <stop offset="100%" stopColor="#E7EBC9" />
        </linearGradient>
        <linearGradient id="fx-forest-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5C8A4A" />
          <stop offset="100%" stopColor="#3C6534" />
        </linearGradient>
      </defs>

      <rect width="400" height="225" fill="url(#fx-forest-sky)" />

      {/* Sun, breathing very slowly. */}
      <motion.circle
        cx={318}
        cy={48}
        r={22}
        fill="#FFF6D0"
        animate={active ? { opacity: [0.75, 1, 0.75], r: [22, 24, 22] } : { opacity: 0.9 }}
        transition={active ? { duration: 6, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' } : { duration: 0 }}
      />

      {/* Far treeline, flat and pale, so the near trees read as nearer. */}
      <path d="M0,150 L28,120 L54,150 L84,116 L112,150 L146,122 L176,150 L210,114 L242,150 L276,124 L306,150 L340,118 L370,150 L400,128 L400,225 L0,225 Z" fill="#4E7A46" opacity={0.5} />

      <rect y="158" width="400" height="67" fill="url(#fx-forest-floor)" />

      {TREES.map((t, i) => (
        /* Each trunk pivots at its base, which is where a tree bends. Rotating
           about the centre would make them hover. */
        <motion.g
          key={i}
          style={{ transformBox: 'view-box', transformOrigin: `${t.x}px 168px` }}
          animate={active ? { rotate: [-t.sway, t.sway, -t.sway] } : { rotate: 0 }}
          transition={
            active
              ? { duration: t.beat, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut', delay: i * 0.4 }
              : { duration: 0.4 }
          }
        >
          <rect x={t.x - 4 * t.scale} y={168 - 52 * t.scale} width={8 * t.scale} height={52 * t.scale} fill="#5A3E2B" rx={2} />
          <ellipse cx={t.x} cy={168 - 66 * t.scale} rx={30 * t.scale} ry={26 * t.scale} fill="#2F6B3A" />
          <ellipse cx={t.x - 10 * t.scale} cy={168 - 58 * t.scale} rx={20 * t.scale} ry={17 * t.scale} fill="#3A8047" opacity={0.9} />
        </motion.g>
      ))}

      {/* Motes drifting in the light. Cheap, and they stop the frame reading as
          a still the moment the trees are between sways. */}
      {MOTES.map((m, i) => (
        <motion.circle
          key={i}
          cx={m.x}
          cy={m.y}
          r={m.r}
          fill="#FFF8D8"
          opacity={0.5}
          animate={active ? { y: [0, -18, 0], opacity: [0.15, 0.6, 0.15] } : { y: 0, opacity: 0.35 }}
          transition={
            active
              ? { duration: m.span, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut', delay: m.delay }
              : { duration: 0 }
          }
        />
      ))}
    </svg>
  );
}

export function ClipPlayback() {
  const { ref, active } = useDemo();
  const [t, setT] = useState(0);

  /* One rAF loop drives everything below: the playhead, which clip is lit, the
     frame counter and the waveform all read this single value. */
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      setT((((now - start) % LOOP) / LOOP));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  const playing = CLIPS.find((c) => t >= c.from && t < c.to) ?? CLIPS[0];
  const frame = Math.round(t * 270);

  return (
    <div
      ref={ref}
      className="relative w-full aspect-[4/3] rounded-xl border border-fx-border overflow-hidden flex flex-col"
      style={{ background: 'rgba(16, 24, 52, 0.72)' }}
    >
      {/* The picture. */}
      <div className="relative flex-1 min-h-0">
        <Forest active={active} />

        <span
          className="absolute top-2 left-2 px-1.5 py-0.5 rounded font-mono text-[9px] text-white"
          style={{ background: 'rgba(8,13,30,0.7)' }}
        >
          {playing.label}
        </span>
        <span
          className="absolute top-2 right-2 px-1.5 py-0.5 rounded font-mono text-[9px] text-white tabular-nums"
          style={{ background: 'rgba(8,13,30,0.7)' }}
        >
          {String(frame).padStart(3, '0')} / 270
        </span>
      </div>

      {/* The timeline. */}
      <div className="flex-shrink-0 border-t border-fx-border p-2.5 space-y-1.5" style={{ background: 'rgba(11,17,38,0.9)' }}>
        {/* Video track */}
        <div className="relative h-7 rounded overflow-hidden" style={{ background: 'rgba(230,237,243,0.05)' }}>
          {CLIPS.map((c) => (
            <div
              key={c.label}
              className="absolute inset-y-0 rounded-[3px] flex items-center px-1.5 transition-opacity duration-200"
              style={{
                left: `${c.from * 100}%`,
                width: `${(c.to - c.from) * 100 - 0.6}%`,
                background: c.colour,
                opacity: playing.label === c.label ? 0.95 : 0.45,
              }}
            >
              <span className="font-mono text-[8px] text-[#0b1020] truncate">{c.label}</span>
            </div>
          ))}
        </div>

        {/* Audio track, its bars reading the same clock as the playhead. */}
        <div className="relative h-5 rounded overflow-hidden flex items-center gap-[2px] px-1" style={{ background: 'rgba(74,222,128,0.1)' }}>
          <Volume2 className="w-2.5 h-2.5 flex-shrink-0 text-[#4ADE80]" strokeWidth={2.5} />
          <div className="flex-1 h-full flex items-center gap-[2px]">
            {Array.from({ length: 46 }, (_, i) => {
              // A fixed envelope, lit up to the playhead rather than animated
              // separately -- so the level always matches where the head is.
              const base = 0.25 + Math.abs(Math.sin(i * 0.7)) * 0.6;
              const passed = i / 46 < t;
              return (
                <span
                  key={i}
                  className="flex-1 rounded-[1px]"
                  style={{
                    height: `${base * 100}%`,
                    background: '#4ADE80',
                    opacity: passed ? 0.9 : 0.3,
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* The playhead, over both tracks. */}
        <div className="relative h-0">
          <div
            className="absolute -top-[54px] w-[2px] h-[54px] pointer-events-none"
            style={{ left: `${t * 100}%`, background: '#F5C518', boxShadow: '0 0 8px rgba(245,197,24,0.8)' }}
          >
            <span className="absolute -top-1 -left-[3px] w-2 h-2 rounded-full" style={{ background: '#F5C518' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
