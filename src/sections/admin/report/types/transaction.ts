import { IDatePickerControl } from 'src/types/common';

export type SubscriptionTransactionResDT = {
  id: number;
  shopOwnerId: number;
  subscriptionId: number;
  amount: number;
  paymentMethod: string;
  transactionDate: string;
  createdAt: string;
  updatedAt: string;
  transactionStatus: string;
  subscription: {
    id: number;
    shopOwnerId: number;
    subscriptionType: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
  };
  shopOwner: {
    id: number;
    fullName: string;
    phoneNumber: string;
  };
};

export type TransactionTableFilters = {
  name: string;
  status: string;
  service: string[];
  endDate: IDatePickerControl;
  startDate: IDatePickerControl;
};
