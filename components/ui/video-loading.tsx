'use client';

import { useEffect, useRef, useState } from 'react';

/*
 * The placeholder shown while a YouTube embed boots.
 *
 * Embeds are created on approach rather than up front (performancemilestones.md
 * P2), which is what removed ten eager iframes from the homepage. What that
 * traded away is a window — usually a second or two — where the visitor is
 * looking at the box while YouTube's player loads. Until now that window showed
 * a flat empty rectangle, which reads as "broken" rather than "loading".
 *
 * The visuals are entirely CSS (`.fx-vl-*` in globals.css) so that ten of these
 * on one page cost no per-frame JavaScript. See that file for why each piece is
 * built the way it is.
 */

/** Distance from the viewport at which the iframe starts loading. */
export const VIDEO_ROOT_MARGIN = '900px';

/**
 * How long to keep the placeholder up after the iframe's `load` event.
 *
 * `load` fires when the embed document is parsed, not when the video is
 * showing — the player still has to initialise and paint. Handing over on
 * `load` alone swaps the animation for a black rectangle, which looks worse
 * than the wait it replaced. This is a heuristic, not a signal from the player;
 * the YouTube iframe API could report readiness exactly, but that means loading
 * their API on top of the embed, which is the opposite of the point.
 */
const HANDOVER_MS = 420;

type Phase = 'idle' | 'loading' | 'done';

/**
 * Owns the lifecycle shared by all three embed sites: watch for approach,
 * create the iframe, keep the placeholder up until the player has painted.
 *
 * Returns the ref to attach to the container, whether the iframe should exist,
 * the phase to hand to `<VideoLoading>`, and the `onLoad` handler for the
 * iframe.
 */
export function useVideoEmbed<T extends HTMLElement>() {
  const containerRef = useRef<T>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [phase, setPhase] = useState<Phase>('idle');

  useEffect(() => {
    const container = containerRef.current;
    if (!container || shouldLoad) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          setPhase('loading');
          observer.disconnect();
        }
      },
      { rootMargin: VIDEO_ROOT_MARGIN }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [shouldLoad]);

  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(timer.current), []);

  const onLoad = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setPhase('done'), HANDOVER_MS);
  };

  return { containerRef, shouldLoad, phase, onLoad };
}

export function VideoLoading({
  phase,
  compact,
  label = 'Video loading',
}: {
  phase: Phase;
  compact?: boolean;
  label?: string;
}) {
  // Five keyframes, evenly spread. The delay is the moment the playhead
  // reaches each one, so they light up in sequence as it sweeps past.
  const marks = [0, 25, 50, 75, 100];

  /*
   * `aria-hidden` throughout: this is decorative. The homepage carries 13 of
   * these, so making the label a live region would give a screen reader 13
   * things announcing "Video loading". Each iframe already has its own `title`,
   * which is the accessible name that actually matters.
   */
  return (
    <div
      className={[
        'fx-vl',
        compact ? 'fx-vl--sm' : '',
        phase === 'idle' ? 'fx-vl--idle' : '',
        phase === 'done' ? 'fx-vl--done' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-hidden="true"
    >
      <div className="fx-vl-sheen" />

      <div className="fx-vl-core">
        <div className="fx-vl-ring">
          <div className="fx-vl-arc" />
          <svg className="fx-vl-play" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5.5v13a1 1 0 0 0 1.54.84l10-6.5a1 1 0 0 0 0-1.68l-10-6.5A1 1 0 0 0 8 5.5Z" />
          </svg>
        </div>

        {/* The shorts are 9:16 and far too narrow for a timeline to read. */}
        {!compact && (
          <div className="fx-vl-track">
            {marks.map((pct) => (
              <span
                key={pct}
                className="fx-vl-kf"
                style={{ left: `${pct}%`, animationDelay: `${(pct / 100) * 2200}ms` }}
              />
            ))}
            <div className="fx-vl-headwrap">
              <div className="fx-vl-head" />
            </div>
          </div>
        )}

        <p className="fx-vl-label">{label}</p>
      </div>
    </div>
  );
}
