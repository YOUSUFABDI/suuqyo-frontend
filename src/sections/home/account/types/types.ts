export type OrderStatus =
  | 'PENDING'
  | 'PREPARING'
  | 'DELIVERING'
  | 'COMPLETED'
  | 'CANCELED'
  | 'REFUNDED';

export type OrderTimelineStep = {
  title: string;
  date: string | null;
  isCompleted: boolean;
};

export interface IOrderItemProduct {
  id: number;
  name: string;
  image?: string | null;
  images?: { image: string }[];
  isDeleted?: boolean;
}

export interface IOrderItem {
  price: string; // Decimal serialized as string
  quantity: number;
  product: IOrderItemProduct;
}

export interface IShippingAddress {
  fullName: string;
  address: string | null;
  city: string;
  state: string;
  country: string;
  phoneNumber: string;
}

export interface IOrderHistory {
  id: number;
  orderNumber: string;
  createdAt: string;
  updatedAt: string;
  status: OrderStatus;
  subtotal: string;
  total: string;
  shippingFee: string;
  paymentMethod: string | null;
  paymentAccount: string | null;
  totalItems: number;
  shippingAddress: IShippingAddress | null;
  items: IOrderItem[];

  orderTime?: string | null;
  paymentTime?: string | null;
  deliveryTime?: string | null;
  completionTime?: string | null;
  timeline?: OrderTimelineStep[];

  shopOwner: {
    email: string;
    fullName: string;
    phoneNumber: string;
    id: number;
    shopDetail: {
      isVerified: boolean;
      shopAddress: string;
      shopLogo: string;
      shopName: string;
    };
  };
}
