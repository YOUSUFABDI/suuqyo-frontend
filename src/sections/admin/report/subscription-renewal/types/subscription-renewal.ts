import { IDatePickerControl } from 'src/types/common';

export type SubscriptionRenewalResDT = {
  id: number;
  subscriptionId: number;
  renewedAt: string; // ISO date string
  newStartDate: string; // ISO date string
  newEndDate: string; // ISO date string
  newFee: number;
  discountApplied: number;
  isFree: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  subscription: {
    id: number;
    shopOwnerId: number;
    startDate: string; // ISO date string
    endDate: string; // ISO date string
    subscriptionType: string;
    subscriptionFee: number;
    createdBy: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    discount: number;
    isFree: boolean;
    remainingTime: number;
    subscriptionStatus: string;
    user: {
      profileImage: string;
      email: string;
      fullName: string;
      phoneNumber: string;
    };
  };
};

export type SubscriptionRenewalTableFilters = {
  name: string;
  status: string;
  service: string[];
  endDate: IDatePickerControl;
  startDate: IDatePickerControl;
};
