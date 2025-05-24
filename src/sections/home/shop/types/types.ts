import { Product } from '../../product/types/types';

export type ShopDT = {
  shopId: number;
  shopName: string;
  shopLogo: string;
  shopAddress: string;
  shopDescription: string;
  businessProof: string;
  shopCreatedAt: string;
  shopUpdatedAt: string;
};

export type ShopInfoDT = Product[];
