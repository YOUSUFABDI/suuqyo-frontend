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
  data: ShopDT;
}>;

export const SHOP_OWNER_STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
];

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
  password?: string;
}

export interface UpdateShopOwnerResponseDT {
  message: string;
}

//....
export type ShopOwnerDT = {
  id: string;
  userId: number;
  fullName: string;
  phoneNumber: string;
  createdAt: string; // Change to Date if needed
  updatedAt: string;
};

export type UserDT = {
  id: string;
  username: string;
  email: string;
  password: string;
  profileImage: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  ShopOwner: ShopOwnerDT;
};

export interface ShopDT {
  id: string;
  userId: number;
  shopName: string;
  shopDescription: string;
  shopLogo: string;
  shopAddress: string;
  createdAt: string;
  updatedAt: string;
  user: UserDT;
}
