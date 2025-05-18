import { Image } from '../../product/types/types';

export interface ShopOwnerDT {
  id: number;
  username: string;
  email: string;
  password: string;
  createdAt: string;
  profileImage: string;
  role: string;
  status: string;
  updatedAt: string;
}

export interface ShippingAddressDT {
  id: number;
  address: string;
  phoneNumber: string;
  fullName: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddressDT {
  id: number;
  userId: number;
  address: string;
  city: string;
  country: string;
  createdAt: string;
  updatedAt: string;
  state: string;
}

export interface CustomerDT {
  id: number;
  username: string;
  phoneNumber: String;
  email: string;
  password: string;
  createdAt: string;
  profileImage: string;
  role: string;
  status: string;
  updatedAt: string;
  Address: AddressDT;
  ShippingAddress: ShippingAddressDT;
}

export interface ProductDT {
  id: number;
  userId: number;
  categoryId: number;
  name: string;
  description: string | null;
  content: string | null;
  purchasePrice: number | null;
  sellingPrice: number;
  discount: number | null;
  rate: number | null;
  model: string;
  condition: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  images: Image[];
  shopOwner: ShopOwnerDT;
}

export type DeliveryUserDT = {
  id: string;
  userId: string;
  shopOwnerId: string;
  availability: boolean;
  vehicleDetail: string;
  createdAt: string;
  updatedAt: string;
  user: {
    fullName: string;
    phoneNumber: string;
  };
};

export interface OrderItemDT {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
  product: ProductDT;
}

export type OrderResDT = {
  id: string;
  userId: string;
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  deliveryUser: DeliveryUserDT;
  customer: CustomerDT;
  items: OrderItemDT[];
  paymentMethod: string;
  shippingFee: number;
  senderPhone: string;
};

export const ORDER_STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'PREPARING', label: 'Preparing' },
  { value: 'DELIVERING', label: 'Delivering' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELED', label: 'Cancelled' },
  { value: 'REFUNDED', label: 'Refunded' },
];
