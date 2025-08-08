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

// export const PRODUCT_CATEGORY_OPTIONS = [
//   'Shoes',
//   'Electronic',
//   'Food',
//   'Clothes',
//   'Drinks',
//   'Coffee',
//   'Pizza',
// ];
