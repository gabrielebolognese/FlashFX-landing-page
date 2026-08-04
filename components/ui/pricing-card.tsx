'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Check, X, Minus } from 'lucide-react';

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

const FeatureItem: React.FC<{ feature: Feature }> = ({ feature }) => {
  const Icon = feature.isIncluded ? Check : X;
  return (
    <li className="flex items-start space-x-3 py-1.5">
      <Icon
        className={cn('h-4 w-4 flex-shrink-0 mt-0.5', feature.isIncluded ? 'text-fx-accent-yellow' : 'text-fx-text-secondary opacity-40')}
        aria-hidden="true"
      />
      <span className={cn('text-sm', feature.isIncluded ? 'text-fx-text-primary' : 'text-fx-text-secondary opacity-50')}>
        {feature.value ? <><span className="font-semibold text-fx-accent-yellow">{feature.value}</span> {feature.name}</> : feature.name}
      </span>
    </li>
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
      <div className="flex justify-center mb-10 mt-2">
        <div
          className="flex border border-fx-border rounded-card p-1 gap-1"
          style={{ backgroundColor: 'rgba(28, 41, 82, 0.8)' }}
        >
          {(['monthly', 'annually'] as BillingCycle[]).map((option) => (
            <button
              key={option}
              onClick={() => onCycleChange(option)}
              className="relative px-6 py-1.5 text-sm font-medium rounded-card transition-all duration-200"
              style={{
                backgroundColor: billingCycle === option ? '#F5C518' : 'transparent',
                color: billingCycle === option ? '#141f40' : '#8B949E',
              }}
              aria-label={option === 'monthly' ? 'Monthly Billing' : 'Annual Billing'}
            >
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
            <div
              key={plan.id}
              className={cn(
                'flex flex-col rounded-card border transition-all duration-300',
                plan.isPopular ? 'md:scale-[1.03] shadow-2xl' : 'border-fx-border'
              )}
              style={{
                backgroundColor: plan.isPopular ? '#1c2e63' : '#1c2952',
                borderColor: plan.isPopular ? '#F5C518' : '#243060',
                boxShadow: plan.isPopular ? '0 0 40px rgba(245, 197, 24, 0.12)' : undefined,
              }}
            >
              <div className="p-6 pb-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-xl font-bold text-fx-text-primary">{plan.name}</h3>
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
                    <p className="text-4xl font-extrabold text-fx-text-primary">
                      Free
                    </p>
                  ) : (
                    <p className="text-4xl font-extrabold text-fx-text-primary">
                      ${billingCycle === 'monthly' ? plan.priceMonthly : Math.round(plan.priceAnnually / 12)}
                      <span className="text-base font-normal text-fx-text-secondary ml-1">/mo</span>
                    </p>
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
                  {plan.features.map((feature) => (
                    <FeatureItem key={feature.name} feature={feature} />
                  ))}
                </ul>
              </div>

              <div className="p-6 pt-2">
                <button
                  onClick={() => onPlanSelect(plan.id, billingCycle)}
                  className={cn(
                    'w-full py-3 px-6 rounded-card text-sm font-semibold transition-all duration-200',
                    plan.isPopular
                      ? 'text-fx-bg-base hover:opacity-90'
                      : 'border border-fx-border text-fx-text-primary hover:border-fx-accent-yellow hover:text-fx-accent-yellow'
                  )}
                  style={plan.isPopular ? { backgroundColor: '#F5C518' } : { backgroundColor: 'transparent' }}
                  aria-label={`Select ${plan.name} plan`}
                >
                  {plan.buttonLabel}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-16 hidden md:block border border-fx-border rounded-card overflow-x-auto">
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
  );
};

export type { BillingCycle, PriceTier, Feature, FeatureGroup };
export { PricingComponent };
