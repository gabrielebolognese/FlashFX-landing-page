'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { ytFaqData } from './ytFaqData';

export function YTFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="relative w-full px-6 py-16 md:py-24 bg-fx-bg-surface">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-heading font-display text-3xl md:text-5xl font-bold text-fx-text-primary mb-12"
        >
          Frequently Asked Questions
        </motion.h2>
        <div className="space-y-4">
          {ytFaqData.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.07 }}
              className="border border-fx-border rounded-card bg-fx-bg-base overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-fx-bg-raised transition-colors"
                aria-expanded={openIndex === index}
                aria-controls={`yt-faq-answer-${index}`}
              >
                <span className="font-sans text-lg font-bold text-fx-text-primary pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-fx-text-secondary flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
              {openIndex === index && (
                <div id={`yt-faq-answer-${index}`} className="px-6 pb-4">
                  <p className="text-fx-text-secondary leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-fx-text-secondary leading-relaxed mt-8 text-center"
        >
          Need more detail?{' '}
          <Link href="/features" className="text-fx-accent-blue hover:underline">
            Explore all features
          </Link>{' '}
          or{' '}
          <Link href="/pricing" className="text-fx-accent-blue hover:underline">
            compare pricing tiers
          </Link>
          .
        </motion.p>
      </div>
    </section>
  );
}
