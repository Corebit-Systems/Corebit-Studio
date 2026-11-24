export const pricingPlans = ['starter', 'business', 'enterprise'] as const;
export const paymentOptions = ['full', 'split'] as const;
export const pricingSelectionEvent = 'corebit:pricing-selection';

type PricingSelection = {
  plan: typeof pricingPlans[number];
  payment: typeof paymentOptions[number];
};

export interface PricingInquiry extends PricingSelection {
  title: string;
  paymentLabel: string;
}

export const pricingTierKeys = {
  starter: 'tier1',
  business: 'tier2',
  enterprise: 'tier3',
} as const satisfies Record<PricingSelection['plan'], string>;

export type PricingSearchParams = { plan?: string | string[]; payment?: string | string[] };

export function readPricingSelection(params?: PricingSearchParams): PricingSelection | undefined {
  const plan = pricingPlans.find((value) => value === params?.plan);
  const payment = paymentOptions.find((value) => value === params?.payment);
  return plan && payment ? { plan, payment } : undefined;
}

type PricingLabels = Record<(typeof pricingTierKeys)[PricingSelection['plan']], { title: string }>
  & { toggle_full: string; toggle_split: string };

export function describePricingSelection(selection: PricingSelection, labels: PricingLabels): PricingInquiry {
  return {
    ...selection,
    title: labels[pricingTierKeys[selection.plan]].title,
    paymentLabel: selection.payment === 'full' ? labels.toggle_full : labels.toggle_split,
  };
}
