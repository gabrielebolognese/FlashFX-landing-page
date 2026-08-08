'use client';

import dynamic from 'next/dynamic';

/*
 * Lazy handles for the "Not convinced yet?" demos.
 *
 * Same reason this file exists as `feature-demos.tsx`: `app/page.tsx` is a
 * server component, and `dynamic(() => import('./X').then(m => m.X))` written
 * there fails at prerender with "Cannot access X.then on the server". The
 * dynamic call has to sit behind `'use client'`.
 *
 * Every placeholder matches the aspect of what it stands in for, so nothing
 * moves when a chunk lands.
 */

const card = <div className="w-full aspect-[4/3] rounded-xl border border-fx-border" />;

export const AgentLanes = dynamic(() => import('./ConvinceDemos').then((m) => m.AgentLanes), {
  ssr: false,
  loading: () => card,
});

export const EditNotGenerate = dynamic(() => import('./ConvinceDemos').then((m) => m.EditNotGenerate), {
  ssr: false,
  loading: () => <div className="w-full aspect-[16/7] rounded-xl border border-fx-border" />,
});

export const AskAI = dynamic(() => import('./ConvinceDemos').then((m) => m.AskAI), {
  ssr: false,
  loading: () => card,
});

export const InspiredBy = dynamic(() => import('./ConvinceDemos').then((m) => m.InspiredBy), {
  ssr: false,
  loading: () => card,
});

export const Endless = dynamic(() => import('./ConvinceDemos').then((m) => m.Endless), {
  ssr: false,
  loading: () => <div className="w-full rounded-xl border border-fx-border" style={{ minHeight: 300 }} />,
});
