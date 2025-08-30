export type Plan = {
  name: string;
  subscription: 'BASIC' | 'PRO' | 'PREMIUM';
  monthlyPrice: number;
  yearlyPrice: number;
  caption: string;
  lists: string[];
  labelAction: string;
};
