'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PricingComponent, BillingCycle, PriceTier, FeatureGroup, Feature } from '@/components/ui/pricing-card';

/*
 * Three tiers: Free, Pro, Ultra. Restructured 2026-08-10 on the owner's
 * instruction: the old $29 Ultra became Pro and the old $39/seat Teams became
 * Ultra at $89, so the paid ladder is two tiers rather than a mid tier plus a
 * seat-priced one.
 *
 * -- Which numbers were given, and which were derived ------------------------
 *
 * Given: the two names, $29 for Pro, $89 for Ultra, and "Ultra is 3.5x Pro".
 *
 * Derived from that, and worth knowing before changing any of them:
 *
 *   - $854/yr for Ultra, from the same ~20% annual discount Pro already carried
 *     (278 / 348) applied to 89 x 12.
 *   - 70 GB of storage and 1,750 AI credits, exactly 3.5x Pro's 20 GB and 500.
 *   - 1 year of version history. 3.5x of 90 days is 315, which is not a number
 *     any product prints, so it rounds up to the nearest natural unit.
 *
 * Long-form agents are the one new capability and the wording is the owner's:
 * multiple parallel scenes, Ultra only. Nothing else here was invented. Every
 * other Ultra row is either a 3.5x scaling or something Teams already had.
 *
 * -- This data is mirrored ---------------------------------------------------
 *
 * `app/pricing/page.tsx` restates the prices in its metadata and in an Offer
 * graph, and `faqData.ts` states them in prose. Neither is derived from here and
 * both are read by crawlers, so a price changed in this file alone is a price
 * that is wrong in the index and right on the page.
 */

const freeFeatureGroups: FeatureGroup[] = [
  {
    label: 'General',
    features: [
      { name: 'Projects', isIncluded: true, value: 'Unlimited' },
      { name: 'Cloud storage', isIncluded: true, value: '500 MB' },
      { name: 'Export formats (MP4 / GIF / WebM / SVG)', isIncluded: true },
      { name: 'Priority support', isIncluded: false },
    ],
  },
  {
    label: 'Main Editor',
    features: [
      { name: 'Shape & vector tools', isIncluded: true },
      { name: 'Text & typography', isIncluded: true },
      { name: 'Image import & editing', isIncluded: true },
      { name: 'Animation timeline', isIncluded: true },
      { name: 'Keyframe system & easing curves', isIncluded: true },
      { name: 'Groups / layers & masking', isIncluded: true },
      { name: 'Blend modes & opacity', isIncluded: true },
      { name: 'Custom fonts', isIncluded: true },
    ],
  },
  {
    label: '3D Features',
    features: [
      { name: '3D primitives', isIncluded: true, value: '2 shapes' },
      { name: 'Advanced materials (PBR / toon / wireframe)', isIncluded: false },
      { name: '3D model import (GLB / OBJ / FBX / STL)', isIncluded: false },
      { name: 'Texture maps (diffuse / normal / roughness)', isIncluded: false },
      { name: 'HDRI lighting & environment', isIncluded: false },
      { name: '3D animation in timeline', isIncluded: false },
    ],
  },
  {
    label: 'AI Features',
    features: [
      { name: 'AI credits', isIncluded: false },
      { name: 'AI motion graphics', isIncluded: false },
      { name: 'AI assistant', isIncluded: false },
      { name: 'AI image search', isIncluded: false },
      { name: 'AI image generation', isIncluded: false },
      { name: 'AI background remover', isIncluded: false },
      { name: 'AI sound generator', isIncluded: false },
      { name: 'Long-form agents (multiple parallel scenes)', isIncluded: false },
    ],
  },
  {
    label: 'Collaboration',
    features: [
      { name: 'Team workspace', isIncluded: false },
      { name: 'Real-time collaboration', isIncluded: false },
      { name: 'Shared asset library', isIncluded: false },
      { name: 'Role management (Admin / Editor / Viewer)', isIncluded: false },
      { name: 'Version history', isIncluded: true, value: '30 days' },
      { name: 'Comments & annotations', isIncluded: false },
      { name: 'Brand kit', isIncluded: false },
      { name: 'Team templates', isIncluded: false },
      { name: 'Guest access', isIncluded: false },
      { name: 'Admin dashboard', isIncluded: false },
    ],
  },
];

const proFeatureGroups: FeatureGroup[] = [
  {
    label: 'General',
    features: [
      { name: 'Projects', isIncluded: true, value: 'Unlimited' },
      { name: 'Cloud storage', isIncluded: true, value: '20 GB' },
      { name: 'Export formats (MP4 / GIF / WebM / SVG)', isIncluded: true },
      { name: 'Priority support', isIncluded: true },
    ],
  },
  {
    label: 'Main Editor',
    features: [
      { name: 'Shape & vector tools', isIncluded: true },
      { name: 'Text & typography', isIncluded: true },
      { name: 'Image import & editing', isIncluded: true },
      { name: 'Animation timeline', isIncluded: true },
      { name: 'Keyframe system & easing curves', isIncluded: true },
      { name: 'Groups / layers & masking', isIncluded: true },
      { name: 'Blend modes & opacity', isIncluded: true },
      { name: 'Custom fonts', isIncluded: true },
    ],
  },
  {
    label: '3D Features',
    features: [
      { name: '3D primitives', isIncluded: true, value: 'All shapes' },
      { name: 'Advanced materials (PBR / toon / wireframe)', isIncluded: true },
      { name: '3D model import (GLB / OBJ / FBX / STL)', isIncluded: true },
      { name: 'Texture maps (diffuse / normal / roughness)', isIncluded: true },
      { name: 'HDRI lighting & environment', isIncluded: true },
      { name: '3D animation in timeline', isIncluded: true },
    ],
  },
  {
    label: 'AI Features',
    features: [
      { name: 'AI credits', isIncluded: true, value: '500 / month' },
      { name: 'AI motion graphics', isIncluded: true },
      { name: 'AI assistant', isIncluded: true },
      { name: 'AI image search', isIncluded: true },
      { name: 'AI image generation', isIncluded: true },
      { name: 'AI background remover', isIncluded: true },
      { name: 'AI sound generator', isIncluded: true },
      { name: 'Long-form agents (multiple parallel scenes)', isIncluded: false },
    ],
  },
  {
    label: 'Collaboration',
    features: [
      { name: 'Team workspace', isIncluded: false },
      { name: 'Real-time collaboration', isIncluded: false },
      { name: 'Shared asset library', isIncluded: false },
      { name: 'Role management (Admin / Editor / Viewer)', isIncluded: false },
      { name: 'Version history', isIncluded: true, value: '90 days' },
      { name: 'Comments & annotations', isIncluded: false },
      { name: 'Brand kit', isIncluded: true },
      { name: 'Team templates', isIncluded: false },
      { name: 'Guest access', isIncluded: false },
      { name: 'Admin dashboard', isIncluded: true },
    ],
  },
];

const ultraFeatureGroups: FeatureGroup[] = [
  {
    label: 'General',
    features: [
      { name: 'Projects', isIncluded: true, value: 'Unlimited' },
      { name: 'Cloud storage', isIncluded: true, value: '70 GB' },
      { name: 'Export formats (MP4 / GIF / WebM / SVG)', isIncluded: true },
      { name: 'Priority support', isIncluded: true },
    ],
  },
  {
    label: 'Main Editor',
    features: [
      { name: 'Shape & vector tools', isIncluded: true },
      { name: 'Text & typography', isIncluded: true },
      { name: 'Image import & editing', isIncluded: true },
      { name: 'Animation timeline', isIncluded: true },
      { name: 'Keyframe system & easing curves', isIncluded: true },
      { name: 'Groups / layers & masking', isIncluded: true },
      { name: 'Blend modes & opacity', isIncluded: true },
      { name: 'Custom fonts', isIncluded: true },
    ],
  },
  {
    label: '3D Features',
    features: [
      { name: '3D primitives', isIncluded: true, value: 'All shapes' },
      { name: 'Advanced materials (PBR / toon / wireframe)', isIncluded: true },
      { name: '3D model import (GLB / OBJ / FBX / STL)', isIncluded: true },
      { name: 'Texture maps (diffuse / normal / roughness)', isIncluded: true },
      { name: 'HDRI lighting & environment', isIncluded: true },
      { name: '3D animation in timeline', isIncluded: true },
    ],
  },
  {
    label: 'AI Features',
    features: [
      { name: 'AI credits', isIncluded: true, value: '1,750 / month' },
      { name: 'AI motion graphics', isIncluded: true },
      { name: 'AI assistant', isIncluded: true },
      { name: 'AI image search', isIncluded: true },
      { name: 'AI image generation', isIncluded: true },
      { name: 'AI background remover', isIncluded: true },
      { name: 'AI sound generator', isIncluded: true },
      { name: 'Long-form agents (multiple parallel scenes)', isIncluded: true },
    ],
  },
  {
    label: 'Collaboration',
    features: [
      { name: 'Team workspace', isIncluded: true },
      { name: 'Real-time collaboration', isIncluded: true },
      { name: 'Shared asset library', isIncluded: true },
      { name: 'Role management (Admin / Editor / Viewer)', isIncluded: true },
      { name: 'Version history', isIncluded: true, value: '1 year' },
      { name: 'Comments & annotations', isIncluded: true },
      { name: 'Brand kit', isIncluded: true },
      { name: 'Team templates', isIncluded: true },
      { name: 'Guest access', isIncluded: true },
      { name: 'Admin dashboard', isIncluded: true },
    ],
  },
];

function flattenFeatures(groups: FeatureGroup[]): Feature[] {
  return groups.flatMap((g) => g.features);
}

const cardPlans: [PriceTier, PriceTier, PriceTier] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Everything you need to start creating motion graphics.',
    priceMonthly: 0,
    priceAnnually: 0,
    isPopular: false,
    buttonLabel: 'Get Started Free',
    features: [
      { name: 'Projects', isIncluded: true, value: 'Unlimited' },
      { name: 'Cloud storage', isIncluded: true, value: '500 MB' },
      { name: 'Export formats (MP4 / GIF / WebM / SVG)', isIncluded: true },
      { name: 'Full editor: shapes, text, images, timeline', isIncluded: true },
      { name: 'Keyframe system & easing curves', isIncluded: true },
      { name: 'Custom fonts', isIncluded: true },
      { name: '3D primitives', isIncluded: true, value: '2 shapes' },
      { name: 'Version history', isIncluded: true, value: '30 days' },
      { name: 'AI features', isIncluded: false },
      { name: 'Advanced 3D & materials', isIncluded: false },
      { name: 'Collaboration', isIncluded: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Unlock AI, full 3D, and priority support for serious creators.',
    priceMonthly: 29,
    priceAnnually: 278,
    // The middle tier stays the highlighted one. It is the volume plan, and a
    // badge on the most expensive column reads as a sales tactic rather than as
    // a recommendation.
    isPopular: true,
    buttonLabel: 'Start Pro Trial',
    features: [
      { name: 'Everything in Free', isIncluded: true },
      { name: 'Cloud storage', isIncluded: true, value: '20 GB' },
      { name: 'Priority support', isIncluded: true },
      { name: 'Full 3D: all primitives, materials, lighting', isIncluded: true },
      { name: '3D model import (GLB / OBJ / FBX / STL)', isIncluded: true },
      { name: 'AI credits', isIncluded: true, value: '500 / month' },
      { name: 'AI motion graphics, assistant & image tools', isIncluded: true },
      { name: 'AI background remover & sound generator', isIncluded: true },
      { name: 'Brand kit & admin dashboard', isIncluded: true },
      { name: 'Version history', isIncluded: true, value: '90 days' },
      { name: 'Long-form agents', isIncluded: false },
    ],
  },
  {
    id: 'ultra',
    name: 'Ultra',
    description: 'Long-form agents, parallel scenes, and 3.5x of everything in Pro.',
    priceMonthly: 89,
    priceAnnually: 854,
    isPopular: false,
    buttonLabel: 'Start Ultra Trial',
    features: [
      { name: 'Everything in Pro', isIncluded: true },
      { name: 'Long-form agents (multiple parallel scenes)', isIncluded: true },
      { name: 'AI credits', isIncluded: true, value: '1,750 / month' },
      { name: 'Cloud storage', isIncluded: true, value: '70 GB' },
      { name: 'Team workspace & real-time collaboration', isIncluded: true },
      { name: 'Shared asset library', isIncluded: true },
      { name: 'Role management (Admin / Editor / Viewer)', isIncluded: true },
      { name: 'Comments & annotations', isIncluded: true },
      { name: 'Team templates & guest access', isIncluded: true },
      { name: 'Version history', isIncluded: true, value: '1 year' },
    ],
  },
];

function buildTablePlans(): [PriceTier, PriceTier, PriceTier] {
  return [
    { ...cardPlans[0], features: flattenFeatures(freeFeatureGroups) },
    { ...cardPlans[1], features: flattenFeatures(proFeatureGroups) },
    { ...cardPlans[2], features: flattenFeatures(ultraFeatureGroups) },
  ];
}

const tableGroups: FeatureGroup[] = freeFeatureGroups.map((group) => ({
  label: group.label,
  features: group.features.map((f) => f),
}));

export function PricingSection() {
  const [cycle, setCycle] = useState<BillingCycle>('annually');
  const tablePlans = buildTablePlans();

  return (
    /*
      No background of its own (2026-08-07). This painted a solid #141f40, a 40px
      rule grid over it, and a top-and-bottom gradient back to the same colour —
      the last of the old grid backgrounds on the site, and three full-section
      layers to composite.

      All three are gone, so the field of light from `SiteBackdrop` runs through
      here like the rest of the page. Safe to remove because nothing in this
      section depends on the ground for contrast: the plan cards carry their own
      solid fills (#1c2952, #1c2e63 for the popular tier) and their own borders.
    */
    <section id="pricing" className="relative w-full py-20 overflow-hidden">
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 px-4"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-fx-accent-yellow mb-3">Pricing</p>
          <h2
            className="section-heading font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white text-center mb-4"
            style={{ fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '-0.03em' }}
          >
            <span style={{ color: '#f5c842' }}>Simple</span>
            <span className="text-white">, honest pricing.</span>
          </h2>
          <p className="text-fx-text-secondary max-w-xl mx-auto text-base">
            Client side features are free, server side features are paid because they have to be paid on our side.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <PricingComponent
            plans={cardPlans}
            tablePlans={tablePlans}
            featureGroups={tableGroups}
            billingCycle={cycle}
            onCycleChange={setCycle}
            /*
             * All three tiers open the editor. They previously only
             * `console.log`ed, so every button in the pricing section was dead:
             * three calls to action on the page most likely to convert, none of
             * which went anywhere.
             *
             * There is no checkout on this site — every CTA points at
             * editor.flashfx.app — so that is where these go too until there is
             * something else to point them at.
             */
            onPlanSelect={() => {
              window.open('https://editor.flashfx.app', '_blank', 'noopener,noreferrer');
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
