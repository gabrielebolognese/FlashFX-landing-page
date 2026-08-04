import './globals.css';
import type { Metadata } from 'next';
import { Cormorant_Garamond, Outfit, JetBrains_Mono, Lexend } from 'next/font/google';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageLoader } from '@/components/PageLoader';
import { BodyWrapper, ContentGate } from '@/components/BodyWrapper';
import { OG_IMAGES } from '@/lib/seo';

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['600'],
  variable: '--font-cormorant',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-outfit',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-jetbrains',
  display: 'swap',
});

const lexend = Lexend({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-lexend',
  display: 'swap',
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
      <body className={`${cormorantGaramond.variable} ${outfit.variable} ${jetbrainsMono.variable} ${lexend.variable} font-sans`}>
        <BodyWrapper>
          <PageLoader />
          <ContentGate>
            <Navbar />
            {children}
            <Footer />
          </ContentGate>
        </BodyWrapper>
      </body>
    </html>
  );
}
