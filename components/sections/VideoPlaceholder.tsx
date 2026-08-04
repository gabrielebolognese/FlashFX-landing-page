'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { ElegantShapesBackground } from '@/components/ui/elegant-shapes';
import { usePageLoaded } from '@/lib/loading-context';

interface VideoPlaceholderProps {
  title: string;
  description?: string;
  isMainDemo?: boolean;
  gridBackground?: boolean;
  youtubeId?: string;
  sectionHeading?: string;
}

function YouTubeEmbed({ youtubeId, title }: { youtubeId: string; title: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { markVideoReady } = usePageLoaded();

  const src = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&modestbranding=1&rel=0&showinfo=0&disablekb=1&iv_load_policy=3&playsinline=1&enablejsapi=1`;

  useEffect(() => {
    const container = containerRef.current;
    const iframe = iframeRef.current;
    if (!container || !iframe) return;

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
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden">
      <iframe
        ref={iframeRef}
        src={src}
        title={title}
        allow="autoplay; encrypted-media"
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
        onLoad={() => markVideoReady()}
      />
    </div>
  );
}

export function VideoPlaceholder({ title, description, isMainDemo, gridBackground, youtubeId, sectionHeading }: VideoPlaceholderProps) {
  return (
    <section
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

      <div className={`relative z-10 max-w-5xl mx-auto w-full ${isMainDemo ? 'flex flex-col h-full py-16' : ''}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`relative w-full rounded-[32px] bg-fx-bg-surface border border-fx-border overflow-hidden group ${youtubeId ? '' : 'cursor-pointer'} ${isMainDemo ? 'flex-1 min-h-0' : 'aspect-video'}`}
        >
          {youtubeId ? (
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
