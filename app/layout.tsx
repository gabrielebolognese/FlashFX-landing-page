import './globals.css';
import type { Metadata } from 'next';
import { Outfit, JetBrains_Mono, Inter } from 'next/font/google';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BeyondTheFooter } from '@/components/sections/BeyondTheFooter';
import { PageLoader } from '@/components/PageLoader';
import { SiteBackdrop } from '@/components/ui/site-backdrop';
import { OG_IMAGES } from '@/lib/seo';

/*
 * Three families: Inter (display), Outfit (body and UI), JetBrains Mono
 * (figures). Cormorant Garamond was the fourth until 2026-08-07, when every
 * section heading moved to Inter and nothing referenced it any more — see the
 * note on `inter` below. Lexend went earlier, in performancemilestones.md P7.
 *
 * `display: 'swap'` on all three: text is visible immediately in the fallback,
 * and Next generates a size-adjusted fallback face per family
 * (__Outfit_Fallback_*) so the swap does not shift layout.
 *
 * Outfit and Inter preload; JetBrains Mono does not, because mono only appears
 * in badges and figures further down the page.
 *
 * NOTE: you cannot verify preloading from a build made on Windows. Next's
 * font-manifest plugin matches `mod.request.includes('/next-font-loader/…')`
 * with a forward slash, and Windows module requests use backslashes, so the
 * manifest comes out empty and the built HTML has zero preload tags. Netlify
 * builds on Linux, where it works. Check the deployed HTML, not `.next/`.
 * Locally, count `.p.woff2` files in `.next/static/media` instead.
 */
const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-outfit',
  display: 'swap',
  preload: true,
});

/*
 * Inter is the display face — every section heading on the site, after the
 * sweep of 2026-08-07 that replaced the Georgia/Cormorant stacks.
 *
 * No `weight` array, so next/font serves the variable font: one file covering
 * 100–900 rather than a static instance per weight, which matters because the
 * headings across the site ask for 600, 700 and 950.
 *
 * Preloaded, unlike the other non-body faces. On every page except the homepage
 * the hero <h1> is the LCP element and it is set in this — that is exactly the
 * case P7's rule was written for.
 */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-jetbrains',
  display: 'swap',
  preload: false,
});


/*
 * The homepage (app/page.tsx) declares no metadata of its own, so it inherits
 * this block verbatim — title, robots, canonical, and social cards all come
 * from here. Editing this edits the homepage.
 *
 * ── The description is sized to the search result, not to the sentence ──────
 *
 * Google renders roughly 155–160 characters of description on desktop before
 * truncating. The previous copy ran 117 and said nothing concrete: "built for
 * creators" and "in minutes" are claims every editor makes, and it left about a
 * third of the available width empty on the one result that matters most — the
 * brand search for "flashfx".
 *
 * The replacement is 158, so it renders whole, and spends the extra length on
 * specifics a competitor cannot copy verbatim: what it is, what you can
 * actually do in it, and the two things that separate it from every desktop
 * alternative. It leads with the brand because the query it most often answers
 * is the brand.
 *
 * Every figure in it is load-bearing and must stay verifiable. "90 presets" is
 * the site's own published count (`app/features/page.tsx`, `faqData.ts`); "no
 * account needed" is a FIX.md canonical fact confirmed 2026-08-06. Do not add a
 * number here that is not already established somewhere in FIX.md.
 *
 * If you rewrite it, count the characters. Under ~140 wastes the slot; over
 * ~165 gets cut mid-clause.
 */
export const metadata: Metadata = {
  metadataBase: new URL('https://flashfx.app'),
  title: 'FlashFX: Free Browser-Based Motion Graphics & Video Editor',
  icons: {
    icon: '/apple-touch-icon.png',
    apple: '/apple-touch-icon.png',
  },
  description: 'FlashFX is a free motion graphics and video editor that runs in your browser. Keyframe animation, 90 presets, 3D and particles. No install, no account needed.',
  keywords: ['motion graphics', 'video editing', 'animation', 'FlashFX', 'after effects alternative'],
  authors: [{ name: 'FlashFX' }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'FlashFX: Free Browser-Based Motion Graphics & Video Editor',
    description: 'FlashFX is a free motion graphics and video editor that runs in your browser. Keyframe animation, 90 presets, 3D and particles. No install, no account needed.',
    url: 'https://flashfx.app',
    siteName: 'FlashFX',
    locale: 'en_US',
    type: 'website',
    images: OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FlashFX: Free Browser-Based Motion Graphics & Video Editor',
    description: 'FlashFX is a free motion graphics and video editor that runs in your browser. Keyframe animation, 90 presets, 3D and particles. No install, no account needed.',
    images: OG_IMAGES,
  },
  alternates: {
    canonical: 'https://flashfx.app/',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${jetbrainsMono.variable} ${inter.variable} font-sans`}>
        {/*
          BodyWrapper and ContentGate were removed with the loading context in
          performancemilestones.md P1. They wrapped the whole tree in a client
          component to provide state that no longer exists — PageLoader is now a
          server component and Hero renders unconditionally.
        */}
        {/*
          One field of light behind every page (immersionmilestones.md I4).
          A client component rather than a dynamic import: `ssr: false` is not
          available inside a Server Component, and this renders its CSS
          fallback on the server anyway.
        */}
        <SiteBackdrop />
        <PageLoader />
        <Navbar />
        {children}
        <Footer />
        {/*
          Below the footer, and only on the homepage. `BeyondTheFooter` gates
          itself on the pathname: the footer lives here, so this is the only
          place it can sit, but seven viewport heights of joke under the privacy
          policy would be a defect rather than a joke.
        */}
        <BeyondTheFooter />
      </body>
    </html>
  );
}
