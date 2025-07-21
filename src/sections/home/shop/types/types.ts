import { Product } from '../../product/types/types';

export type ShopInfoDT = {
  shop: {
    id: string;
    shopName: string;
    shopLogo: string;
    shopAddress: string;
    shopDescription: string;
    businessProof: string;
    createdAt: string;
    updatedAt: string;
    ShopCategory: ShopCategoryDT;
  };
  user: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    profileImage: string;
    status: any;
    paymentMethods: {
      id: string;
      paymentName: string;
      paymentPhone: string;
    }[];
  };
  products: Product[];
};

export const SHOP_CATEGORY_OPTIONS = [
  'Furniture',
  'Resturant',
  'Electronic',
  'Coffee',
  'Pizza',
  'Clothes',
  'Shoe Stores',
];

export const SHOP_SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  // { value: 'priceDesc', label: 'Price: High - Low' },
  // { value: 'priceAsc', label: 'Price: Low - High' },
];

export interface ShopCategoryDT {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export const PRODUCT_CATEGORY_OPTIONS = [
  'Shoes',
  'Electronic',
  'Food',
  'Clothes',
  'Drinks',
  'Coffee',
  'Pizza',
];
