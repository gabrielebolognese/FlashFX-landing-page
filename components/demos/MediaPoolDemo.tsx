'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Film, Image as ImageIcon, Music, Type, Shapes, FolderOpen, Search, Upload, AudioLines } from 'lucide-react';
import { VideoLoading } from '@/components/ui/video-loading';
import { useDemo } from './demo-kit';

/*
 * The media pool: import footage, pick a clip, then import audio and drop it
 * onto the cut.
 *
 * First entry under "Organized workflow", before the two timelines, because it
 * is the step that comes first in the work — nothing can be cut together until
 * something has been brought in.
 *
 * ── About the artwork ───────────────────────────────────────────────────────
 *
 * Every thumbnail, the beach clip and every waveform are drawn here. No stock
 * footage was downloaded, deliberately: unlicensed stock on a commercial
 * marketing page is a real exposure, a licence cannot be verified for a file
 * fetched at build time, and `scripts/check-budgets.mjs` fails the build over
 * 220 kB for any single asset. `Thumb`, `BeachClip` and `Waveform` are the only
 * things to replace if licensed assets ever arrive.
 *
 * ── Why the cursor is measured rather than positioned ───────────────────────
 *
 * It has to land on a specific button, a specific card, a specific sidebar row,
 * and then carry a file from the left panel to the right one — across a layout
 * that reflows at `lg` and changes what it contains twice. Percentages tuned by
 * eye would be wrong at the first breakpoint and wrong again the first time a
 * card changed size.
 *
 * So each target carries a ref, and the cursor reads `getBoundingClientRect()`
 * for whichever target the current step names, in pixels relative to the stage.
 * A ResizeObserver re-measures on reflow. The cursor is correct by construction
 * at any width.
 */

/** Milliseconds, each measured from the end of the step before it. */
const STEP = {
  pool: 420,
  importIn: 340,
  toImport: 680,
  press: 320,
  cards: 1050,
  toCard: 660,
  pick: 300,
  play: 260,
  toAudioTab: 760,
  audioTab: 420,
  toAudioImport: 640,
  audioPress: 320,
  audioCards: 950,
  toAudioCard: 620,
  drag: 900,
  drop: 380,
  watch: 2600,
};

const S = {
  idle: 0,
  pool: 1,
  importIn: 2,
  cursorIn: 3,
  press: 4,
  cards: 5,
  toCard: 6,
  picked: 7,
  playing: 8,
  toAudioTab: 9,
  audioTab: 10,
  toAudioImport: 11,
  audioPress: 12,
  audioCards: 13,
  toAudioCard: 14,
  dragging: 15,
  dropped: 16,
} as const;

type Scene = 'beach' | 'ridge' | 'forest' | 'city' | 'dunes' | 'coast';

/*
 * Index 3 is the beach, and index 3 is what the cursor picks — the clip that
 * plays has to be the clip that was selected, or the demo shows two unrelated
 * things. It also starts the second row, giving the cursor a diagonal.
 */
const PICKED = 3;
/** The audio card that gets dragged onto the cut. */
const DRAGGED = 1;

const CLIPS: { name: string; length: string; scene: Scene }[] = [
  { name: 'ridge-sunrise', length: '0:14', scene: 'ridge' },
  { name: 'forest-path', length: '0:08', scene: 'forest' },
  { name: 'city-timelapse', length: '0:22', scene: 'city' },
  { name: 'beach-waves', length: '0:11', scene: 'beach' },
  { name: 'desert-dunes', length: '0:06', scene: 'dunes' },
  { name: 'coast-aerial', length: '0:17', scene: 'coast' },
];

const AUDIO: { name: string; length: string; seed: number }[] = [
  { name: 'ocean-swell', length: '1:20', seed: 3 },
  { name: 'beach-ambience', length: '2:04', seed: 11 },
  { name: 'soft-piano', length: '0:48', seed: 19 },
  { name: 'wind-chimes', length: '1:12', seed: 27 },
  { name: 'low-drone', length: '3:30', seed: 35 },
  { name: 'gull-calls', length: '0:36', seed: 43 },
];

const SIDEBAR = [
  { Icon: FolderOpen, label: 'All media' },
  { Icon: Film, label: 'Video' },
  { Icon: ImageIcon, label: 'Images' },
  { Icon: Music, label: 'Audio' },
  { Icon: Type, label: 'Text' },
  { Icon: Shapes, label: 'Shapes' },
];
/** Which sidebar row the cursor switches to. Must match `Music` above. */
const AUDIO_TAB = 3;

/**
 * Bar heights for a waveform, derived from a seed.
 *
 * Deterministic on purpose: `Math.random()` would give every card a different
 * shape on every render, and a different shape on the server than on the
 * client. A cheap hash of the index gives each track its own recognisable
 * envelope that stays put.
 */
function bars(seed: number, count: number): number[] {
  return Array.from({ length: count }, (_, i) => {
    const n = Math.sin(seed * 12.9898 + i * 78.233) * 43758.5453;
    const f = n - Math.floor(n);
    // Envelope, so a track tapers at both ends instead of reading as noise.
    const envelope = Math.sin((Math.PI * i) / (count - 1)) * 0.55 + 0.45;
    return 0.18 + f * 0.82 * envelope;
  });
}

function Waveform({
  seed,
  count = 28,
  colour = '#4ADE80',
  live = false,
  active = false,
}: {
  seed: number;
  count?: number;
  colour?: string;
  live?: boolean;
  active?: boolean;
}) {
  const heights = bars(seed, count);

  return (
    <div className="flex items-center justify-between gap-[1px] w-full h-full">
      {heights.map((h, i) => (
        <motion.span
          key={i}
          className="flex-1 rounded-[1px]"
          style={{ background: colour, minWidth: 1 }}
          animate={
            live && active
              ? { height: [`${h * 100}%`, `${Math.min(100, h * 145)}%`, `${h * 100}%`] }
              : { height: `${h * 100}%` }
          }
          transition={
            live && active
              ? {
                  duration: 0.6 + (i % 5) * 0.14,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'easeInOut',
                  delay: (i % 7) * 0.05,
                }
              : { duration: 0.2 }
          }
        />
      ))}
    </div>
  );
}

/** A still thumbnail. Six flat scenes, each a handful of shapes. */
function Thumb({ scene }: { scene: Scene }) {
  const sky = {
    beach: ['#7FC5F0', '#CFE9F7'],
    ridge: ['#F7B267', '#F4845F'],
    forest: ['#89C7A0', '#D6EBDB'],
    city: ['#2D3A66', '#7C5CBF'],
    dunes: ['#F2C078', '#F7E1B5'],
    coast: ['#5AA9E6', '#A9D6F5'],
  }[scene];

  return (
    <svg viewBox="0 0 160 90" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`sky-${scene}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={sky[0]} />
          <stop offset="100%" stopColor={sky[1]} />
        </linearGradient>
      </defs>
      <rect width="160" height="90" fill={`url(#sky-${scene})`} />

      {scene === 'beach' && (
        <>
          <circle cx="124" cy="24" r="10" fill="#FFF3C4" />
          <rect y="52" width="160" height="18" fill="#3E8FD0" />
          <path d="M0,66 Q40,60 80,66 T160,66 L160,90 L0,90 Z" fill="#E8D7A8" />
        </>
      )}
      {scene === 'ridge' && (
        <>
          <circle cx="118" cy="26" r="9" fill="#FFE9B0" />
          <path d="M0,66 L38,36 L66,60 L96,30 L134,64 L160,46 L160,90 L0,90 Z" fill="#5B4B7A" />
          <path d="M96,30 L109,44 L83,44 Z" fill="#EFE6F5" />
        </>
      )}
      {scene === 'forest' && (
        <>
          <rect y="63" width="160" height="27" fill="#3D7A55" />
          {[18, 46, 74, 102, 132].map((x, i) => (
            <path key={x} d={`M${x},${65 - (i % 2) * 5} L${x - 12},${65 - (i % 2) * 5} L${x},${30 - (i % 2) * 7} L${x + 12},${65 - (i % 2) * 5} Z`} fill="#2F5F44" />
          ))}
        </>
      )}
      {scene === 'city' && (
        <>
          {[10, 32, 52, 76, 100, 124, 144].map((x, i) => (
            <rect key={x} x={x} y={38 + ((i * 7) % 20)} width="15" height="56" fill={i % 2 ? '#1B2447' : '#243060'} />
          ))}
          <rect y="83" width="160" height="7" fill="#131a37" />
        </>
      )}
      {scene === 'dunes' && (
        <>
          <circle cx="34" cy="24" r="8" fill="#FFF6DC" />
          <path d="M0,60 Q44,44 88,62 T160,55 L160,90 L0,90 Z" fill="#D8A15C" />
          <path d="M0,75 Q52,62 104,77 T160,72 L160,90 L0,90 Z" fill="#C08847" />
        </>
      )}
      {scene === 'coast' && (
        <>
          <path d="M0,50 L160,50 L160,90 L0,90 Z" fill="#2E7FC2" />
          <path d="M0,50 Q26,39 54,48 L54,90 L0,90 Z" fill="#6C7F5B" />
          <path d="M96,54 Q126,46 160,56 L160,90 L96,90 Z" fill="#7C8F63" />
        </>
      )}
    </svg>
  );
}

/** The clip that plays on the right: waves running up a beach, on a loop. */
function BeachClip({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 320 180" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="mp-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5FB0E5" />
          <stop offset="62%" stopColor="#BFE4F7" />
          <stop offset="100%" stopColor="#F3E7C8" />
        </linearGradient>
        <linearGradient id="mp-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2F79B8" />
          <stop offset="100%" stopColor="#57A6DA" />
        </linearGradient>
      </defs>

      <rect width="320" height="180" fill="url(#mp-sky)" />
      <circle cx="248" cy="40" r="17" fill="#FFF6D0" opacity="0.95" />
      <rect y="86" width="320" height="52" fill="url(#mp-sea)" />

      {/* Three bands, each twice the viewBox wide and sliding exactly one
          viewBox width, so the loop has no seam — the frame it ends on is the
          frame it started from. */}
      {[
        { y: 96, speed: 5.5, fill: 'rgba(255,255,255,0.32)', h: 5 },
        { y: 110, speed: 4.1, fill: 'rgba(255,255,255,0.4)', h: 6 },
        { y: 124, speed: 3.2, fill: 'rgba(255,255,255,0.55)', h: 7 },
      ].map((band, i) => (
        <motion.path
          key={i}
          d={`M0,${band.y} Q40,${band.y - band.h} 80,${band.y} T160,${band.y} T240,${band.y} T320,${band.y} T400,${band.y} T480,${band.y} T560,${band.y} T640,${band.y} L640,180 L0,180 Z`}
          fill={band.fill}
          animate={active ? { x: [0, -320] } : { x: -160 }}
          transition={active ? { duration: band.speed, repeat: Number.POSITIVE_INFINITY, ease: 'linear' } : { duration: 0 }}
        />
      ))}

      <path d="M0,138 Q80,132 160,138 T320,136 L320,180 L0,180 Z" fill="#D9C79C" />
      <path d="M0,154 Q80,148 160,154 T320,152 L320,180 L0,180 Z" fill="#EBDCB4" />

      <motion.path
        d="M0,140 Q80,133 160,140 T320,138 L320,150 Q160,156 0,150 Z"
        fill="rgba(255,255,255,0.75)"
        animate={active ? { y: [0, 9, 0], opacity: [0.5, 0.9, 0.5] } : { y: 4, opacity: 0.7 }}
        transition={active ? { duration: 3.6, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' } : { duration: 0 }}
      />
    </svg>
  );
}

export function MediaPoolDemo() {
  const { ref, active } = useDemo();
  const [step, setStep] = useState<number>(S.idle);
  const [cycle, setCycle] = useState(0);

  // `useDemo`'s ref is on the stage element already, so measurements read from
  // it directly rather than keeping a second ref to the same node.
  const stage = ref;
  const importRef = useRef<HTMLSpanElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const audioTabRef = useRef<HTMLSpanElement>(null);
  const audioImportRef = useRef<HTMLSpanElement>(null);
  const audioCardRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!active) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    let t = 0;
    const then = (ms: number, s: number) => {
      t += ms;
      timers.push(setTimeout(() => setStep(s), t));
    };

    setStep(S.pool);
    then(STEP.pool, S.importIn);
    then(STEP.importIn, S.cursorIn);
    then(STEP.toImport, S.press);
    then(STEP.press, S.cards);
    then(STEP.cards, S.toCard);
    then(STEP.toCard, S.picked);
    then(STEP.pick, S.playing);
    then(STEP.play, S.toAudioTab);
    then(STEP.toAudioTab, S.audioTab);
    then(STEP.audioTab, S.toAudioImport);
    then(STEP.toAudioImport, S.audioPress);
    then(STEP.audioPress, S.audioCards);
    then(STEP.audioCards, S.toAudioCard);
    then(STEP.toAudioCard, S.dragging);
    then(STEP.drag, S.dropped);

    // And round again. Incrementing `cycle` re-runs this effect from the top.
    t += STEP.drop + STEP.watch;
    timers.push(setTimeout(() => setCycle((c) => c + 1), t));

    return () => timers.forEach(clearTimeout);
  }, [active, cycle]);

  /* Which element the cursor is currently on its way to. */
  const target =
    step >= S.dragging
      ? dropRef
      : step >= S.toAudioCard
        ? audioCardRef
        : step >= S.toAudioImport
          ? audioImportRef
          : step >= S.toAudioTab
            ? audioTabRef
            : step >= S.toCard
              ? clipRef
              : step >= S.cursorIn
                ? importRef
                : null;

  const measure = useCallback(() => {
    const host = stage.current;
    const node = target?.current;
    if (!host || !node) return;
    const h = host.getBoundingClientRect();
    const n = node.getBoundingClientRect();
    setCursor({ x: n.left - h.left + n.width / 2, y: n.top - h.top + n.height / 2 });
  }, [target, stage]);

  useEffect(() => {
    measure();
    const host = stage.current;
    if (!host) return;
    // Re-measure on reflow: the layout goes from stacked to side-by-side at
    // `lg`, and every target moves when it does.
    const observer = new ResizeObserver(measure);
    observer.observe(host);
    return () => observer.disconnect();
  }, [measure, step, stage]);

  const poolIn = step >= S.pool;
  const showVideoImport = step >= S.importIn && step <= S.press;
  const importPressed = step === S.press;
  const clipsIn = step >= S.cards && step < S.audioTab;
  const picked = step >= S.picked;
  const playing = step >= S.playing;
  const audioMode = step >= S.audioTab;
  const showAudioImport = step >= S.audioTab && step <= S.audioPress;
  const audioPressed = step === S.audioPress;
  const audioIn = step >= S.audioCards;
  const dragging = step >= S.dragging && step < S.dropped;
  const dropped = step >= S.dropped;
  const cursorShown = step >= S.cursorIn;

  return (
    <div
      ref={ref}
      className="absolute inset-0 flex flex-col lg:flex-row items-center justify-center gap-3 lg:gap-4 px-1"
    >
      {/* ── Media pool, 16:9 ─────────────────────────────────────────────── */}
      <motion.div
        className="relative w-full lg:w-1/2 aspect-video rounded-xl border border-fx-border overflow-hidden flex"
        style={{ background: 'rgba(18, 27, 58, 0.9)' }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: poolIn ? 1 : 0, y: poolIn ? 0 : 16 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Sidebar — three times its old width, and legible rather than tucked
            away. It is a real part of the interface, not a decoration. */}
        <div
          className="flex-shrink-0 w-[132px] sm:w-[190px] lg:w-[212px] border-r border-fx-border py-3 px-2.5 flex flex-col gap-1"
          style={{ background: 'rgba(13, 20, 44, 0.85)' }}
        >
          <span className="px-2 pb-2 font-mono text-[10px] sm:text-[11px] tracking-widest uppercase text-fx-text-secondary/60">
            Library
          </span>
          {SIDEBAR.map(({ Icon, label }, i) => {
            const on = audioMode ? i === AUDIO_TAB : i === 0;
            return (
              <span
                key={label}
                ref={i === AUDIO_TAB ? audioTabRef : undefined}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[12px] sm:text-[13px] transition-colors duration-300 ${
                  on ? 'text-fx-accent-yellow' : 'text-fx-text-secondary'
                }`}
                style={{
                  background: on ? 'rgba(245,197,24,0.12)' : undefined,
                  fontFamily: 'var(--font-outfit), sans-serif',
                }}
              >
                <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.75} />
                {label}
              </span>
            );
          })}
        </div>

        {/* Main area */}
        <div className="relative flex-1 min-w-0 flex flex-col">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-fx-border flex-shrink-0">
            <span className="font-mono text-[10px] sm:text-[11px] tracking-widest uppercase text-fx-text-secondary">
              {audioMode ? 'Audio' : 'Media pool'}
            </span>
            <span className="flex-1" />
            <span className="flex items-center gap-1 px-2 py-1 rounded border border-fx-border text-fx-text-secondary/70">
              <Search className="w-2.5 h-2.5" strokeWidth={2} />
              <span className="hidden sm:inline font-mono text-[9px]">search</span>
            </span>
          </div>

          <div className="relative flex-1 min-h-0 p-2.5 sm:p-3">
            {/* Both import targets share this slot; only one is ever up. */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-3">
              <motion.span
                ref={importRef}
                className="absolute flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl border-2 border-dashed font-semibold text-[11px] sm:text-sm whitespace-nowrap"
                style={{
                  borderColor: 'rgba(245,197,24,0.55)',
                  background: 'rgba(245,197,24,0.07)',
                  color: '#F5C518',
                }}
                animate={{ opacity: showVideoImport ? 1 : 0, scale: importPressed ? 0.94 : 1 }}
                transition={{ opacity: { duration: 0.3 }, scale: { duration: 0.16 } }}
              >
                <Upload className="w-4 h-4" strokeWidth={2} />
                Import from PC
              </motion.span>

              <motion.span
                ref={audioImportRef}
                className="absolute flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl border-2 border-dashed font-semibold text-[11px] sm:text-sm whitespace-nowrap"
                style={{
                  borderColor: 'rgba(74,222,128,0.55)',
                  background: 'rgba(74,222,128,0.07)',
                  color: '#4ADE80',
                }}
                animate={{ opacity: showAudioImport ? 1 : 0, scale: audioPressed ? 0.94 : 1 }}
                transition={{ opacity: { duration: 0.3 }, scale: { duration: 0.16 } }}
              >
                <Music className="w-4 h-4" strokeWidth={2} />
                Import audio from library
              </motion.span>
            </div>

            {/*
             * `content-start` and `auto-rows-min`: the cards keep their natural
             * height instead of stretching to fill the panel. Six 16:9 clips in
             * a half-empty grid is what a media pool actually looks like.
             */}
            <div className="grid grid-cols-3 gap-2 sm:gap-2.5 auto-rows-min content-start h-full">
              {(audioMode ? AUDIO : CLIPS).map((item, i) =>
                audioMode ? (
                  <motion.div
                    key={`a-${item.name}`}
                    ref={i === DRAGGED ? audioCardRef : undefined}
                    className="relative rounded-lg overflow-hidden border flex flex-col"
                    style={{
                      background: 'rgba(20, 46, 36, 0.92)',
                      borderColor: dragging && i === DRAGGED ? '#4ADE80' : 'rgba(74,222,128,0.25)',
                      boxShadow: dragging && i === DRAGGED ? '0 0 0 1px #4ADE80, 0 0 18px rgba(74,222,128,0.35)' : 'none',
                    }}
                    initial={{ opacity: 0, y: 10, scale: 0.94 }}
                    animate={audioIn ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 10, scale: 0.94 }}
                    transition={{ duration: 0.34, delay: audioIn ? i * 0.1 : 0, ease: 'easeOut' }}
                  >
                    <div className="relative aspect-video px-1.5 py-2">
                      <Waveform seed={(item as (typeof AUDIO)[number]).seed} count={22} />
                      <span
                        className="absolute bottom-1 left-1 px-1 py-0.5 rounded font-mono text-[8px] leading-none text-white"
                        style={{ background: 'rgba(8, 13, 30, 0.78)' }}
                      >
                        {item.length}
                      </span>
                    </div>
                    <span className="flex items-center gap-1 px-1.5 py-1 font-mono text-[8px] sm:text-[9px] truncate text-[#93E3B4]">
                      <AudioLines className="w-2.5 h-2.5 flex-shrink-0" strokeWidth={2} />
                      {item.name}
                    </span>
                  </motion.div>
                ) : (
                  <motion.div
                    key={`v-${item.name}`}
                    ref={i === PICKED ? clipRef : undefined}
                    className="relative rounded-lg overflow-hidden border flex flex-col"
                    style={{
                      background: 'rgba(26, 37, 74, 0.9)',
                      borderColor: picked && i === PICKED ? '#F5C518' : 'rgba(230,237,243,0.1)',
                      boxShadow: picked && i === PICKED ? '0 0 0 1px #F5C518, 0 0 18px rgba(245,197,24,0.3)' : 'none',
                    }}
                    initial={{ opacity: 0, y: 10, scale: 0.94 }}
                    animate={clipsIn ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 10, scale: 0.94 }}
                    transition={{ duration: 0.34, delay: clipsIn ? i * 0.1 : 0, ease: 'easeOut' }}
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <Thumb scene={(item as (typeof CLIPS)[number]).scene} />
                      <span
                        className="absolute bottom-1 left-1 px-1 py-0.5 rounded font-mono text-[8px] leading-none text-white"
                        style={{ background: 'rgba(8, 13, 30, 0.78)' }}
                      >
                        {item.length}
                      </span>
                    </div>
                    <span className="px-1.5 py-1 font-mono text-[8px] sm:text-[9px] truncate text-fx-text-secondary">
                      {item.name}
                    </span>
                  </motion.div>
                )
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Preview, 16:9 ────────────────────────────────────────────────── */}
      <div ref={dropRef} className="relative w-full lg:w-1/2 aspect-video rounded-xl border border-fx-border overflow-hidden">
        {/* The same placeholder the YouTube embeds use, running from the first
            frame — so this side is busy while the other is being worked on,
            exactly as it would be while a preview renders. It fades out rather
            than unmounting, so the handover never shows a gap. */}
        <VideoLoading phase={playing ? 'done' : 'loading'} />

        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: playing ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        >
          <BeachClip active={active && playing} />
        </motion.div>

        {/* The dropped audio, as tracks under the picture. */}
        <motion.div
          className="absolute inset-x-0 bottom-0 px-2 pt-1.5 pb-2 flex flex-col gap-1"
          style={{ background: 'linear-gradient(to top, rgba(8,13,30,0.94) 62%, transparent)' }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: dropped ? 1 : 0, y: dropped ? 0 : 12 }}
          transition={{ duration: 0.36, ease: 'easeOut' }}
        >
          {[AUDIO[DRAGGED].seed, AUDIO[DRAGGED].seed + 7].map((seed, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <AudioLines className="w-2.5 h-2.5 flex-shrink-0 text-[#4ADE80]" strokeWidth={2} />
              <div className="flex-1 h-3 sm:h-4">
                <Waveform seed={seed} count={44} live active={active && dropped} />
              </div>
            </div>
          ))}
        </motion.div>

        <span
          className="absolute top-2 left-2 px-1.5 py-0.5 rounded font-mono text-[9px] text-white"
          style={{ background: 'rgba(8, 13, 30, 0.72)' }}
        >
          beach-waves · 0:11
        </span>
      </div>

      {/* ── The cursor, and what it is carrying ──────────────────────────── */}
      <motion.div
        className="absolute z-30 pointer-events-none"
        initial={false}
        animate={{ x: cursor.x, y: cursor.y, opacity: cursorShown ? 1 : 0, scale: cursorShown ? 1 : 0.6 }}
        transition={{
          x: { duration: 0.62, ease: [0.22, 1, 0.36, 1] },
          y: { duration: 0.62, ease: [0.22, 1, 0.36, 1] },
          opacity: { duration: 0.26 },
          scale: { duration: 0.26 },
        }}
        style={{ top: 0, left: 0 }}
      >
        {/* The file being carried, tucked under the pointer. */}
        <motion.span
          className="absolute left-3 top-3 flex items-center gap-1 px-1.5 py-1 rounded border font-mono text-[8px] whitespace-nowrap"
          style={{
            background: 'rgba(20, 46, 36, 0.96)',
            borderColor: '#4ADE80',
            color: '#93E3B4',
          }}
          animate={{ opacity: dragging ? 1 : 0, scale: dragging ? 1 : 0.8 }}
          transition={{ duration: 0.2 }}
        >
          <AudioLines className="w-2.5 h-2.5" strokeWidth={2} />
          {AUDIO[DRAGGED].name}
        </motion.span>

        <svg width="19" height="21" viewBox="0 0 20 22" fill="none">
          <path
            d="M2 1.5 L2 17 L6.2 13.2 L9 19.6 L12 18.2 L9.2 12 L15 12 Z"
            fill="#F5C518"
            stroke="#0b1020"
            strokeWidth={1.3}
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </div>
  );
}
