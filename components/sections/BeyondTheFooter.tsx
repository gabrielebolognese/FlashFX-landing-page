'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

/*
 * The joke under the footer.
 *
 * Six screens of nothing below where the page has already ended, two of them
 * with a warning on, and then the video everybody knows. It only pays off for
 * someone who keeps scrolling past a footer, which is the whole point: it is
 * not marketing and it is not meant to be found by everyone.
 *
 * ── Homepage only ───────────────────────────────────────────────────────────
 *
 * `usePathname` rather than putting it straight into the layout. The footer is
 * rendered by `app/layout.tsx`, so "under the footer" means the layout is the
 * only place this can go — but the layout is every route, and seven extra
 * viewport heights under the refund policy, the privacy policy and six SEO
 * landing pages is not a joke, it is a defect. One route carries it.
 *
 * ── The iframe does not exist until it is reached ───────────────────────────
 *
 * Server HTML on every route contains zero iframes and that is worth keeping
 * (performancemilestones.md P2). This one is created by an IntersectionObserver
 * like the rest, but with **no `rootMargin`** and a high threshold, unlike
 * `useVideoEmbed`'s 400px lead. The brief was that it plays when you *reach* the
 * section; a lead distance would have it playing to an empty screen while the
 * visitor is still two sections above, and the observer disconnects afterwards
 * so it cannot restart on the way back up.
 *
 * Muted, because `autoplay` without `mute` is refused by every current browser
 * and because a page that makes noise on its own is a worse joke than one that
 * does not.
 *
 * ── The backdrop knows about this ───────────────────────────────────────────
 *
 * `data-fx-beyond` is read by `site-backdrop.tsx`, which drives its colour ramp
 * off scroll progress. Without it, seven screens of padding would stretch that
 * ramp so the real page never reaches the light end of the gradient.
 */

/** Six screens. Slightly different blues so the seams are visible. */
const SCREENS: Array<{ shade: string; line?: string }> = [
  { shade: '#0a1226' },
  { shade: '#0c162f' },
  { shade: '#0e1a38', line: 'Stop scrolling' },
  { shade: '#101e41' },
  { shade: '#12224a', line: 'I warned you' },
  { shade: '#0a1226' },
];

const VIDEO_ID = 'dQw4w9WgXcQ';

export function BeyondTheFooter() {
  const pathname = usePathname();
  const stage = useRef<HTMLDivElement>(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const node = stage.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setPlay(true);
          // Once is enough. Leaving it connected would restart the video every
          // time the section came back on screen.
          observer.disconnect();
        }
      },
      // No rootMargin on purpose: this fires on arrival, not in anticipation.
      { threshold: 0.55 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  if (pathname !== '/') return null;

  return (
    <div data-fx-beyond="true">
      {SCREENS.map((screen, i) => (
        <section
          key={i}
          className="relative w-full h-screen flex items-center justify-center"
          style={{ background: screen.shade }}
          // The empty ones are spacers and nothing else; there is no reason for
          // a screen reader to announce five of them.
          aria-hidden={screen.line ? undefined : true}
        >
          {screen.line && (
            <p
              className="px-6 text-center text-4xl sm:text-6xl md:text-7xl text-white/85"
              style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 700, letterSpacing: '-0.035em' }}
            >
              {screen.line}
            </p>
          )}
        </section>
      ))}

      <section
        ref={stage}
        className="relative w-full h-screen flex items-center justify-center px-4"
        style={{ background: '#05070f' }}
      >
        <div
          className="relative w-full max-w-5xl overflow-hidden rounded-xl border border-fx-border shadow-2xl"
          style={{ aspectRatio: '16 / 9' }}
        >
          {play ? (
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1`}
              title="Rick Astley - Never Gonna Give You Up"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          ) : (
            // A still frame rather than a blank box, so the section is composed
            // for the moment before the observer fires.
            <div className="absolute inset-0 flex items-center justify-center" style={{ background: '#0b1020' }}>
              <span className="font-mono text-[11px] uppercase tracking-widest text-fx-text-secondary/50">
                you were told twice
              </span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
