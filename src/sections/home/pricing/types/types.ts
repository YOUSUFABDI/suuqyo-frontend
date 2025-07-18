export type Plan = {
  subscription: 'BASIC' | 'PRO' | 'PREMIUM';
  monthlyPrice: number;
  yearlyPrice: number;
  caption: string;
  lists: string[];
  labelAction: string;
};

// Updated pricing data to match your actual plans and backend enums
export const _pricingPlans: Plan[] = [
  {
    subscription: 'BASIC',
    monthlyPrice: 0,
    yearlyPrice: 0,
    caption: 'For individuals and small teams getting started.',
    lists: ['List up to 5 products', 'Basic dashboard'],
    labelAction: 'Ready? Contact us.',
  },
  {
    subscription: 'PRO',
    monthlyPrice: 30,
    yearlyPrice: 360, // $30*12 = $360. $300 is a $60 saving.
    caption: 'For growing businesses that need more power.',
    lists: ['List up to 50 products', 'Verified badge', 'Priority support'],
    labelAction: 'Ready? Contact us.',
  },
  {
    subscription: 'PREMIUM',
    monthlyPrice: 50,
    yearlyPrice: 600, // $50*12 = $600. $500 is a $100 saving.
    caption: 'For established businesses with high-volume sales.',
    lists: ['Unlimited products', 'Verified badge', 'Priority support', 'Dedicated support'],
    labelAction: 'Ready? Contact us',
  },
];
