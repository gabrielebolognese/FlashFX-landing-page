'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { ElegantShapesBackground } from '@/components/ui/elegant-shapes';
import { VideoLoading, useVideoEmbed } from '@/components/ui/video-loading';
import { Demo, demoFrame, type DemoKind } from '@/components/demos';

interface VideoPlaceholderProps {
  title: string;
  description?: string;
  isMainDemo?: boolean;
  gridBackground?: boolean;
  youtubeId?: string;
  sectionHeading?: string;
  /**
   * Render a live in-page demo instead of a YouTube embed
   * (immersionmilestones.md I3).
   *
   * Takes precedence over `youtubeId`, so a section can keep its video id
   * recorded while showing the demo — reverting one section is a one-word edit.
   */
  demo?: DemoKind;
  /**
   * A visible label above the demo.
   *
   * `title` and `description` have never been rendered by this component —
   * they exist only as the iframe's accessible name and as documentation at the
   * call site. `heading` is what actually appears on the page, added so the two
   * timelines can be named as a pair under "Organize workflow".
   */
  heading?: string;
  /**
   * Anchor id for the <section>. Added 2026-08-06 so the Navbar Features
   * dropdown can scroll to the Share Projects section, which had the content
   * but no id to target.
   *
   * This file is otherwise frozen by FIX.md's M8 deferred decision. The freeze
   * covers the YouTube embed strategy and the PageLoader gate; this prop is
   * additive and touches neither. Do not read it as the freeze being lifted.
   */
  id?: string;
}

/*
 * The iframe is not created until the section is close to the viewport
 * (performancemilestones.md P2).
 *
 * Each YouTube embed pulls roughly 1–2 MB of its own JavaScript and CSS and
 * opens its own rendering context. The homepage mounts five of these plus five
 * shorts in WhatIsFlashFX; loading them all eagerly meant several megabytes of
 * third-party code before anything below the fold had been looked at, and it
 * held `window.load` open, which the old PageLoader was waiting on.
 *
 * The lead distance and the placeholder both live in `useVideoEmbed` so all
 * three embed sites behave identically. The play/pause observer is only
 * attached once the iframe exists.
 *
 * The iframe stays mounted underneath the placeholder from the moment it is
 * created — it is the placeholder that fades out, not the video that fades in,
 * so the handover never shows a gap.
 */
function YouTubeEmbed({ youtubeId, title }: { youtubeId: string; title: string }) {
  const { containerRef, shouldLoad, phase, onLoad } = useVideoEmbed<HTMLDivElement>();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const src = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&modestbranding=1&rel=0&showinfo=0&disablekb=1&iv_load_policy=3&playsinline=1&enablejsapi=1`;

  useEffect(() => {
    const container = containerRef.current;
    const iframe = iframeRef.current;
    if (!shouldLoad || !container || !iframe) return;

    const sendCommand = (func: string) => {
      iframe.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func, args: [] }),
        '*'
      );
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          sendCommand(entry.intersectionRatio < 0.3 ? 'pauseVideo' : 'playVideo');
        });
      },
      { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 1.0] }
    );

    observer.observe(container);
    return () => observer.disconnect();
    // containerRef comes from useVideoEmbed, so the linter cannot see that it
    // is a ref and therefore stable. Listing it is a no-op that keeps it quiet.
  }, [shouldLoad, containerRef]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden">
      {shouldLoad && (
        <iframe
          ref={iframeRef}
          src={src}
          title={title}
          loading="lazy"
          allow="autoplay; encrypted-media"
          onLoad={onLoad}
          style={{
            border: 'none',
            pointerEvents: 'none',
            position: 'absolute',
            width: '130%',
            height: '130%',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}
      <VideoLoading phase={phase} />
    </div>
  );
}

export function VideoPlaceholder({ title, description, isMainDemo, gridBackground, youtubeId, sectionHeading, id, demo, heading }: VideoPlaceholderProps) {
  return (
    <section
      id={id}
      className={`relative w-full px-6 overflow-hidden ${isMainDemo ? 'flex flex-col justify-center' : 'py-12 md:py-20'} ${gridBackground ? 'bg-fx-bg-base' : ''}`}
      style={isMainDemo ? { height: '100vh', minHeight: '100vh' } : undefined}
    >
      <ElegantShapesBackground />

      {gridBackground && (
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      )}
      {gridBackground && (
        <div className="absolute inset-0 pointer-events-none z-[2] bg-gradient-to-b from-fx-bg-base via-transparent to-fx-bg-base" />
      )}

      {heading && (
        <motion.h3
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative z-10 mb-5 text-center font-mono text-xs md:text-sm uppercase tracking-[0.35em] text-fx-text-secondary"
        >
          {heading}
        </motion.h3>
      )}

      {/*
        A demo picks its own frame. The default card is a video's shape — 16:9
        at max-w-5xl — which is wrong for a timeline: those need width to read
        along and height to stack tracks in. See `demoFrame`.

        `fullBleed` cancels the section's own `px-6` with a negative margin
        rather than using `100vw`, which would overflow by the width of the
        scrollbar and put a horizontal scrollbar on the page.
      */}
      <div
        className={`relative z-10 ${
          demo && demoFrame[demo].fullBleed
            ? '-mx-6 w-[calc(100%+3rem)]'
            : `${demo ? demoFrame[demo].width : 'max-w-5xl'} mx-auto w-full`
        } ${isMainDemo ? 'flex flex-col h-full py-16' : ''}`}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`relative w-full overflow-hidden group ${
            /*
              A `bare` demo gets no card at all — no surface, no border, no
              radius — so it blends into the section instead of sitting in a
              box. Everything else keeps the panel.
            */
            demo && demoFrame[demo].bare
              ? ''
              : 'rounded-[32px] bg-fx-bg-surface border border-fx-border'
          } ${/* only the empty "coming soon" state is clickable */ !demo && !youtubeId ? 'cursor-pointer' : ''} ${
            isMainDemo ? 'flex-1 min-h-0' : demo ? demoFrame[demo].aspect : 'aspect-video'
          }`}
          /*
            Full-bleed demos fade out across the outer 30% of each side, so they
            dissolve into the page instead of stopping at a hard edge. The mask
            is on this element rather than the demo itself so it applies
            whatever the demo renders.
          */
          style={
            demo && demoFrame[demo].fullBleed
              ? (() => {
                  const [a, b] = demoFrame[demo].fade ?? [30, 70];
                  const ramp = `linear-gradient(90deg, transparent 0%, #000 ${a}%, #000 ${b}%, transparent 100%)`;
                  return { maskImage: ramp, WebkitMaskImage: ramp };
                })()
              : undefined
          }
        >
          {demo ? (
            <Demo kind={demo} />
          ) : youtubeId ? (
            <YouTubeEmbed youtubeId={youtubeId} title={title} />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-button bg-fx-accent-yellow flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <Play className="w-8 h-8 text-fx-bg-base fill-fx-bg-base" />
                </div>
                {!isMainDemo && (
                  <p className="text-xs text-fx-text-secondary uppercase tracking-widest">Video coming soon</p>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
