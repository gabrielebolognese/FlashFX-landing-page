'use client';

import { motion } from 'framer-motion';
import { DemoShell, useDemo } from './demo-kit';

/*
 * An NLE clip timeline, for "All Web Editing" (immersionmilestones.md I3).
 *
 * Added 2026-08-07. That slot previously rendered `TimelineDemo` with browser
 * chrome, which meant the homepage showed the identical timeline twice.
 *
 * This is a different instrument on purpose. `TimelineDemo` is keyframes on
 * property tracks — the animation side of the editor. This is clips in tracks:
 * tall blocks with names, video above, audio below with waveforms, the shape a
 * Premiere or Resolve sequence takes. **Do not converge the two.**
 *
 * It keeps the browser chrome, since the section's claim is that all of this
 * happens in a tab.
 */

const CYCLE = 9;

/** Where the still frame parks without a loop slot. */
const RESTING = 42;

type Clip = { at: number; len: number; label: string };
type Track = { name: string; colour: string; kind: 'video' | 'audio'; clips: Clip[] };

const tracks: Track[] = [
  { name: 'V6', colour: '#C084FC', kind: 'video', clips: [{ at: 52, len: 26, label: 'Grade' }] },
  { name: 'V5', colour: '#FB7185', kind: 'video', clips: [{ at: 8, len: 18, label: 'Flare' }, { at: 62, len: 22, label: 'Flash' }] },
  { name: 'V4', colour: '#38BDF8', kind: 'video', clips: [{ at: 22, len: 30, label: 'Lower third' }] },
  { name: 'V3', colour: '#E879F9', kind: 'video', clips: [{ at: 0, len: 20, label: 'Title' }, { at: 44, len: 24, label: 'Caption' }, { at: 78, len: 20, label: 'Outro' }] },
  { name: 'V2', colour: '#7C5CBF', kind: 'video', clips: [{ at: 12, len: 34, label: 'Overlay' }, { at: 56, len: 30, label: 'B-roll' }] },
  { name: 'V1', colour: '#F5C518', kind: 'video', clips: [{ at: 0, len: 38, label: 'Interview_01' }, { at: 39, len: 28, label: 'Cutaway' }, { at: 68, len: 32, label: 'Interview_02' }] },
  { name: 'A1', colour: '#4ADE80', kind: 'audio', clips: [{ at: 0, len: 66, label: 'Dialogue' }, { at: 67, len: 33, label: 'Dialogue' }] },
  { name: 'A2', colour: '#2DD4BF', kind: 'audio', clips: [{ at: 4, len: 92, label: 'Music bed' }] },
  { name: 'A3', colour: '#60A5FA', kind: 'audio', clips: [{ at: 18, len: 24, label: 'SFX' }, { at: 58, len: 18, label: 'SFX' }] },
  { name: 'A4', colour: '#34D399', kind: 'audio', clips: [{ at: 30, len: 46, label: 'Room tone' }] },
];

const GUTTER = 48;

/** Deterministic bar heights — no Math.random() during render. */
function waveform(seed: number, count: number): number[] {
  return Array.from({ length: count }, (_, i) => {
    const n = Math.sin((i + 1) * (seed + 1) * 0.7) * Math.cos((i + 1) * 0.31);
    return 22 + Math.abs(n) * 62;
  });
}

function ClipBlock({ clip, track, index }: { clip: Clip; track: Track; index: number }) {
  const bars = track.kind === 'audio' ? waveform(index, 22) : null;

  return (
    <div
      className="absolute top-0 bottom-0 rounded-[3px] overflow-hidden"
      style={{
        left: `${clip.at}%`,
        width: `calc(${clip.len}% - 2px)`,
        backgroundColor: `${track.colour}24`,
        border: `1px solid ${track.colour}66`,
      }}
    >
      {/* The name bar along the clip's head, as an NLE draws it. */}
      <div
        className="absolute inset-x-0 top-0 h-[38%] flex items-center px-1 overflow-hidden"
        style={{ backgroundColor: `${track.colour}40` }}
      >
        <span className="font-mono text-[7px] leading-none text-white/80 truncate">
          {clip.label}
        </span>
      </div>

      {bars ? (
        <div className="absolute inset-x-0 bottom-0 h-[62%] flex items-end gap-[1px] px-1 pb-[2px]">
          {bars.map((h, i) => (
            <span
              key={i}
              className="flex-1 rounded-[1px]"
              style={{ height: `${h}%`, backgroundColor: `${track.colour}99` }}
            />
          ))}
        </div>
      ) : (
        /* Filmstrip notches, so a video clip does not read as an empty box. */
        <div className="absolute inset-x-0 bottom-0 h-[62%] flex items-center gap-[3px] px-1">
          {Array.from({ length: 8 }, (_, i) => (
            <span
              key={i}
              className="flex-1 h-[52%] rounded-[1px]"
              style={{ backgroundColor: `${track.colour}2e` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ClipTimelineDemo() {
  const { ref, active } = useDemo();

  return (
    <DemoShell innerRef={ref} label="Sequence" chrome="browser">
      {/* Ruler with timecode */}
      <div className="flex items-stretch h-5 border-b border-fx-border/70 flex-shrink-0">
        <div className="flex-shrink-0 border-r border-fx-border/70" style={{ width: GUTTER }} />
        <div className="relative flex-1 flex">
          {Array.from({ length: 10 }, (_, i) => (
            <div
              key={i}
              className="flex-1 border-r border-fx-border/40 last:border-r-0 flex items-center pl-1"
            >
              <span className="font-mono text-[7px] leading-none text-fx-text-secondary/70">
                {`00:${String(i * 5).padStart(2, '0')}`}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative flex-1 min-h-0 flex flex-col gap-[2px] py-[3px]">
        {tracks.map((track, i) => (
          <div key={track.name} className="flex items-stretch flex-1 min-h-0">
            <div
              className="flex-shrink-0 flex items-center gap-1 px-1.5 overflow-hidden"
              style={{ width: GUTTER }}
            >
              <span
                className="w-[3px] h-[60%] rounded-full flex-shrink-0"
                style={{ backgroundColor: track.colour }}
              />
              <span className="font-mono text-[8px] leading-none text-fx-text-secondary">
                {track.name}
              </span>
            </div>

            <div className="relative flex-1 mr-2 my-[1px] rounded-[2px] bg-white/[0.02]">
              {track.clips.map((clip) => (
                <ClipBlock key={`${track.name}-${clip.at}`} clip={clip} track={track} index={i} />
              ))}
            </div>
          </div>
        ))}

        {/* Same wrapper-translate playhead — never animates `left`. */}
        <div className="absolute inset-y-0 right-2 pointer-events-none" style={{ left: GUTTER }}>
          <motion.div
            className="absolute inset-y-0 left-0 right-0"
            animate={active ? { x: ['0%', '100%'] } : { x: `${RESTING}%` }}
            transition={
              active
                ? { duration: CYCLE, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }
                : { duration: 0 }
            }
          >
            <div className="absolute inset-y-0 -left-px w-[2px] bg-fx-accent-yellow shadow-[0_0_12px_2px_rgba(245,197,24,0.5)]" />
            <div className="absolute -top-0.5 -left-[5px] w-3 h-2 rounded-sm bg-fx-accent-yellow" />
          </motion.div>
        </div>
      </div>

      <div className="flex items-center gap-4 px-3 py-1.5 border-t border-fx-border bg-fx-bg-surface/70 flex-shrink-0 overflow-hidden">
        <span className="font-mono text-[9px] text-fx-accent-yellow tabular-nums">00:00:24:11</span>
        <span className="font-mono text-[9px] text-fx-text-secondary whitespace-nowrap">10 tracks</span>
        <span className="font-mono text-[9px] text-fx-text-secondary whitespace-nowrap">1920×1080 · 60fps</span>
      </div>
    </DemoShell>
  );
}
