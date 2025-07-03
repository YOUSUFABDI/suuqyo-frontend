// src/types/order.ts

export type OrderHistoryDT = {
  id: number;
  orderNumber: string;
  createdAt: string;
  status: string;
  subtotal: string;
  total: string;
  shippingFee: string;
  paymentMethod: string;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    country: string;
    phoneNumber: string;
  };
  items: Array<{
    product: {
      id: number;
      name: string;
      sellingPrice: string;
      quantity: number;
    };
    quantity: number;
    price: string;
  }>;
  orderTime: string;
  paymentTime: string;
  deliveryTime: string;
  completionTime: string;
  timeline: Array<{ title: string; time: string }>;
};
export interface IOrderHistory {
  id: string;
  orderNumber: string;
  createdAt: string;
  orderTime: string;
  paymentTime: string;
  deliveryTime: string;
  completionTime: string;
  status: string;
  timeline: Array<{ title: string; time: string }>;
}
