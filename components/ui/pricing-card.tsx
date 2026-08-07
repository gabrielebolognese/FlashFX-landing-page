'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';
import { BeamBorder } from '@/components/ui/beam-border';
import { useAmbient } from '@/lib/motion';

/*
 * Restyled 2026-08-07 to match the rest of the site.
 *
 * The cards were `rounded-card` — a 4px radius from the original design
 * tokens — with flat static borders, which left this the last section still
 * looking like the old site. They are now 2xl-radius panels carrying the same
 * beam borders as everything else: `trace` on the two standard tiers, and the
 * one continuously circling `ambient` beam on the popular tier, which is the
 * only card that earns it.
 *
 * Prices animate between billing cycles rather than swapping instantly, and
 * features stagger in on arrival.
 */

type BillingCycle = 'monthly' | 'annually';

interface Feature {
  name: string;
  isIncluded: boolean;
  value?: string;
}

interface FeatureGroup {
  label: string;
  features: Feature[];
}

interface PriceTier {
  id: string;
  name: string;
  description: string;
  priceMonthly: number;
  priceAnnually: number;
  priceSuffix?: string;
  isPopular: boolean;
  buttonLabel: string;
  features: Feature[];
}

interface PricingComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  plans: [PriceTier, PriceTier, PriceTier];
  tablePlans: [PriceTier, PriceTier, PriceTier];
  featureGroups: FeatureGroup[];
  billingCycle: BillingCycle;
  onCycleChange: (cycle: BillingCycle) => void;
  onPlanSelect: (planId: string, cycle: BillingCycle) => void;
}

/**
 * The card shell.
 *
 * `group` is required by `trace` beams, and `relative` by all of them. The
 * popular tier gets the continuously circling `ambient` beam plus a glow that
 * breathes — both governed, so neither runs while the section is off screen.
 */
function PlanCard({ plan, children }: { plan: PriceTier; children: React.ReactNode }) {
  const { ref, active } = useAmbient<HTMLDivElement>({ priority: 1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'group relative flex flex-col rounded-2xl border transition-transform duration-300',
        plan.isPopular ? 'md:scale-[1.04] shadow-2xl' : 'hover:-translate-y-1'
      )}
      style={{
        backgroundColor: plan.isPopular ? '#1c2e63' : '#1c2952',
        borderColor: plan.isPopular ? 'rgba(245,197,24,0.45)' : '#243060',
      }}
    >
      {plan.isPopular ? (
        <>
          {/* The one card on the page that keeps a light running round it. */}
          <BeamBorder variant="ambient" priority={1} />
          <motion.span
            aria-hidden="true"
            className="absolute -inset-4 rounded-[28px] pointer-events-none -z-10"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(245,197,24,0.20) 0%, rgba(245,197,24,0.05) 45%, transparent 72%)',
            }}
            animate={active ? { opacity: [0.55, 1, 0.55], scale: [0.98, 1.02, 0.98] } : { opacity: 0.8, scale: 1 }}
            transition={
              active ? { duration: 5.5, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' } : { duration: 0 }
            }
          />
        </>
      ) : (
        <BeamBorder />
      )}
      {children}
    </motion.div>
  );
}

const FeatureItem: React.FC<{ feature: Feature; index: number }> = ({ feature, index }) => {
  const Icon = feature.isIncluded ? Check : X;
  return (
    <motion.li
      className="flex items-start space-x-3 py-1.5"
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: 0.15 + index * 0.035 }}
    >
      <Icon
        className={cn('h-4 w-4 flex-shrink-0 mt-0.5', feature.isIncluded ? 'text-fx-accent-yellow' : 'text-fx-text-secondary opacity-40')}
        aria-hidden="true"
      />
      <span className={cn('text-sm', feature.isIncluded ? 'text-fx-text-primary' : 'text-fx-text-secondary opacity-50')}>
        {feature.value ? <><span className="font-semibold text-fx-accent-yellow">{feature.value}</span> {feature.name}</> : feature.name}
      </span>
    </motion.li>
  );
};

function CellValue({ feature, isPopular }: { feature: Feature | undefined; isPopular: boolean }) {
  if (!feature) {
    return <X className="h-4 w-4 mx-auto" style={{ color: 'rgba(139, 148, 158, 0.35)' }} aria-hidden="true" />;
  }
  if (feature.value) {
    return (
      <span
        className="text-sm font-medium"
        style={{ color: isPopular ? '#F5C518' : '#E6EDF3' }}
      >
        {feature.value}
      </span>
    );
  }
  if (feature.isIncluded) {
    return <Check className="h-4 w-4 mx-auto" style={{ color: '#F5C518' }} aria-hidden="true" />;
  }
  return <X className="h-4 w-4 mx-auto" style={{ color: 'rgba(139, 148, 158, 0.35)' }} aria-hidden="true" />;
}

const PricingComponent: React.FC<PricingComponentProps> = ({
  plans,
  tablePlans,
  featureGroups,
  billingCycle,
  onCycleChange,
  onPlanSelect,
  className,
  ...props
}) => {
  const annualDiscountPercent = 20;

  return (
    <div className={cn('w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8', className)} {...props}>
      <div className="flex justify-center mb-12 mt-2">
        <div
          className="relative flex border border-fx-border rounded-full p-1 gap-1"
          style={{ backgroundColor: 'rgba(28, 41, 82, 0.8)' }}
        >
          {(['monthly', 'annually'] as BillingCycle[]).map((option) => (
            <button
              key={option}
              onClick={() => onCycleChange(option)}
              className="relative px-6 py-2 text-sm font-medium rounded-full transition-colors duration-200 z-10"
              style={{ color: billingCycle === option ? '#141f40' : '#8B949E' }}
              aria-label={option === 'monthly' ? 'Monthly Billing' : 'Annual Billing'}
            >
              {/* One shared element that slides between the two, rather than two
                  backgrounds cross-fading — the movement is the affordance. */}
              {billingCycle === option && (
                <motion.span
                  layoutId="fx-cycle-pill"
                  className="absolute inset-0 rounded-full -z-10"
                  style={{ backgroundColor: '#F5C518' }}
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              {option === 'monthly' ? 'Monthly' : 'Annually'}
              {option === 'annually' && (
                <span
                  className="absolute -top-3.5 right-0 text-xs font-semibold px-1.5 rounded-full whitespace-nowrap"
                  style={{ color: '#F5C518', backgroundColor: 'rgba(245, 197, 24, 0.15)' }}
                >
                  Save {annualDiscountPercent}%
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const currentPrice = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceAnnually;
          const isFree = currentPrice === 0;

          return (
            <PlanCard key={plan.id} plan={plan}>
              <div className="p-6 pb-4">
                <div className="flex justify-between items-start mb-1">
                  <h3
                    className="text-2xl font-bold text-fx-text-primary"
                    style={{ fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '-0.02em' }}
                  >
                    {plan.name}
                  </h3>
                  {plan.isPopular && (
                    <span
                      className="text-xs font-semibold px-3 py-1 rounded-full"
                      style={{ backgroundColor: '#F5C518', color: '#141f40' }}
                    >
                      Most Popular
                    </span>
                  )}
                </div>
                <p className="text-sm text-fx-text-secondary mb-4">{plan.description}</p>
                <div>
                  {isFree ? (
                    <p
                      className="text-5xl font-extrabold text-fx-text-primary"
                      style={{ fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '-0.03em' }}
                    >
                      Free
                    </p>
                  ) : (
                    /*
                     * Keyed on the cycle so the figure slides out and the new
                     * one slides in. Swapping the text in place makes the
                     * toggle feel like it did nothing.
                     */
                    <motion.p
                      key={billingCycle}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                      className="text-5xl font-extrabold text-fx-text-primary"
                      style={{ fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '-0.03em' }}
                    >
                      ${billingCycle === 'monthly' ? plan.priceMonthly : Math.round(plan.priceAnnually / 12)}
                      <span className="text-base font-normal text-fx-text-secondary ml-1">/mo</span>
                    </motion.p>
                  )}
                  {billingCycle === 'annually' && !isFree && (
                    <p className="text-xs text-fx-text-secondary mt-1 opacity-60">
                      Billed ${plan.priceAnnually}/yr · saves ${plan.priceMonthly * 12 - plan.priceAnnually}/yr
                    </p>
                  )}
                  {plan.priceSuffix && (
                    <p className="text-xs text-fx-text-secondary mt-1 opacity-70">{plan.priceSuffix}</p>
                  )}
                </div>
              </div>

              <div className="flex-grow px-6 pb-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-fx-text-secondary mb-2">Includes</p>
                <ul className="list-none">
                  {plan.features.map((feature, i) => (
                    <FeatureItem key={feature.name} feature={feature} index={i} />
                  ))}
                </ul>
              </div>

              <div className="p-6 pt-2">
                <button
                  onClick={() => onPlanSelect(plan.id, billingCycle)}
                  className={cn(
                    'w-full py-3.5 px-6 rounded-full text-sm font-semibold transition-all duration-200',
                    plan.isPopular
                      ? 'text-fx-bg-base hover:brightness-110 shadow-[0_10px_30px_-8px_rgba(245,197,24,0.55)]'
                      : 'border border-fx-border text-fx-text-primary hover:border-fx-accent-yellow hover:text-fx-accent-yellow hover:bg-fx-accent-yellow/[0.06]'
                  )}
                  style={plan.isPopular ? { backgroundColor: '#F5C518' } : { backgroundColor: 'transparent' }}
                  aria-label={`Select ${plan.name} plan`}
                >
                  {plan.buttonLabel}
                </button>
              </div>
            </PlanCard>
          );
        })}
      </div>

      <div className="mt-20 hidden md:block border border-fx-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr style={{ backgroundColor: '#1c2952' }}>
              <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-fx-text-secondary w-[260px]">
                Feature
              </th>
              {tablePlans.map((plan) => (
                <th
                  key={`th-${plan.id}`}
                  scope="col"
                  className="px-6 py-4 text-center text-sm font-semibold whitespace-nowrap"
                  style={{
                    color: plan.isPopular ? '#F5C518' : '#E6EDF3',
                    backgroundColor: plan.isPopular ? 'rgba(245, 197, 24, 0.06)' : undefined,
                  }}
                >
                  {plan.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {featureGroups.map((group) => (
              <React.Fragment key={group.label}>
                <tr style={{ backgroundColor: 'rgba(245, 197, 24, 0.04)' }}>
                  <td
                    colSpan={4}
                    className="px-6 py-2 text-xs font-semibold uppercase tracking-widest"
                    style={{ color: '#F5C518', borderTop: '1px solid rgba(245,197,24,0.15)', borderBottom: '1px solid rgba(245,197,24,0.1)' }}
                  >
                    {group.label}
                  </td>
                </tr>
                {group.features.map((feature, index) => (
                  <tr
                    key={feature.name}
                    style={{
                      backgroundColor: index % 2 === 0 ? '#141f40' : 'rgba(28, 41, 82, 0.4)',
                    }}
                  >
                    <td className="px-6 py-3 text-left text-sm text-fx-text-secondary">
                      {feature.name}
                    </td>
                    {tablePlans.map((plan) => {
                      const planFeature = plan.features.find((f) => f.name === feature.name);
                      return (
                        <td
                          key={`${plan.id}-${feature.name}`}
                          className="px-6 py-3 text-center"
                          style={plan.isPopular ? { backgroundColor: 'rgba(245, 197, 24, 0.04)' } : undefined}
                        >
                          <CellValue feature={planFeature} isPopular={plan.isPopular} />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};

export type { BillingCycle, PriceTier, Feature, FeatureGroup };
export { PricingComponent };
