import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { XCommentTool } from '@/components/sections/x-comment/XCommentTool';

/*
 * `/x-comment` — a personal tool that happens to live in this repo.
 *
 * It is **not part of the site**. This repo builds and deploys flashfx.app, so
 * anything added here is public by default; this page opts out three ways:
 *
 *   1. `notFound()` in a production build, so it does not exist on flashfx.app.
 *   2. `noindex, nofollow`, so it is not advertised even in dev.
 *   3. Excluded from the sitemap in `next-sitemap.config.js`.
 *
 * The matching route handler at `/api/x-comment` 404s in production for the same
 * reason, and that one matters more: it is the half that holds the API key.
 */

export const metadata: Metadata = {
  title: 'X comment assistant',
  robots: { index: false, follow: false },
};

export default function XCommentPage() {
  if (process.env.NODE_ENV === 'production') notFound();
  return <XCommentTool />;
}
