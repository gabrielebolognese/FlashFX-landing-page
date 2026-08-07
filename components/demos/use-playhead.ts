'use client';

import { useCallback, useEffect, useRef } from 'react';

/*
 * Playhead position and scrubbing, shared by both timelines
 * (immersionmilestones.md I8).
 *
 * Two things shape the design:
 *
 * **The position never enters React state.** At 60 fps a `setState` per frame
 * would re-render a component with well over a hundred children. The position
 * lives in a ref and `onFrame` writes it straight to the DOM, so the auto-play
 * loop costs a handful of style writes and no reconciliation at all.
 *
 * **Interaction works whether or not the loop is running.** The I1 governor can
 * deny a slot, and a timeline that ignores the pointer because another section
 * is animating would read as broken. Dragging drives `onFrame` directly; the
 * grant only decides whether the playhead advances *by itself*.
 */

interface Options {
  /** Seconds for the playhead to cross the whole track once. */
  cycle: number;
  /** The governor's grant. Auto-advance only runs while true. */
  active: boolean;
  /** Receives the playhead position, 0–100, whenever it changes. */
  onFrame: (percent: number) => void;
  /** Quiet time after an interaction before auto-advance takes over again. */
  resumeAfter?: number;
}

export function usePlayhead({ cycle, active, onFrame, resumeAfter = 2600 }: Options) {
  /** Attach to the element whose width represents 0–100%. */
  const trackRef = useRef<HTMLDivElement>(null);

  const percent = useRef(0);
  const held = useRef(false);
  const idleUntil = useRef(0);
  const frame = useRef(0);
  const running = useRef(false);
  const last = useRef(0);

  const frameCb = useRef(onFrame);
  frameCb.current = onFrame;
  const activeRef = useRef(active);
  activeRef.current = active;

  const emit = useCallback(() => frameCb.current(percent.current), []);

  const stop = useCallback(() => {
    running.current = false;
    cancelAnimationFrame(frame.current);
    last.current = 0;
  }, []);

  const tick = useCallback(
    (now: number) => {
      if (!last.current) last.current = now;
      const dt = Math.min(0.05, (now - last.current) / 1000);
      last.current = now;

      // Held, or recently touched, means the visitor is in charge.
      if (!held.current && now >= idleUntil.current && activeRef.current) {
        percent.current = (percent.current + (dt / cycle) * 100) % 100;
        emit();
      }

      if (activeRef.current || held.current) {
        frame.current = requestAnimationFrame(tick);
      } else {
        stop();
      }
    },
    [cycle, emit, stop]
  );

  const start = useCallback(() => {
    if (running.current) return;
    running.current = true;
    last.current = 0;
    frame.current = requestAnimationFrame(tick);
  }, [tick]);

  useEffect(() => {
    if (active) start();
    else stop();
    return stop;
  }, [active, start, stop]);

  /** Emit once on mount so nothing renders at a stale position. */
  useEffect(() => {
    emit();
  }, [emit]);

  /** Pointer x → position along the track, clamped. */
  const percentAt = useCallback((clientX: number) => {
    const el = trackRef.current;
    if (!el) return percent.current;
    const rect = el.getBoundingClientRect();
    if (!rect.width) return percent.current;
    return Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
  }, []);

  /** Push the resume deadline out. Call from any interaction, not just scrubs. */
  const touch = useCallback(
    () => {
      idleUntil.current = performance.now() + resumeAfter;
    },
    [resumeAfter]
  );

  const beginScrub = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      held.current = true;
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
      percent.current = percentAt(e.clientX);
      touch();
      emit();
      start();
    },
    [percentAt, touch, emit, start]
  );

  const moveScrub = useCallback(
    (e: React.PointerEvent) => {
      if (!held.current) return;
      percent.current = percentAt(e.clientX);
      touch();
      emit();
    },
    [percentAt, touch, emit]
  );

  const endScrub = useCallback(
    (e: React.PointerEvent) => {
      if (!held.current) return;
      held.current = false;
      touch();
      (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    },
    [touch]
  );

  return {
    trackRef,
    /** Current position, 0–100. Read inside `onFrame` or an event handler. */
    read: () => percent.current,
    percentAt,
    touch,
    emit,
    start,
    beginScrub,
    moveScrub,
    endScrub,
  };
}
