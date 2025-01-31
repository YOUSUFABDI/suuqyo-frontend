import { ApiResponseDT } from 'src/types/api-response';

export type IShopOwnerTableFilters = {
  name: string;
  role: string[];
  status: string;
  phoneNumber: string;
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

export const SHOP_OWNER_STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
];

export interface ShopOwnerDT {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: string;
  profileImage: string;
  role: string;
  status: string;
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
  status?: string;
  fullName?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  country?: string;
  state?: string;
  profileImage?: File; // Optional profile image
}

export interface UpdateShopOwnerResponseDT {
  message: string;
}
