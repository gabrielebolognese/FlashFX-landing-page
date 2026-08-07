import './globals.css';
import type { Metadata } from 'next';
import { Cormorant_Garamond, Outfit, JetBrains_Mono } from 'next/font/google';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageLoader } from '@/components/PageLoader';
import { OG_IMAGES } from '@/lib/seo';

/*
 * Three families, down from four (performancemilestones.md P7).
 *
 * Lexend was the fourth. It was a second geometric sans sitting alongside
 * Outfit doing the same job, and one of the places it was used is the homepage
 * <h1> — the LCP element. That made the largest text on the site depend on a
 * font file nothing else on the critical path needed. Those usages are now
 * Outfit, which the body already requires, so the LCP text renders in a family
 * that was being fetched regardless.
 *
 * Outfit gains weight 700 in the trade. The spans that moved off Lexend carry
 * `font-bold`, and Lexend only ever loaded 400 — so every one of them was
 * synthetically emboldened by the browser. Three Outfit files replace two
 * Outfit files plus one Lexend file: same file count, one fewer family, real
 * bold where there was faux bold.
 *
 * `display: 'swap'` on all three is deliberate — text is visible immediately in
 * the fallback. Next generates a size-adjusted fallback face per family
 * (__Outfit_Fallback_*) so the swap does not shift layout.
 */
/*
 * Only Outfit preloads. Next.js preloads every family it is given — that was
 * four high-priority font requests on every route, competing with the CSS and
 * the LCP image.
 *
 * Above the fold on the homepage, the only typeface used is Outfit: the
 * headline, the sub-headline, the navbar wordmark and the buttons. Cormorant
 * (section <h2>s) and JetBrains Mono (figures and badges) appear further down.
 * Sub-page heroes do carry the occasional mono badge, so those fetch a little
 * later than they used to — with `display: swap` and a size-adjusted fallback
 * that is a brief swap, not invisible text and not a layout shift.
 *
 * NOTE: you cannot verify preloading from a build made on Windows. Next's
 * font-manifest plugin matches `mod.request.includes('/next-font-loader/…')`
 * with a forward slash, and Windows module requests use backslashes, so the
 * manifest comes out empty and the built HTML has zero preload tags. Netlify
 * builds on Linux, where it works. Check the deployed HTML, not `.next/`.
 * Locally, count `.p.woff2` files in `.next/static/media` instead — the `.p.`
 * infix is what `preload: true` produces.
 */
const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['600'],
  variable: '--font-cormorant',
  display: 'swap',
  preload: false,
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-outfit',
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
 */
export const metadata: Metadata = {
  metadataBase: new URL('https://flashfx.app'),
  title: 'FlashFX — Free Browser-Based Motion Graphics & Video Editor',
  icons: {
    icon: '/apple-touch-icon.png',
    apple: '/apple-touch-icon.png',
  },
  description: 'Create professional motion graphics in minutes. Free, lightweight, and built for creators. No After Effects required.',
  keywords: ['motion graphics', 'video editing', 'animation', 'FlashFX', 'after effects alternative'],
  authors: [{ name: 'FlashFX' }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'FlashFX — Free Browser-Based Motion Graphics & Video Editor',
    description: 'Create professional motion graphics in minutes. Free, lightweight, and built for creators. No After Effects required.',
    url: 'https://flashfx.app',
    siteName: 'FlashFX',
    locale: 'en_US',
    type: 'website',
    images: OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FlashFX — Free Browser-Based Motion Graphics & Video Editor',
    description: 'Create professional motion graphics in minutes. Free, lightweight, and built for creators. No After Effects required.',
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
      <body className={`${cormorantGaramond.variable} ${outfit.variable} ${jetbrainsMono.variable} font-sans`}>
        {/*
          BodyWrapper and ContentGate were removed with the loading context in
          performancemilestones.md P1. They wrapped the whole tree in a client
          component to provide state that no longer exists — PageLoader is now a
          server component and Hero renders unconditionally.
        */}
        <PageLoader />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
