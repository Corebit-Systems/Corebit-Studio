export const pricingPlans = ['starter', 'business', 'enterprise'] as const;
export const paymentOptions = ['full', 'split'] as const;
export const pricingSelectionEvent = 'corebit:pricing-selection';

export interface PricingInquiry {
  plan: typeof pricingPlans[number];
  payment: typeof paymentOptions[number];
  title: string;
  paymentLabel: string;
}
