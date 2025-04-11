export const ORDER_STATUS_OPTIONS = [
  { value: 'DELIVERING', label: 'Delivering' },
  { value: 'COMPLETED', label: 'Completed' },
];

export interface UserBasicInfo {
  id: string;
  fullName: string;
  phoneNumber: string;
  username: string;
  email: string;
  profileImage: string;
}

export interface Address {
  id: string;
  userId: number;
  address: string;
  phoneNumber: string;
  fullName: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  productId: number;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  sellingPrice: number;
  images: ProductImage[];
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: Product;
  itemTotal: number;
}

export interface AssignedOrderDTRes {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  customer: UserBasicInfo;
  shippingAddress: Address;
  items: OrderItem[];
  assignedDeliveryPerson: Pick<UserBasicInfo, 'fullName' | 'phoneNumber'>;
}
