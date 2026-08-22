import type { CSSProperties } from 'react';

/**
 * Height for a section that should fill the screen a phone can actually see.
 *
 * Pairs with the `.fx-vh` / `.fx-min-vh` utilities in `app/globals.css` — read
 * the note there for why this is `svh` rather than `dvh`, and why it goes
 * through a custom property instead of a Tailwind arbitrary value.
 *
 * ```tsx
 * <section className="fx-vh" style={vh(100)} />        // full screen
 * <div className="fx-vh" style={vh(64, 76)} />         // 64svh, 76svh from md
 * ```
 *
 * The cast is unavoidable: `CSSProperties` has no index signature for custom
 * properties, so a `--`-prefixed key is a type error without it. Confining the
 * cast to this one function keeps it out of the eleven call sites.
 */
export function vh(value: number, md?: number): CSSProperties {
  const style: Record<string, number> = { '--fx-vh': value };
  if (md !== undefined) style['--fx-vh-md'] = md;
  return style as CSSProperties;
}
