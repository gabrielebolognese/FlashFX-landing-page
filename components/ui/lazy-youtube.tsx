'use client';

import { useEffect, useRef, useState } from 'react';

interface LazyYouTubeProps {
  src: string;
  title: string;
  className?: string;
  style?: React.CSSProperties;
  allow?: string;
}

export function LazyYouTube({ src, title, className, style, allow = 'autoplay; encrypted-media' }: LazyYouTubeProps) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setLoaded(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="absolute inset-0 w-full h-full">
      {loaded ? (
        <iframe
          className={className ?? 'absolute inset-0 w-full h-full'}
          style={style}
          src={src}
          title={title}
          allow={allow}
          allowFullScreen
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-black/20" />
      )}
    </div>
  );
}
