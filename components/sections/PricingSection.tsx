'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PricingComponent, BillingCycle, PriceTier, FeatureGroup, Feature } from '@/components/ui/pricing-card';

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
    ],
  },
  {
    label: 'Teams & Collaboration',
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

const ultraFeatureGroups: FeatureGroup[] = [
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
    ],
  },
  {
    label: 'Teams & Collaboration',
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

const teamsFeatureGroups: FeatureGroup[] = [
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
      { name: 'AI credits', isIncluded: true, value: '2000 / month' },
      { name: 'AI motion graphics', isIncluded: true },
      { name: 'AI assistant', isIncluded: true },
      { name: 'AI image search', isIncluded: true },
      { name: 'AI image generation', isIncluded: true },
      { name: 'AI background remover', isIncluded: true },
      { name: 'AI sound generator', isIncluded: true },
    ],
  },
  {
    label: 'Teams & Collaboration',
    features: [
      { name: 'Team workspace', isIncluded: true },
      { name: 'Real-time collaboration', isIncluded: true },
      { name: 'Shared asset library', isIncluded: true },
      { name: 'Role management (Admin / Editor / Viewer)', isIncluded: true },
      { name: 'Version history', isIncluded: true, value: '90 days' },
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
      { name: 'Full editor — shapes, text, images, timeline', isIncluded: true },
      { name: 'Keyframe system & easing curves', isIncluded: true },
      { name: 'Custom fonts', isIncluded: true },
      { name: '3D primitives', isIncluded: true, value: '2 shapes' },
      { name: 'Version history', isIncluded: true, value: '30 days' },
      { name: 'AI features', isIncluded: false },
      { name: 'Advanced 3D & materials', isIncluded: false },
      { name: 'Team collaboration', isIncluded: false },
    ],
  },
  {
    id: 'ultra',
    name: 'Ultra',
    description: 'Unlock AI, full 3D, and priority support for serious creators.',
    priceMonthly: 29,
    priceAnnually: 278,
    isPopular: true,
    buttonLabel: 'Start Ultra Trial',
    features: [
      { name: 'Everything in Free', isIncluded: true },
      { name: 'Cloud storage', isIncluded: true, value: '20 GB' },
      { name: 'Priority support', isIncluded: true },
      { name: 'Full 3D — all primitives, materials, lighting', isIncluded: true },
      { name: '3D model import (GLB / OBJ / FBX / STL)', isIncluded: true },
      { name: 'AI credits', isIncluded: true, value: '500 / month' },
      { name: 'AI motion graphics, assistant & image tools', isIncluded: true },
      { name: 'AI background remover & sound generator', isIncluded: true },
      { name: 'Brand kit & admin dashboard', isIncluded: true },
      { name: 'Version history', isIncluded: true, value: '90 days' },
    ],
  },
  {
    id: 'teams',
    name: 'Teams',
    description: 'Built for agencies and creative teams that move fast.',
    priceMonthly: 39,
    priceAnnually: 374,
    priceSuffix: 'per seat',
    isPopular: false,
    buttonLabel: 'Start Teams Trial',
    features: [
      { name: 'Everything in Ultra', isIncluded: true },
      { name: 'AI credits', isIncluded: true, value: '2000 / month' },
      { name: 'Team workspace & real-time collaboration', isIncluded: true },
      { name: 'Shared asset library', isIncluded: true },
      { name: 'Role management (Admin / Editor / Viewer)', isIncluded: true },
      { name: 'Comments & annotations', isIncluded: true },
      { name: 'Team templates & guest access', isIncluded: true },
      { name: 'Version history', isIncluded: true, value: '90 days' },
    ],
  },
];

function buildTablePlans(): [PriceTier, PriceTier, PriceTier] {
  return [
    { ...cardPlans[0], features: flattenFeatures(freeFeatureGroups) },
    { ...cardPlans[1], features: flattenFeatures(ultraFeatureGroups) },
    { ...cardPlans[2], features: flattenFeatures(teamsFeatureGroups) },
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
    <section id="pricing" className="relative w-full py-20 overflow-hidden" style={{ backgroundColor: '#141f40' }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-fx-bg-base via-transparent to-fx-bg-base" />

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
            style={{ fontFamily: 'Georgia, serif', letterSpacing: '-0.03em' }}
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
            onPlanSelect={(planId, currentCycle) => {
              console.log(`Selected: ${planId} / ${currentCycle}`);
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
