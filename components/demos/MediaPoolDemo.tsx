'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Film, Image as ImageIcon, Music, Type, Shapes, FolderOpen, Search, Upload } from 'lucide-react';
import { VideoLoading } from '@/components/ui/video-loading';
import { useDemo } from './demo-kit';

/*
 * The media pool: import, pick a clip, watch it play.
 *
 * The first entry under "Organized workflow", before the two timelines, because
 * it is the step that comes first in the work — nothing can be cut together
 * until something has been brought in.
 *
 * ── About the artwork ───────────────────────────────────────────────────────
 *
 * Every thumbnail and the beach clip are drawn here as SVG. No stock footage was
 * downloaded, deliberately: unlicensed stock on a commercial marketing page is a
 * real exposure, a licence cannot be verified for a file fetched at build time,
 * and `scripts/check-budgets.mjs` fails the build over 220 kB for any single
 * asset. Six drawn scenes cost nothing and ship as markup.
 *
 * If real licensed assets arrive, `Thumb` and `BeachClip` are the only two
 * things that need replacing.
 *
 * ── The loop ────────────────────────────────────────────────────────────────
 *
 *   pool        the panel arrives, empty
 *   import      a large "Import from PC" target, and a cursor that goes for it
 *   cards       six clips land, staggered, three to a row
 *   pick        the cursor selects one; it takes a yellow border
 *   play        the placeholder on the right hands over to the clip
 *   watch       the clip runs, the cursor leaves, and then it all starts again
 *
 * The whole thing restarts, so it goes through `useDemo()` — `useAmbient` at
 * demo priority. When the grant is withheld the timers stop and whatever frame
 * it reached is held; it never blanks, and it never runs off screen.
 */

/** Milliseconds, each measured from the end of the step before it. */
const STEP = {
  pool: 420,
  importIn: 340,
  toImport: 700,
  press: 340,
  cards: 1150,
  toCard: 720,
  pick: 320,
  play: 280,
  watch: 4400,
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
  cursorOut: 9,
} as const;

type Scene = 'beach' | 'ridge' | 'forest' | 'city' | 'dunes' | 'coast';

/*
 * Index 3 is the beach, and index 3 is what the cursor picks — the clip that
 * plays has to be the clip that was selected, or the demo is showing two
 * unrelated things. It sits at the start of the second row, which also gives
 * the cursor a diagonal to travel rather than a nudge.
 */
const PICKED = 3;

const CLIPS: { name: string; length: string; scene: Scene }[] = [
  { name: 'ridge-sunrise', length: '0:14', scene: 'ridge' },
  { name: 'forest-path', length: '0:08', scene: 'forest' },
  { name: 'city-timelapse', length: '0:22', scene: 'city' },
  { name: 'beach-waves', length: '0:11', scene: 'beach' },
  { name: 'desert-dunes', length: '0:06', scene: 'dunes' },
  { name: 'coast-aerial', length: '0:17', scene: 'coast' },
];

const SIDEBAR = [
  { Icon: FolderOpen, label: 'All' },
  { Icon: Film, label: 'Video' },
  { Icon: ImageIcon, label: 'Images' },
  { Icon: Music, label: 'Audio' },
  { Icon: Type, label: 'Text' },
  { Icon: Shapes, label: 'Shapes' },
];

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
    <svg viewBox="0 0 160 100" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`sky-${scene}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={sky[0]} />
          <stop offset="100%" stopColor={sky[1]} />
        </linearGradient>
      </defs>
      <rect width="160" height="100" fill={`url(#sky-${scene})`} />

      {scene === 'beach' && (
        <>
          <circle cx="124" cy="26" r="11" fill="#FFF3C4" />
          <rect y="58" width="160" height="20" fill="#3E8FD0" />
          <path d="M0,74 Q40,68 80,74 T160,74 L160,100 L0,100 Z" fill="#E8D7A8" />
        </>
      )}
      {scene === 'ridge' && (
        <>
          <circle cx="118" cy="30" r="10" fill="#FFE9B0" />
          <path d="M0,74 L38,40 L66,68 L96,34 L134,72 L160,52 L160,100 L0,100 Z" fill="#5B4B7A" />
          <path d="M96,34 L110,50 L82,50 Z" fill="#EFE6F5" />
        </>
      )}
      {scene === 'forest' && (
        <>
          <rect y="70" width="160" height="30" fill="#3D7A55" />
          {[18, 46, 74, 102, 132].map((x, i) => (
            <path key={x} d={`M${x},${72 - (i % 2) * 6} L${x - 13},${72 - (i % 2) * 6} L${x},${34 - (i % 2) * 8} L${x + 13},${72 - (i % 2) * 6} Z`} fill="#2F5F44" />
          ))}
        </>
      )}
      {scene === 'city' && (
        <>
          {[10, 32, 52, 76, 100, 124, 144].map((x, i) => (
            <rect key={x} x={x} y={44 + ((i * 7) % 22)} width="16" height="60" fill={i % 2 ? '#1B2447' : '#243060'} />
          ))}
          <rect y="92" width="160" height="8" fill="#131a37" />
        </>
      )}
      {scene === 'dunes' && (
        <>
          <circle cx="34" cy="28" r="9" fill="#FFF6DC" />
          <path d="M0,68 Q44,50 88,70 T160,62 L160,100 L0,100 Z" fill="#D8A15C" />
          <path d="M0,84 Q52,70 104,86 T160,80 L160,100 L0,100 Z" fill="#C08847" />
        </>
      )}
      {scene === 'coast' && (
        <>
          <path d="M0,56 L160,56 L160,100 L0,100 Z" fill="#2E7FC2" />
          <path d="M0,56 Q26,44 54,54 L54,100 L0,100 Z" fill="#6C7F5B" />
          <path d="M96,60 Q126,52 160,62 L160,100 L96,100 Z" fill="#7C8F63" />
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

      {/*
       * Three wave bands at different speeds. Each is twice the viewBox wide and
       * slides exactly one viewBox width, so the loop has no seam — the frame it
       * ends on is identical to the one it started from.
       */}
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

      {/* Wet sand, then dry. */}
      <path d="M0,138 Q80,132 160,138 T320,136 L320,180 L0,180 Z" fill="#D9C79C" />
      <path d="M0,154 Q80,148 160,154 T320,152 L320,180 L0,180 Z" fill="#EBDCB4" />

      {/* Foam sliding up the sand and back, which is what makes it read as a
          beach rather than a pattern. */}
      <motion.path
        d="M0,140 Q80,133 160,140 T320,138 L320,150 Q160,156 0,150 Z"
        fill="rgba(255,255,255,0.75)"
        animate={active ? { y: [0, 9, 0], opacity: [0.5, 0.9, 0.5] } : { y: 4, opacity: 0.7 }}
        transition={active ? { duration: 3.6, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' } : { duration: 0 }}
      />
    </svg>
  );
}

function Cursor({ x, y, show }: { x: number; y: number; show: boolean }) {
  return (
    <motion.div
      className="absolute z-30 pointer-events-none"
      initial={false}
      animate={{ left: `${x}%`, top: `${y}%`, opacity: show ? 1 : 0, scale: show ? 1 : 0.6 }}
      transition={{
        left: { duration: 0.62, ease: [0.22, 1, 0.36, 1] },
        top: { duration: 0.62, ease: [0.22, 1, 0.36, 1] },
        opacity: { duration: 0.26 },
        scale: { duration: 0.26 },
      }}
    >
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
  );
}

export function MediaPoolDemo() {
  const { ref, active } = useDemo();
  const [step, setStep] = useState<number>(S.idle);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    /*
     * No grant, no timers. The step it reached stays on screen as a still frame
     * — the panel and whatever it had loaded — rather than resetting to empty,
     * which would read as broken.
     */
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
    then(STEP.play, S.cursorOut);

    // And round again. Incrementing `cycle` re-runs this effect from the top.
    t += STEP.watch;
    timers.push(setTimeout(() => setCycle((c) => c + 1), t));

    return () => timers.forEach(clearTimeout);
  }, [active, cycle]);

  const poolIn = step >= S.pool;
  const importIn = step >= S.importIn && step <= S.press;
  const importPressed = step === S.press;
  const cardsIn = step >= S.cards;
  const picked = step >= S.picked;
  const playing = step >= S.playing;
  const cursorShown = step >= S.cursorIn && step < S.cursorOut;

  /* Cursor targets, in percentages of the pool panel. */
  const cursorAt =
    step >= S.toCard
      ? { x: 34, y: 63 } // over the beach card, first of the second row
      : step >= S.cursorIn
        ? { x: 55, y: 47 } // over the import target
        : { x: 84, y: 88 };

  return (
    <div ref={ref} className="absolute inset-0 flex flex-col lg:flex-row gap-3 lg:gap-5 p-1">
      {/* ── Media pool ───────────────────────────────────────────────────── */}
      <motion.div
        className="relative flex-1 min-h-0 rounded-xl border border-fx-border overflow-hidden flex"
        style={{ background: 'rgba(18, 27, 58, 0.9)' }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: poolIn ? 1 : 0, y: poolIn ? 0 : 16 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Sidebar */}
        <div
          className="flex-shrink-0 w-[62px] sm:w-[86px] border-r border-fx-border py-2.5 px-1.5 flex flex-col gap-0.5"
          style={{ background: 'rgba(13, 20, 44, 0.85)' }}
        >
          {SIDEBAR.map(({ Icon, label }, i) => (
            <span
              key={label}
              className={`flex items-center gap-1.5 px-1.5 py-1.5 rounded-md font-mono text-[9px] tracking-wide ${
                i === 0 ? 'text-fx-accent-yellow' : 'text-fx-text-secondary'
              }`}
              style={i === 0 ? { background: 'rgba(245,197,24,0.1)' } : undefined}
            >
              <Icon className="w-3 h-3 flex-shrink-0" strokeWidth={1.75} />
              <span className="hidden sm:inline">{label}</span>
            </span>
          ))}
        </div>

        {/* Main area */}
        <div className="relative flex-1 min-w-0 flex flex-col">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-fx-border flex-shrink-0">
            <span className="font-mono text-[10px] tracking-widest uppercase text-fx-text-secondary">Media pool</span>
            <span className="flex-1" />
            <span className="flex items-center gap-1 px-2 py-1 rounded border border-fx-border text-fx-text-secondary/70">
              <Search className="w-2.5 h-2.5" strokeWidth={2} />
              <span className="hidden sm:inline font-mono text-[9px]">search</span>
            </span>
          </div>

          <div className="relative flex-1 min-h-0 p-2.5 sm:p-3">
            {/* The import target, until there is something to show instead. */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              animate={{ opacity: importIn ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.span
                className="relative flex items-center gap-2 px-4 sm:px-7 py-2.5 sm:py-4 rounded-xl border-2 border-dashed font-semibold text-xs sm:text-base"
                style={{
                  borderColor: 'rgba(245,197,24,0.55)',
                  background: 'rgba(245,197,24,0.07)',
                  color: '#F5C518',
                }}
                animate={{ scale: importPressed ? 0.94 : 1 }}
                transition={{ duration: 0.16 }}
              >
                <Upload className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
                Import from PC
                <motion.span
                  className="absolute inset-0 rounded-xl border-2 pointer-events-none"
                  style={{ borderColor: '#F5C518' }}
                  initial={{ opacity: 0, scale: 1 }}
                  animate={importPressed ? { opacity: [0.9, 0], scale: [1, 1.5] } : { opacity: 0, scale: 1 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </motion.span>
            </motion.div>

            {/* Six clips, three to a row. */}
            <div className="grid grid-cols-3 grid-rows-2 gap-2 sm:gap-2.5 h-full">
              {CLIPS.map((clip, i) => (
                <motion.div
                  key={clip.name}
                  className="relative rounded-lg overflow-hidden border flex flex-col min-h-0"
                  style={{
                    background: 'rgba(26, 37, 74, 0.9)',
                    borderColor: picked && i === PICKED ? '#F5C518' : 'rgba(230,237,243,0.1)',
                    boxShadow: picked && i === PICKED ? '0 0 0 1px #F5C518, 0 0 20px rgba(245,197,24,0.3)' : 'none',
                  }}
                  initial={{ opacity: 0, y: 10, scale: 0.94 }}
                  animate={
                    cardsIn ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 10, scale: 0.94 }
                  }
                  transition={{ duration: 0.36, delay: cardsIn ? i * 0.11 : 0, ease: 'easeOut' }}
                >
                  <div className="relative flex-1 min-h-0 overflow-hidden">
                    <Thumb scene={clip.scene} />
                    <span
                      className="absolute bottom-1 left-1 px-1 py-0.5 rounded font-mono text-[8px] sm:text-[9px] leading-none text-white"
                      style={{ background: 'rgba(8, 13, 30, 0.78)' }}
                    >
                      {clip.length}
                    </span>
                  </div>
                  <span className="flex-shrink-0 px-1.5 py-1 font-mono text-[8px] sm:text-[9px] truncate text-fx-text-secondary">
                    {clip.name}
                  </span>
                </motion.div>
              ))}
            </div>

            <Cursor x={cursorAt.x} y={cursorAt.y} show={cursorShown} />
          </div>
        </div>
      </motion.div>

      {/* ── Preview ──────────────────────────────────────────────────────── */}
      <div className="relative flex-1 min-h-0 rounded-xl border border-fx-border overflow-hidden">
        {/*
         * The same placeholder the YouTube embeds use, running from the start —
         * so the right half is busy while the left half is being worked on,
         * exactly as it would be while a preview renders.
         *
         * It sits underneath and fades out, rather than being unmounted, so the
         * handover to the clip never shows a gap. That is the same trick
         * `VideoPlaceholder` uses for real embeds.
         */}
        <VideoLoading phase={playing ? 'done' : 'loading'} />

        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: playing ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        >
          <BeachClip active={active && playing} />

          <span
            className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded font-mono text-[9px] text-white"
            style={{ background: 'rgba(8, 13, 30, 0.72)' }}
          >
            beach-waves · 0:11
          </span>
        </motion.div>
      </div>
    </div>
  );
}
