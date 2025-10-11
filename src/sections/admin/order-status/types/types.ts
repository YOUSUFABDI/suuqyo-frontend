export interface OrderStatusDT {
  shopOwnerId: number;
  name: string;
  email: string;
  phoneNumber: string;
  shopName: string;
  pending: number;
  preparing: number;
  delivering: number;
  completed: number;
  canceled: number;
  refunded: number;
  totalOrders: number;
  lastOrderDate: string;
  timeAgo: string;
}

export const ORDER_STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'PREPARING', label: 'Preparing' },
  { value: 'DELIVERING', label: 'Delivering' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELED', label: 'Cancelled' },
  { value: 'REFUNDED', label: 'Refunded' },
];
