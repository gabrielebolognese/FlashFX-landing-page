'use client';

import { useCallback, useRef, useState } from 'react';
import { DemoShell, useDemo } from './demo-kit';
import { usePlayhead } from './use-playhead';

/*
 * An NLE clip sequence, for "All Web Editing" (immersionmilestones.md I8).
 *
 * A different instrument from `TimelineDemo`, not a reskin: that one is
 * keyframes on property tracks, this is clips in a sequence — tall blocks with
 * name bars, video above, audio below with waveforms. **Do not converge them.**
 *
 * Rebuilt 2026-08-07 to be interactive and full-bleed:
 *
 *   - **Click a clip** to select it. Click again, or pick another, to change.
 *   - **Drag the playhead** along the ruler or the empty track space.
 *   - Clips light up as the playhead passes over them, so the sequence reads as
 *     playing rather than as a diagram.
 *
 * The V1/A1 gutter is gone for the same reason as the other timeline's track
 * names: at full width with the outer 30% faded, a left-hand gutter sits in the
 * invisible zone. Clips carry their own names, which is enough.
 */

const CYCLE = 12;

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

/** Deterministic bar heights — `Math.random()` during render would differ between passes. */
function waveform(seed: number, count: number): number[] {
  return Array.from({ length: count }, (_, i) => {
    const n = Math.sin((i + 1) * (seed + 1) * 0.7) * Math.cos((i + 1) * 0.31);
    return 22 + Math.abs(n) * 62;
  });
}

export function ClipTimelineDemo() {
  const { ref, active } = useDemo();
  const [selected, setSelected] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const playhead = useRef<HTMLDivElement>(null);
  const clipNodes = useRef(new Map<string, HTMLDivElement>());

  /*
   * Per-frame styling straight to the DOM. Selection is React state because it
   * changes on click; "the playhead is over this clip" is not, because it
   * changes 60 times a second.
   */
  const onFrame = useCallback((p: number) => {
    if (playhead.current) playhead.current.style.transform = `translateX(${p}%)`;

    clipNodes.current.forEach((node) => {
      const from = Number(node.dataset.from);
      const to = Number(node.dataset.to);
      const live = p >= from && p <= to;
      node.style.filter = live ? 'brightness(1.45)' : 'brightness(1)';
    });
  }, []);

  const bar = usePlayhead({ cycle: CYCLE, active, onFrame });

  const registerClip = useCallback((id: string) => (node: HTMLDivElement | null) => {
    if (node) clipNodes.current.set(id, node);
    else clipNodes.current.delete(id);
  }, []);

  const scrub = {
    onPointerDown: (e: React.PointerEvent) => {
      bar.beginScrub(e);
      setTouched(true);
    },
    onPointerMove: bar.moveScrub,
    onPointerUp: bar.endScrub,
    onPointerCancel: bar.endScrub,
  };

  return (
    <DemoShell innerRef={ref} label="Sequence" bare>
      <div
        className="relative flex items-stretch h-5 flex-shrink-0 border-b border-fx-border/60 cursor-ew-resize touch-none"
        {...scrub}
      >
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="flex-1 border-r border-fx-border/30 last:border-r-0 flex items-center pl-1.5"
          >
            <span className="font-mono text-[7px] leading-none text-fx-text-secondary/60">
              {`00:${String(i * 5).padStart(2, '0')}`}
            </span>
          </div>
        ))}
      </div>

      <div
        ref={bar.trackRef}
        className="relative flex-1 min-h-0 flex flex-col gap-[2px] py-[3px] cursor-ew-resize touch-none"
        {...scrub}
      >
        {tracks.map((track, ti) => (
          <div key={track.name} className="relative flex items-stretch flex-1 min-h-0">
            <div className="relative flex-1 my-[1px] rounded-[2px] bg-white/[0.015]">
              {track.clips.map((clip) => {
                const id = `${track.name}-${clip.at}`;
                const chosen = selected === id;
                const bars = track.kind === 'audio' ? waveform(ti, 22) : null;

                return (
                  <div
                    key={id}
                    ref={registerClip(id)}
                    data-from={clip.at}
                    data-to={clip.at + clip.len}
                    onPointerDown={(e) => {
                      // Selecting a clip must not also scrub the playhead.
                      e.stopPropagation();
                      setSelected(chosen ? null : id);
                      bar.touch();
                      setTouched(true);
                    }}
                    className="absolute top-0 bottom-0 rounded-[3px] overflow-hidden cursor-pointer transition-shadow duration-150"
                    style={{
                      left: `${clip.at}%`,
                      width: `calc(${clip.len}% - 2px)`,
                      backgroundColor: `${track.colour}${chosen ? '42' : '24'}`,
                      border: `1px solid ${track.colour}${chosen ? 'ff' : '66'}`,
                      boxShadow: chosen ? `0 0 0 1px ${track.colour}, 0 0 18px ${track.colour}55` : 'none',
                    }}
                  >
                    <div
                      className="absolute inset-x-0 top-0 h-[38%] flex items-center px-1 overflow-hidden"
                      style={{ backgroundColor: `${track.colour}${chosen ? '66' : '40'}` }}
                    >
                      <span className="font-mono text-[7px] leading-none text-white/85 truncate">
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
              })}
            </div>
          </div>
        ))}

        <div className="absolute inset-y-0 left-0 right-0 pointer-events-none">
          <div ref={playhead} className="absolute inset-y-0 left-0 right-0">
            <div className="absolute inset-y-0 -left-px w-[2px] bg-fx-accent-yellow shadow-[0_0_12px_2px_rgba(245,197,24,0.55)]" />
            <div className="absolute -top-[3px] -left-[6px] w-3.5 h-2 rounded-sm bg-fx-accent-yellow" />
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 h-6 flex items-center justify-center">
        <span
          className={`font-mono text-[10px] uppercase tracking-widest text-fx-text-secondary/60 transition-opacity duration-500 ${
            touched ? 'opacity-0' : 'opacity-100'
          }`}
        >
          Click a clip · drag the playhead
        </span>
      </div>
    </DemoShell>
  );
}
