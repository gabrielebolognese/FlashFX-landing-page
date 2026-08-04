'use client';

import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

const flashfxReqs = [
  { spec: 'Operating System', value: 'Any — Chrome, Firefox, Safari, Edge' },
  { spec: 'RAM', value: '2 GB minimum / 4 GB recommended' },
  { spec: 'CPU', value: 'Any dual-core processor (2010 or newer)' },
  { spec: 'GPU', value: 'Not required — CPU rendering fallback included' },
  { spec: 'Storage', value: '0 GB — no installation required' },
  { spec: 'Internet', value: 'Required for editor load (offline export available)' },
  { spec: 'Screen resolution', value: '1024 × 768 minimum' },
];

const competitorReqs = [
  {
    tool: 'Adobe After Effects',
    ram: '16 GB (32 GB recommended)',
    storage: '15+ GB installation',
    gpu: 'Dedicated GPU required',
    os: 'Windows 10+ / macOS 13+',
    passes: false,
  },
  {
    tool: 'DaVinci Resolve',
    ram: '8 GB (16 GB recommended)',
    storage: '3–4 GB installation',
    gpu: 'Dedicated GPU strongly recommended',
    os: 'Windows 10+ / macOS 12+',
    passes: false,
  },
  {
    tool: 'Adobe Premiere Pro',
    ram: '16 GB minimum',
    storage: '8+ GB installation',
    gpu: 'Dedicated GPU recommended',
    os: 'Windows 10+ / macOS 13+',
    passes: false,
  },
  {
    tool: 'CapCut Desktop',
    ram: '4 GB minimum',
    storage: '~1 GB installation',
    gpu: 'Not required',
    os: 'Windows 10+ / macOS 10.15+',
    passes: true,
  },
  {
    tool: 'FlashFX',
    ram: '2 GB minimum',
    storage: '0 GB — browser-based',
    gpu: 'Not required',
    os: 'Any modern browser',
    passes: true,
  },
];

export function SystemRequirementsSection() {
  return (
    <section id="system-requirements" className="relative w-full px-6 py-16 md:py-24 bg-fx-bg-surface">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="section-heading font-display text-3xl md:text-5xl font-bold text-fx-text-primary mb-4">
            System Requirements
          </h2>
          <p className="text-fx-text-secondary max-w-2xl leading-relaxed">
            FlashFX is designed to run on hardware that most professional video editors cannot even install on. Here is what you need — and what you do not.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="font-display text-xl font-bold text-fx-text-primary mb-4">FlashFX Requirements</h3>
            <div className="space-y-2">
              {flashfxReqs.map(({ spec, value }) => (
                <div key={spec} className="flex items-start gap-3 px-4 py-3 border border-fx-border rounded-card bg-fx-bg-base">
                  <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-400" aria-hidden="true" />
                  <div>
                    <p className="text-xs font-mono uppercase tracking-wider text-fx-text-secondary">{spec}</p>
                    <p className="text-sm font-medium text-fx-text-primary mt-0.5">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="font-display text-xl font-bold text-fx-text-primary mb-4">What FlashFX Does Not Require</h3>
            <div className="space-y-3">
              {[
                'A dedicated graphics card (GPU)',
                'An Apple Silicon or Intel Core i7 CPU',
                'Windows 10 or macOS 13',
                'A 64-bit operating system',
                'Administrator/install permissions',
                '8 or 16 GB of RAM',
                'A desktop or laptop — tablets work too',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 px-4 py-3 border border-fx-border rounded-card bg-fx-bg-base">
                  <X className="w-4 h-4 flex-shrink-0 text-red-400" aria-hidden="true" />
                  <span className="text-sm text-fx-text-secondary">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="font-display text-xl font-bold text-fx-text-primary mb-5">Requirements Comparison Across Editors</h3>
          <div className="overflow-x-auto">
            <table className="w-full border border-fx-border rounded-card bg-fx-bg-base text-sm">
              <thead>
                <tr className="border-b border-fx-border">
                  {['Software', 'Min. RAM', 'Install Size', 'GPU Needed', 'OS Requirement'].map((h) => (
                    <th key={h} scope="col" className="px-4 py-3 text-left font-mono text-xs text-fx-text-secondary uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {competitorReqs.map((row, i) => (
                  <tr key={row.tool} className={i !== competitorReqs.length - 1 ? 'border-b border-fx-border' : ''}>
                    <td className={`px-4 py-3 font-semibold ${row.tool === 'FlashFX' ? '' : 'text-fx-text-secondary'}`} style={row.tool === 'FlashFX' ? { color: '#f5c842' } : {}}>
                      {row.tool}
                    </td>
                    <td className="px-4 py-3 text-fx-text-secondary">{row.ram}</td>
                    <td className="px-4 py-3 text-fx-text-secondary">{row.storage}</td>
                    <td className="px-4 py-3 text-fx-text-secondary">{row.gpu}</td>
                    <td className="px-4 py-3 text-fx-text-secondary">{row.os}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
