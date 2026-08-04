import './globals.css';
import type { Metadata } from 'next';
import { Cormorant_Garamond, Outfit, JetBrains_Mono, Lexend } from 'next/font/google';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageLoader } from '@/components/PageLoader';
import { BodyWrapper, ContentGate } from '@/components/BodyWrapper';

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

export const metadata: Metadata = {
  metadataBase: new URL('https://flashfx.app'),
  title: 'FlashFX',
  icons: {
    icon: '/apple-touch-icon.png',
    apple: '/apple-touch-icon.png',
  },
  description: 'Create professional motion graphics in minutes. Free, lightweight, and built for creators. No After Effects required.',
  keywords: ['motion graphics', 'video editing', 'animation', 'FlashFX', 'after effects alternative'],
  authors: [{ name: 'FlashFX' }],
  openGraph: {
    title: 'FlashFX',
    description: 'Create professional motion graphics in minutes. Free, lightweight, and built for creators. No After Effects required.',
    url: 'https://flashfx.app',
    siteName: 'FlashFX',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FlashFX',
    description: 'Create professional motion graphics in minutes. Free, lightweight, and built for creators. No After Effects required.',
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
