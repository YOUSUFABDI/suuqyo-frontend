export interface OrderStatusDT {
  shopOwnerId: string;
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

export type OneOrderStatusDT = {
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
  orders: OrdersDT[];
};

export type OrdersDT = {
  orderId: number;
  status: string;
  total: string;
  shippingFee: number;
  createdAt: string;
  customer: CustomerDT;
  deliveryLocation: string;
  customerAddress: string;
  items: ItemsDT[];
};

type ItemsDT = {
  itemId: number;
  productName: string;
  quantity: number;
  price: string;
  productImage: string;
  selectedColor: null;
  selectedSize: null;
};

export type CustomerDT = {
  id: number;
  name: string;
  phone: string;
  email: string;
  image: string;
};
