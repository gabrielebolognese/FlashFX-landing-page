'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card } from '@/components/ui/fx-card';
import { CHANGE_META, releases } from './changelogData';

function formatDate(iso: string) {
  // Fixed locale and UTC: the server and the browser must format identically or
  // React logs a hydration mismatch on every load.
  return new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function ChangelogList() {
  if (releases.length === 0) {
    return (
      <section className="relative w-full px-6 pb-20 md:pb-28">
        <div className="max-w-3xl mx-auto">
          <Card>
            <h2 className="font-display text-2xl font-bold text-fx-text-primary mb-4">
              Nothing published here yet
            </h2>
            <p className="text-fx-text-secondary leading-relaxed mb-6">
              We ship continuously and this page is where releases will be written up. Until
              the first entry lands, these are the places where changes actually show up:
            </p>
            <ul className="space-y-3">
              <li className="text-fx-text-secondary leading-relaxed pl-4 relative">
                <span
                  className="absolute left-0 top-[0.55em] w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: 'rgba(245, 197, 24, 0.6)' }}
                />
                <a
                  href="https://roadmap.flashfx.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fx-accent-blue hover:underline"
                >
                  roadmap.flashfx.app
                </a>{' '}
: what is being built next
              </li>
              <li className="text-fx-text-secondary leading-relaxed pl-4 relative">
                <span
                  className="absolute left-0 top-[0.55em] w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: 'rgba(245, 197, 24, 0.6)' }}
                />
                <a
                  href="https://blog.flashfx.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fx-accent-blue hover:underline"
                >
                  blog.flashfx.app
                </a>{' '}
: longer write-ups of bigger changes
              </li>
              <li className="text-fx-text-secondary leading-relaxed pl-4 relative">
                <span
                  className="absolute left-0 top-[0.55em] w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: 'rgba(245, 197, 24, 0.6)' }}
                />
                <a
                  href="https://x.com/FlashFXeditor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fx-accent-blue hover:underline"
                >
                  X
                </a>{' '}
: smaller changes as they land
              </li>
            </ul>
            <p className="text-sm text-fx-text-secondary leading-relaxed mt-8 pt-6 border-t border-fx-border">
              Because everything runs in the browser, you are always on the current version.
              There is nothing to update: see{' '}
              <Link href="/download" className="text-fx-accent-blue hover:underline">
                how installing works
              </Link>
              .
            </p>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full px-6 pb-20 md:pb-28">
      <div className="max-w-3xl mx-auto space-y-8">
        {releases.map((release, i) => (
          <motion.article
            key={`${release.date}-${release.title}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: Math.min(i, 4) * 0.05 }}
          >
            <Card>
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-4">
                <time
                  dateTime={release.date}
                  className="font-mono text-xs uppercase tracking-wider text-fx-text-secondary"
                >
                  {formatDate(release.date)}
                </time>
                {release.version && (
                  <span className="font-mono text-xs" style={{ color: '#f5c842' }}>
                    v{release.version}
                  </span>
                )}
              </div>

              <h2 className="font-display text-2xl font-bold text-fx-text-primary mb-5">
                {release.title}
              </h2>

              <ul className="space-y-3">
                {release.changes.map((change) => {
                  const meta = CHANGE_META[change.type];
                  return (
                    <li key={change.text} className="flex flex-col sm:flex-row sm:gap-4">
                      <span
                        className="font-mono text-xs uppercase tracking-wider w-20 flex-shrink-0 pt-0.5"
                        style={{ color: meta.color }}
                      >
                        {meta.label}
                      </span>
                      <span className="text-sm text-fx-text-secondary leading-relaxed">
                        {change.text}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
