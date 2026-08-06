'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Search, X } from 'lucide-react';
import Link from 'next/link';
import { CATEGORIES, faqData, type FaqCategory } from './faqData';

export function FAQExplorer() {
  const [query, setQuery] = useState('');
  const [openKey, setOpenKey] = useState<string | null>(null);

  /*
   * Substring match across question and answer. Deliberately not fuzzy: with a
   * few dozen entries a plain match is predictable, and predictable beats clever
   * when someone is looking for one specific answer. Revisit if this grows past
   * a couple of hundred questions.
   */
  const groups = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const matches = needle
      ? faqData.filter(
          (entry) =>
            entry.question.toLowerCase().includes(needle) ||
            entry.answer.toLowerCase().includes(needle)
        )
      : faqData;

    return CATEGORIES.map((category: FaqCategory) => ({
      category,
      entries: matches.filter((entry) => entry.category === category),
    })).filter((group) => group.entries.length > 0);
  }, [query]);

  const total = groups.reduce((sum, group) => sum + group.entries.length, 0);

  return (
    <section className="relative w-full px-6 pb-20 md:pb-28">
      <div className="max-w-4xl mx-auto">
        <div className="relative mb-4">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-fx-text-secondary pointer-events-none"
            aria-hidden="true"
          />
          <label htmlFor="faq-search" className="sr-only">
            Search the FAQ
          </label>
          <input
            id="faq-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search questions..."
            autoComplete="off"
            className="w-full bg-fx-bg-surface border border-fx-border rounded-card pl-14 md:pl-16 pr-14 py-5 md:py-7 text-lg md:text-2xl text-fx-text-primary placeholder:text-fx-text-secondary focus:outline-none focus:border-fx-accent-yellow transition-colors"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-fx-text-secondary hover:text-fx-text-primary transition-colors"
              aria-label="Clear search"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          )}
        </div>

        <p className="font-mono text-xs text-fx-text-secondary uppercase tracking-wider mb-12" aria-live="polite">
          {query
            ? `${total} ${total === 1 ? 'result' : 'results'} for "${query}"`
            : `${faqData.length} questions`}
        </p>

        {groups.length === 0 ? (
          <div className="border border-fx-border rounded-card bg-fx-bg-surface px-6 py-12 text-center">
            <p className="text-fx-text-primary text-lg mb-3">Nothing matched that.</p>
            <p className="text-fx-text-secondary leading-relaxed">
              Try a shorter phrase, or ask us on{' '}
              <a
                href="https://x.com/FlashFXeditor"
                target="_blank"
                rel="noopener noreferrer"
                className="text-fx-accent-blue hover:underline"
              >
                X
              </a>
              .
            </p>
          </div>
        ) : (
          <div className="space-y-14">
            {groups.map((group) => (
              <div key={group.category}>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-fx-text-primary mb-6">
                  {group.category}
                </h2>
                <div className="space-y-4">
                  {group.entries.map((entry) => {
                    const key = `${group.category}-${entry.question}`;
                    const isOpen = openKey === key;

                    return (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        className="border border-fx-border rounded-card bg-fx-bg-surface overflow-hidden"
                      >
                        <button
                          onClick={() => setOpenKey(isOpen ? null : key)}
                          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-fx-bg-raised transition-colors"
                          aria-expanded={isOpen}
                        >
                          <span className="font-lexend text-lg font-bold text-fx-text-primary pr-4">
                            {entry.question}
                          </span>
                          <ChevronDown
                            className={`w-5 h-5 text-fx-text-secondary flex-shrink-0 transition-transform ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                            aria-hidden="true"
                          />
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-4">
                            <p className="text-fx-text-secondary leading-relaxed">{entry.answer}</p>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-fx-text-secondary leading-relaxed mt-14 text-center">
          Still stuck?{' '}
          <Link href="/features" className="text-fx-accent-blue hover:underline">
            Browse the features
          </Link>
          ,{' '}
          <Link href="/pricing" className="text-fx-accent-blue hover:underline">
            compare plans
          </Link>
          , or ask on{' '}
          <a
            href="https://x.com/FlashFXeditor"
            target="_blank"
            rel="noopener noreferrer"
            className="text-fx-accent-blue hover:underline"
          >
            X
          </a>
          .
        </p>
      </div>
    </section>
  );
}
