'use client';

import { useEffect, useRef } from 'react';

const TERMLY_SRC = 'https://app.termly.io/embed-policy.min.js';

/**
 * Renders a Termly-hosted policy document.
 *
 * Two things here look odd and are both deliberate:
 *
 * 1. `name="termly-embed"` is set imperatively rather than in JSX. Termly's
 *    script selects on exactly `div[name="termly-embed"]`, but `name` is not a
 *    valid attribute on a div, so React's types reject it. Setting it on the
 *    ref keeps the types honest without lying to Termly.
 *
 * 2. The script is removed and re-appended on every mount. Termly's script
 *    scans for embed divs when it loads and does not watch for new ones, so
 *    navigating client-side from /privacy to /terms would find the script
 *    already loaded, skip the scan, and leave the second page blank. Forcing a
 *    fresh execution per mount is what makes in-app navigation work.
 *
 * The policy text is injected client-side, so it is absent from the server HTML.
 * That is acceptable for legal pages — they exist to be read and to be found,
 * not to rank — but it is why each policy page ships real static copy above the
 * embed rather than an empty shell.
 */
export function TermlyEmbed({ dataId }: { dataId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.setAttribute('name', 'termly-embed');
    container.setAttribute('data-id', dataId);

    document
      .querySelectorAll(`script[src="${TERMLY_SRC}"]`)
      .forEach((existing) => existing.remove());

    const script = document.createElement('script');
    script.src = TERMLY_SRC;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, [dataId]);

  return (
    <>
      <div ref={containerRef} />
      <noscript>
        <p className="text-fx-text-secondary leading-relaxed">
          This policy is delivered by Termly and needs JavaScript to display. Enable
          JavaScript, or contact us on X and we will send you a copy.
        </p>
      </noscript>
    </>
  );
}
