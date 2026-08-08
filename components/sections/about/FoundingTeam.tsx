'use client';

import { motion } from 'framer-motion';

/*
 * The founder attribution below is the reason this page exists: it is the
 * reciprocal half of the identity claim that gabrielebolognese.blog already
 * makes, and it is what lets Google join the two entity graphs.
 *
 * Deliberate: the block containing the rel="me" link animates on `y` only,
 * never on `opacity`. A framer-motion `initial={{ opacity: 0 }}` renders as
 * inline `opacity:0` in the server HTML and only clears on hydration — fine
 * for decoration, not for the single most important link on the domain.
 * Keep it visible without JavaScript.
 */

export function FoundingTeam() {
  return (
    <section id="team" className="relative w-full px-6 py-16 md:py-24 bg-fx-bg-surface">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-heading font-display text-3xl md:text-5xl font-bold text-fx-text-primary mb-8 md:mb-12"
        >
          Who Builds FlashFX
        </motion.h2>

        <motion.div
          initial={{ y: 16 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-6 text-lg text-fx-text-secondary leading-relaxed"
        >
          <p>
            FlashFX was founded by{' '}
            <strong className="text-fx-text-primary font-medium">Gabriele Bolognese</strong>, who
            is its founder and CEO. He started the project on 1 January 2024, at fifteen, and
            works on it from Rovigo, in the Veneto region of Italy. He writes about his work at{' '}
            <a
              href="https://gabrielebolognese.blog"
              target="_blank"
              rel="me noopener noreferrer"
              className="text-fx-accent-yellow hover:underline"
            >
              gabrielebolognese.blog
            </a>
            .
          </p>
          <p>
            <strong className="text-fx-text-primary font-medium">Aziz</strong> joined as
            co-founder in January 2026.{' '}
            <strong className="text-fx-text-primary font-medium">Camille Luciano</strong> is
            marketing manager. That is the whole team: FlashFX is built and run by three
            people.
          </p>

          {/*
            HOW IT STARTED — intentionally left out.
            The founding date, the founder, and the team are all documented facts.
            The origin narrative (what prompted the project, what came before it, why
            After Effects specifically) has not been supplied, and inventing it would
            put fiction on the one page whose entire job is to be verifiable.
            Drop the real story in here as a paragraph when it is available.
          */}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {[
            { name: 'Gabriele Bolognese', role: 'Founder & CEO', since: 'Since January 2024' },
            { name: 'Aziz', role: 'Co-founder', since: 'Since January 2026' },
            { name: 'Camille Luciano', role: 'Marketing Manager', since: null },
          ].map((person) => (
            <div
              key={person.name}
              className="bg-fx-bg-base border border-fx-border border-t-[rgba(230,237,243,0.12)] rounded-card p-5"
            >
              <p className="text-fx-text-primary font-medium mb-1">{person.name}</p>
              <p className="mono-accent text-sm mb-2">{person.role}</p>
              {person.since && (
                <p className="text-fx-text-secondary text-sm">{person.since}</p>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
