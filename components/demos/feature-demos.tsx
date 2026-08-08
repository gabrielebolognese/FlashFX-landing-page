'use client';

import dynamic from 'next/dynamic';

/*
 * Lazy handles for the three Features demos.
 *
 * This file exists because `app/page.tsx` is a server component, and a server
 * component cannot reach into a client module — `dynamic(() => import('./X')
 * .then(m => m.X))` written there fails the build with "Cannot access X.then on
 * the server". The dynamic call has to happen inside a `'use client'` module,
 * which is exactly what `components/demos/index.tsx` does for the
 * `VideoPlaceholder` demos. Same reason, same shape.
 *
 * All three are below the fold and canvas-heavy, so none belongs in the initial
 * bundle. `ssr: false` for the usual pair of reasons: they need a browser, and
 * there is nothing in them a crawler wants that the copy beside them does not
 * already say.
 *
 * Each loading placeholder matches the shape of the thing it stands in for, so
 * the layout does not move when the chunk lands.
 */

export const ShapeTools = dynamic(() => import('./ShapeTools').then((m) => m.ShapeTools), {
  ssr: false,
  loading: () => <div className="w-full aspect-[4/3] rounded-xl border border-fx-border" />,
});

export const ClipPlayback = dynamic(() => import('./ClipPlayback').then((m) => m.ClipPlayback), {
  ssr: false,
  loading: () => <div className="w-full aspect-[4/3] rounded-xl border border-fx-border" />,
});

export const VectorPen = dynamic(() => import('./VectorPen').then((m) => m.VectorPen), {
  ssr: false,
  loading: () => <div className="w-full border-y border-fx-border" style={{ height: 'clamp(240px, 34vw, 420px)' }} />,
});
