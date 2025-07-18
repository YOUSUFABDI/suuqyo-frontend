export type SubscriptionPlan = 'BASIC' | 'PRO' | 'PREMIUM';
export type SubscriptionTerm = 'MONTHLY' | 'YEARLY';

export interface SubscriptionReqDT {
  shopOwnerId: number;
  subscriptionPlan: SubscriptionPlan;
  subscriptionTerm: SubscriptionTerm;
  discount?: number;
}

export interface UpdateSubscriptionReqDT {
  shopOwnerId: number;
  newPlan?: 'BASIC' | 'PRO' | 'PREMIUM';
  newTerm?: 'MONTHLY' | 'YEARLY';
  discount?: number;
}

export type SubscriptionResDT = {
  id: string;
  shopOwnerId: number;
  isActive: boolean;
  isFree: boolean;
  discount: number;
  subscriptionTerm: string;
  subscriptionFee: number;
  subscriptionPlan: string;
  subscriptionStatus: string;
  remainingTime: number;
  startDate: string;
  endDate: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    fullName: string;
    phoneNumber: string;
    username: string;
    email: string;
    profileImage: string;
    role: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  // };
};

export const SUBS_STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'EXPIRED', label: 'Expired' },
];

export interface ReminderSubscriptionDetailsDT {
  daysLeft: number;
  hoursLeft: number;
  minutesLeft: number;
  endDate: string;
}

export interface ReminderResponseDataDT {
  message: string;
  subscriptionDetails: ReminderSubscriptionDetailsDT;
}

export interface RenewSubscriptionDetailsDT {
  id: number;
  shopOwnerId: number;
  startDate: string;
  endDate: string;
  subscriptionType: string;
  subscriptionFee: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  discount: number;
  isFree: number;
  remainingTime: number;
  subscriptionStatus: string;
}

export interface RenewResponseDataDT {
  message: string;
  subscriptionDetails: RenewSubscriptionDetailsDT;
}
