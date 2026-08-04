'use client';

import { useEffect, useRef, useState } from 'react';

export function TrollSection() {
  const [loadVideo, setLoadVideo] = useState(false);
  const videoSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setLoadVideo(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (videoSectionRef.current) {
      observer.observe(videoSectionRef.current);
    }

    return () => {
      if (videoSectionRef.current) {
        observer.unobserve(videoSectionRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full">
      {/* Section 1: Why are you still scrolling - 300vh */}
      <section
        className="relative w-full flex items-start justify-start px-6 pt-24"
        style={{
          height: '300vh',
          backgroundColor: '#0f1a38'
        }}
      >
        <p className="text-sm text-fx-text-secondary">
          why are you still scrolling
        </p>
      </section>

      {/* Section 2: There is nothing to see here - 200vh */}
      <section
        className="relative w-full flex items-center justify-center px-6"
        style={{
          height: '200vh',
          backgroundColor: '#1c2952'
        }}
      >
        <p className="text-lg text-fx-text-secondary">
          there is nothing to see here
        </p>
      </section>

      {/* Section 3: Empty section - 200vh */}
      <section
        className="relative w-full"
        style={{
          height: '200vh',
          backgroundColor: '#1c2e63'
        }}
      />

      {/* Section 4: Scroll at your own risk - 300vh */}
      <section
        className="relative w-full flex items-center justify-center px-6"
        style={{
          height: '300vh',
          backgroundColor: '#141f40'
        }}
      >
        <p className="text-lg text-fx-text-secondary">
          scroll at your own risk
        </p>
      </section>

      {/* Final Section: Rick Roll */}
      <section ref={videoSectionRef} className="relative w-full bg-fx-bg-surface py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-2xl mb-8">
            {loadVideo ? (
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&controls=1&rel=0"
                title="Never Gonna Give You Up"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="absolute top-0 left-0 w-full h-full bg-fx-bg-base flex items-center justify-center">
                <p className="text-fx-text-secondary">Loading...</p>
              </div>
            )}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-fx-text-primary">
            Rickrolled in 2026 😭😭😭😭😭😭
          </h2>
        </div>
      </section>
    </div>
  );
}
