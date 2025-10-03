import { Product } from '../../product/types/types';

export type ShopInfoDT = {
  shop: {
    id: string;
    shopName: string;
    shopLogo: string;
    shopAddress: string;
    shopDescription: string;
    businessProof: string;
    isVerified: boolean;
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

export const SHOP_SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'nameAsc', label: 'Name: A to Z' },
  { value: 'nameDesc', label: 'Name: Z to A' },
];

export interface ShopCategoryDT {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}