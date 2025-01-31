export interface SubscriptionReqDT {
  shopOwnerId: number;
  subscriptionType: string;
  isFree?: boolean;
  discount?: number;
}

export type SubscriptionResDT = {
  id: string;
  shopOwnerId: number;
  isActive: boolean;
  isFree: boolean;
  discount: number;
  subscriptionType: string;
  subscriptionFee: number;
  subscriptionStatus: string;
  remainingTime: number;
  startDate: string;
  endDate: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;

  shopOwner: {
    id: string;
    userId: number;
    fullName: string;
    phoneNumber: string;
    createdAt: string;
    updatedAt: string;
    user: {
      id: string;
      username: string;
      email: string;
      profileImage: string;
      role: string;
      status: string;
      createdAt: string;
      updatedAt: string;
    };
  };
};

export const SUBS_STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'FAILED', label: 'Failed' },
  { value: 'COMPLETED', label: 'Completed' },
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
