export interface ProductImage {
  id: number;
  image: string;
}

export interface Product {
  id: string; // This is the converted ID (string) used in the frontend
  name: string;
  description: string;
  content: string;
  sellingPrice: number;
  discount: number | null;
  rate: number | null;
  condition: string;
  returnPolicy: string;
  category: {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
  variants: ProductVariant[];
  quantity: number;
  isFood: boolean;
  isAvailiable: boolean;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
  shop: Shop;
  user: User;
}

// This interface represents the raw product data from the backend (with numeric ID)
export interface RawProduct {
  id: number; // This is the raw ID from the backend (number)
  name: string;
  description: string;
  content: string;
  sellingPrice: number;
  discount: number | null;
  rate: number | null;
  condition: string;
  returnPolicy: string;
  category: {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
  variants: ProductVariant[];
  quantity: number;
  isFood: boolean;
  isAvailiable: boolean;
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
  ShopCategory: ShopCategoryDT;
}

export interface ShopCategoryDT {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
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

export type VariantDT = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export interface ProductVariant {
  id: number;
  color: VariantDT;
  size: VariantDT;
  quantity: number;
  colorId: number;
  sizeId: number;
}

export interface ProductResponse {
  product: Product;
}
