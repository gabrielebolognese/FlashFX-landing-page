import './globals.css';
import type { Metadata } from 'next';
import { Outfit, JetBrains_Mono, Inter } from 'next/font/google';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageLoader } from '@/components/PageLoader';
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
      <body className={`${outfit.variable} ${jetbrainsMono.variable} ${inter.variable} font-sans`}>
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
