import { UserDT } from 'src/types/user';

export type INotificationTableFilters = {
  name: string;
  role: string[];
  status: 'All' | 'SHOP_OWNER' | 'CUSTOMER'; // Change to string union type
  phoneNumber: string;
};

export type NotificationReqDT = {
  title: string;
  message?: string;
  recipientType?: 'SHOP_OWNER' | 'CUSTOMER';
  provider: 'EMAIL' | 'SMS';
};

export type NotificationDT = {
  id: number;
  title: string;
  message: string;
  recipientType: string;
  isRead: boolean;
  recipientId: number;
  createdAt: string;
  updatedAt: string;
};

export type AllNotificationDT = {
  id: number;
  title: string;
  message: string;
  recipientType: string;
  isRead: boolean;
  recipientId: number;
  createdAt: string;
  updatedAt: string;
  user: UserDT;
};
