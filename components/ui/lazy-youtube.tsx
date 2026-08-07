'use client';

import { VideoLoading, useVideoEmbed } from '@/components/ui/video-loading';

interface LazyYouTubeProps {
  src: string;
  title: string;
  className?: string;
  style?: React.CSSProperties;
  allow?: string;
}

/*
 * This used to observe with `threshold: 0.1` and no rootMargin, which meant the
 * iframe was not created until the video was already 10% on screen — the
 * visitor watched it load from a standing start every time. It now shares
 * `useVideoEmbed` with the other two embed sites, so it gets the same lead
 * distance and the same loading placeholder.
 *
 * The iframe mounts underneath the placeholder rather than replacing it, so
 * there is no frame where the box is empty.
 */
export function LazyYouTube({ src, title, className, style, allow = 'autoplay; encrypted-media' }: LazyYouTubeProps) {
  const { containerRef, shouldLoad, phase, onLoad } = useVideoEmbed<HTMLDivElement>();

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full">
      {shouldLoad && (
        <iframe
          className={className ?? 'absolute inset-0 w-full h-full'}
          style={style}
          src={src}
          title={title}
          allow={allow}
          onLoad={onLoad}
          allowFullScreen
        />
      )}
      <VideoLoading phase={phase} />
    </div>
  );
}
