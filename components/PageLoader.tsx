/*
 * Brand splash. A server component — no 'use client', no state, no timers, no
 * JavaScript of any kind.
 *
 * What this replaced, and why (performancemilestones.md P1):
 *
 * The previous version was a client component that animated a fake progress bar
 * with requestAnimationFrame and dismissed only once BOTH `window.load` had
 * fired AND five YouTube iframes had called markVideoReady(). `window.load`
 * waits for every image and every iframe on the page, so on the homepage — 6.6 MB
 * of PNGs and 13 embeds — it fired far too late, and the 6-second safety
 * fallback was what actually dismissed the overlay on essentially every visit.
 * On every other route there were no videos at all, so the video condition could
 * never be satisfied and the full 6 seconds was guaranteed by construction.
 *
 * Three properties matter here and should survive any future edit:
 *
 * 1. It is in the server HTML, so there is no flash of content followed by an
 *    overlay appearing.
 * 2. It is `pointer-events: none` from the first frame, so it never blocks a
 *    click on the content rendered underneath it.
 * 3. The fade is a CSS animation, so it begins at first paint, needs no
 *    hydration, and has no way to wait on a third party. It cannot hang.
 *
 * Timing lives in `.fx-splash` in app/globals.css (520ms total), not here.
 */
export function PageLoader() {
  return (
    <div
      aria-hidden="true"
      className="fx-splash"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        pointerEvents: 'none',
        backgroundColor: '#080e1f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)
        `,
        backgroundSize: '44px 44px',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 55% 45% at 50% 50%, rgba(30, 80, 200, 0.14) 0%, transparent 70%)',
        }}
      />

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/android-chrome-192x192.png"
        alt=""
        width={128}
        height={128}
        className="fx-splash-mark"
        style={{
          position: 'relative',
          width: '128px',
          height: '128px',
          objectFit: 'contain',
          filter: 'drop-shadow(0 0 24px rgba(245,160,24,0.45))',
        }}
      />
    </div>
  );
}
