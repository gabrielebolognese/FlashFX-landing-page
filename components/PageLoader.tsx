'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePageLoaded } from '@/lib/loading-context';

export function PageLoader() {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [dotCount, setDotCount] = useState(1);
  const { setIsLoaded, videosReady } = usePageLoaded();

  const animatingRef = useRef(true);
  const rafRef = useRef<number>(0);
  const windowLoadedRef = useRef(false);
  const videosReadyRef = useRef(false);
  const finishedRef = useRef(false);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    animatingRef.current = false;
    cancelAnimationFrame(rafRef.current);
    setProgress(100);
    setTimeout(() => setFadeOut(true), 150);
  }, []);

  const tryFinish = useCallback(() => {
    if (windowLoadedRef.current && videosReadyRef.current) {
      finish();
    }
  }, [finish]);

  useEffect(() => {
    const startTime = performance.now();
    const FAKE_DURATION = 3000;
    const FAKE_CEILING = 90;
    const MAX_WAIT = 6000;

    const tick = (now: number) => {
      if (!animatingRef.current) return;
      const elapsed = now - startTime;
      const raw = Math.min(FAKE_CEILING, (elapsed / FAKE_DURATION) * FAKE_CEILING);
      setProgress(Math.floor(raw));
      if (raw < FAKE_CEILING) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    const handleLoad = () => {
      windowLoadedRef.current = true;
      tryFinish();
    };

    if (document.readyState === 'complete') {
      windowLoadedRef.current = true;
      tryFinish();
    } else {
      window.addEventListener('load', handleLoad, { once: true });
    }

    const safetyTimer = setTimeout(() => {
      windowLoadedRef.current = true;
      videosReadyRef.current = true;
      finish();
    }, MAX_WAIT);

    return () => {
      animatingRef.current = false;
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('load', handleLoad);
      clearTimeout(safetyTimer);
    };
  }, [tryFinish, finish]);

  useEffect(() => {
    videosReadyRef.current = videosReady;
    if (videosReady) tryFinish();
  }, [videosReady, tryFinish]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((d) => (d % 3) + 1);
    }, 450);
    return () => clearInterval(interval);
  }, []);

  if (hidden) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#080e1f',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 0.6s ease',
        opacity: fadeOut ? 0 : 1,
        pointerEvents: fadeOut ? 'none' : 'auto',
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)
        `,
        backgroundSize: '44px 44px',
      }}
      onTransitionEnd={(e) => {
        if (e.propertyName === 'opacity' && fadeOut) {
          setIsLoaded(true);
          setHidden(true);
        }
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 55% 45% at 50% 50%, rgba(30, 80, 200, 0.14) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2.5rem',
          position: 'relative',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/android-chrome-192x192 copy.png"
          alt="FlashFX"
          style={{
            width: '160px',
            height: '160px',
            objectFit: 'contain',
            filter: 'drop-shadow(0 0 24px rgba(245,160,24,0.45))',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-lexend), sans-serif',
              fontSize: '1.875rem',
              fontWeight: 300,
              color: '#dde6f5',
              letterSpacing: '-0.05em',
              lineHeight: 1,
              minWidth: '3ch',
              textAlign: 'right',
              display: 'inline-flex',
              alignItems: 'baseline',
              gap: '0.1em',
            }}
          >
            {progress}
            <span
              style={{
                fontSize: '1rem',
                fontWeight: 400,
                color: '#F5A818',
                letterSpacing: '-0.02em',
              }}
            >
              %
            </span>
          </span>

          <span
            style={{
              fontFamily: 'var(--font-lexend), sans-serif',
              fontSize: '0.7rem',
              fontWeight: 400,
              color: 'rgba(180, 200, 230, 0.45)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              minWidth: '18ch',
              textAlign: 'center',
            }}
          >
            {progress >= 90 ? 'loading components' : 'loading videos'}
            {'.'.repeat(dotCount)}
          </span>
        </div>
      </div>
    </div>
  );
}
