'use client';

import dynamic from 'next/dynamic';

/*
 * Sits directly under the 3D section (immersionmilestones.md I8).
 *
 * One cube duplicates and the swarm splits — part builds the logo, which turns,
 * and the rest builds the word FlashFX, which does not. All the work is in
 * `LogoAssembly`; this is just the frame it hangs in.
 *
 * No panel and no border, as with the plane above it: the cubes should look
 * like they are in the page, not shown inside a window.
 */
const LogoAssembly = dynamic(
  () => import('@/components/demos/LogoAssembly').then((m) => m.LogoAssembly),
  {
    ssr: false,
    // Sized placeholder so nothing shifts when the chunk arrives.
    loading: () => <div className="absolute inset-0" />,
  }
);

export function LogoMorph() {
  return (
    <section
      id="logo-morph"
      className="relative w-full bg-fx-bg-base overflow-hidden"
      aria-label="FlashFX"
    >
      <div className="relative w-full max-w-[92rem] mx-auto px-4">
        {/* Light pooled behind the lockup, so it is not floating in flat navy. */}
        <div
          className="absolute left-1/2 top-1/2 w-[86%] h-[70%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(245,197,24,0.10) 0%, rgba(124,92,191,0.05) 45%, transparent 74%)',
          }}
        />

        <LogoAssembly className="relative w-full h-[34vh] min-h-[220px] md:h-[44vh] md:min-h-[300px]" />
      </div>
    </section>
  );
}
