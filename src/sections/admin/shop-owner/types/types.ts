import { ApiResponseDT } from 'src/types/api-response';

export type IShopOwnerTableFilters = {
  name: string;
  role: string[];
  status: 'All' | 'Active' | 'Inactive'; // Change to string union type
  phoneNumber: string;
};

export interface ShopCategoryDT {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export type PaymentMethod = {
  id: number;
  userId: number;
  paymentName: string;
  paymentPhone: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};

export interface ShopOwnerDetail {
  id: number;
  userId: number;
  fullName: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterShopOwnerReqDT {
  createShopOwnerDto: string;
  profileImage?: File;
}

export type RegisterShopOwnerResDT = ApiResponseDT<{
  data: ShopOwnerDT;
}>;

export interface ShopOwnerDT {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: string;
  profileImage: string;
  role: string;
  status: boolean;
  updatedAt: string;
  shopOwnerId: number;
  shopOwnerUserId: number;
  fullName: string;
  phoneNumber: string;
  addressId: number;
  addressUserId: number;
  address: string;
  city: string;
  country: string;
  state: string;
  // shop detail
  shopName: string;
  shopLogo: string;
  shopDescription: string;
  shopAddress: string;
  ShopCategory: ShopCategoryDT;
  businessProof: string;
  paymentMethods: PaymentMethod[];
  createdBy: string;
  updatedBy: string;
}

export interface ShopOwnersDataDT {
  shopOwners: ShopOwnerDT[];
}

export interface GetAllShopOwnersResponseDT {
  statusCode: number;
  payload: {
    message: string;
    data: ShopOwnersDataDT;
  };
  error: any | null;
}

export interface UpdateShopOwnerRequestDT {
  username?: string;
  email?: string;
  role?: string;
  status?: boolean;
  fullName?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  country?: string;
  state?: string;
  profileImage?: File; // Optional profile image
  password?: string;
}

export interface UpdateShopOwnerResponseDT {
  message: string;
}
