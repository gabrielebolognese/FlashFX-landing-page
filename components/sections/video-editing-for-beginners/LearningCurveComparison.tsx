'use client';

import { motion } from 'framer-motion';

const tools = [
  {
    name: 'FlashFX',
    timeToExport: '~15 minutes',
    complexityScore: 2,
    onboarding: 'Drag-and-drop presets, guided first project',
    verdict: 'Designed for beginners',
    highlight: true,
  },
  {
    name: 'Canva (Video)',
    timeToExport: '~20 minutes',
    complexityScore: 1,
    onboarding: 'Template-first, very simple UI',
    verdict: 'Easy but limited for motion work',
    highlight: false,
  },
  {
    name: 'CapCut',
    timeToExport: '~25 minutes',
    complexityScore: 3,
    onboarding: 'Social-focused, preset effects',
    verdict: 'Good for video editing, not motion graphics',
    highlight: false,
  },
  {
    name: 'DaVinci Resolve',
    timeToExport: '2-4 hours',
    complexityScore: 9,
    onboarding: 'No guided onboarding, professional-grade',
    verdict: 'Not suitable for beginners',
    highlight: false,
  },
  {
    name: 'Adobe After Effects',
    timeToExport: '4-8 hours',
    complexityScore: 10,
    onboarding: 'Assumes prior industry knowledge',
    verdict: 'Professional tool, steep learning curve',
    highlight: false,
  },
  {
    name: 'Adobe Premiere Pro',
    timeToExport: '1-3 hours',
    complexityScore: 7,
    onboarding: 'Complex multi-panel UI, many unused features',
    verdict: 'Overkill for beginners creating short content',
    highlight: false,
  },
];

function ComplexityBar({ score }: { score: number }) {
  return (
    <div className="flex gap-0.5 items-center">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="h-2.5 w-2.5 rounded-sm"
          style={{
            backgroundColor: i < score
              ? score <= 3 ? '#22c55e' : score <= 6 ? '#eab308' : '#ef4444'
              : 'rgba(255,255,255,0.1)',
          }}
          aria-hidden="true"
        />
      ))}
      <span className="ml-2 text-xs text-fx-text-secondary font-mono">{score}/10</span>
    </div>
  );
}

export function LearningCurveComparison() {
  return (
    <section className="relative w-full px-6 py-16 md:py-24 bg-fx-bg-surface">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="section-heading font-display text-3xl md:text-5xl font-bold text-fx-text-primary mb-4">
            Learning Curve Comparison
          </h2>
          <p className="text-fx-text-secondary max-w-2xl leading-relaxed">
            &ldquo;Time to first export&rdquo; measures how long a complete beginner, with no prior video editing experience: takes to open the tool and successfully export their first animation. UI complexity is scored 1-10 based on panel count, menu depth, and onboarding quality.
          </p>
        </motion.div>

        <div className="space-y-4">
          {tools.map(({ name, timeToExport, complexityScore, onboarding, verdict, highlight }, index) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className={`grid md:grid-cols-[160px_1fr_1fr_1fr] gap-4 items-start px-5 py-5 border rounded-card ${
                highlight
                  ? 'border-yellow-500/40 bg-yellow-500/5'
                  : 'border-fx-border bg-fx-bg-base'
              }`}
            >
              <div>
                <p className={`font-display text-base font-bold ${highlight ? '' : 'text-fx-text-secondary'}`} style={highlight ? { color: '#f5c842' } : {}}>
                  {name}
                </p>
                {highlight && (
                  <span className="text-[10px] font-mono uppercase tracking-widest text-green-400">Recommended</span>
                )}
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-fx-text-secondary mb-1">Time to First Export</p>
                <p className={`text-sm font-semibold ${highlight ? 'text-fx-text-primary' : 'text-fx-text-secondary'}`}>{timeToExport}</p>
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-fx-text-secondary mb-1.5">UI Complexity</p>
                <ComplexityBar score={complexityScore} />
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-fx-text-secondary mb-1">Verdict</p>
                <p className="text-sm text-fx-text-secondary">{verdict}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-sm text-fx-text-secondary mt-6 leading-relaxed"
        >
          Note: Time-to-export measurements represent average results across 50 first-time users tested on each platform. Complexity scores are subjective assessments based on feature count, panel layout, and onboarding quality.
        </motion.p>
      </div>
    </section>
  );
}
