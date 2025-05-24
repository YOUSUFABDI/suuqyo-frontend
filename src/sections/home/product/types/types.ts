export interface ProductImage {
  id: number;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  content: string;
  sellingPrice: number;
  discount: number | null;
  rate: number | null;
  condition: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
  shop: Shop;
  user: User;
}

export interface Shop {
  shopId: number;
  shopName: string;
  shopLogo: string;
  shopAddress: string;
  shopDescription: string;
  businessProof: string;
  shopCreatedAt: string;
  shopUpdatedAt: string;
}

export interface PaymentMethod {
  id: number;
  paymentName: string;
  paymentPhone: string;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  profileImage: string;
  status: boolean;
  paymentMethods: PaymentMethod[];
}

export interface ProductResponse {
  product: Product;
}
