import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page not found — FlashFX',
  description: 'That page does not exist. Here is the way back into FlashFX.',
  robots: {
    index: false,
    follow: true,
  },
};

/*
 * Every destination below is a route that actually exists. Add to this list only
 * when the target ships — a 404 page that links to another 404 is worse than the
 * Next.js default it replaces.
 */
const destinations = [
  { href: '/', title: 'Home', description: 'What FlashFX is, and what it can do.' },
  { href: '/features', title: 'Features', description: 'Design, animation, 3D, and export.' },
  { href: '/pricing', title: 'Pricing', description: 'The free tier, Ultra, and Teams.' },
  { href: '/about', title: 'About', description: 'The team building FlashFX.' },
  {
    href: '/after-effects-alternative',
    title: 'vs After Effects',
    description: 'How the two compare, feature by feature.',
  },
  {
    href: '/video-editing-software-for-beginners',
    title: 'For beginners',
    description: 'Start here if you have never animated anything.',
  },
];

export default function NotFound() {
  return (
    <main className="relative w-full px-6 py-24 md:py-32">
      <div className="max-w-5xl mx-auto">
        <p className="mono-accent text-xs uppercase tracking-[0.2em] mb-5">Error 404</p>

        <h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          style={{ fontFamily: 'Georgia, serif', letterSpacing: '-0.03em' }}
        >
          <span className="text-white">This page </span>
          <span style={{ color: '#f5c842' }}>does not exist</span>
        </h1>

        <p className="text-lg md:text-xl text-fx-text-secondary max-w-2xl leading-relaxed mb-14">
          The link may be out of date, or the address may have a typo in it. Nothing is
          broken on your end — here is where you might have been heading.
        </p>

        <nav aria-label="Suggested pages">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {destinations.map((destination) => (
              <li key={destination.href}>
                <Link
                  href={destination.href}
                  className="block h-full p-5 bg-fx-bg-surface border border-fx-border border-t-[rgba(230,237,243,0.12)] rounded-card transition-colors duration-150 hover:border-fx-accent-yellow"
                >
                  <span className="block font-display text-lg font-bold text-fx-text-primary mb-1.5">
                    {destination.title}
                  </span>
                  <span className="block text-sm text-fx-text-secondary leading-relaxed">
                    {destination.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className="text-sm text-fx-text-secondary mt-14">
          Or go straight to the editor at{' '}
          <a
            href="https://editor.flashfx.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-fx-accent-blue hover:underline"
          >
            editor.flashfx.app
          </a>
          .
        </p>
      </div>
    </main>
  );
}
