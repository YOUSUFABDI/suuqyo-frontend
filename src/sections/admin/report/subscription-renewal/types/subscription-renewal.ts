import { IDatePickerControl } from 'src/types/common';

// This is a renewal TRANSACTION shape coming from backend
export type SubscriptionRenewalResDT = {
  id: number;
  userId: number;
  subscriptionId: number;

  amount: number; // transaction amount
  paymentMethod: 'EVC_PLUS' | 'CASH';
  transactionDate: string; // ISO
  createdAt: string; // ISO
  updatedAt: string; // ISO
  transactionStatus: 'PENDING' | 'COMPLETED' | 'FAILED';
  transactionType: 'NEW_SUBSCRIPTION' | 'RENEW_SUBSCRIPTION';

  user: {
    profileImage: string;
    email: string;
    fullName: string;
    phoneNumber: string;
  };

  subscription: {
    id: number;
    userId: number;
    startDate: string; // ISO
    endDate: string; // ISO
    subscriptionPlan: 'BASIC' | 'PRO' | 'PREMIUM';
    subscriptionTerm: 'MONTHLY' | 'YEARLY';
    productLimit: number;
    subscriptionFee: number;
    createdBy: string;
    createdAt: string; // ISO
    updatedAt: string; // ISO
    discount: number;
    isFree: boolean;
    remainingTime: number | null;
    subscriptionStatus: 'PENDING' | 'ACTIVE' | 'EXPIRED';
  };
};

export type SubscriptionRenewalTableFilters = {
  name: string;
  status: string; // 'all' | 'PENDING' | 'ACTIVE' | 'EXPIRED' (subscription status)
  service: string[]; // same as above (multi-select)
  endDate: IDatePickerControl;
  startDate: IDatePickerControl;
};
