import { ApiResponseDT } from 'src/types/api-response';

export type IUserTableFilters = {
  name: string;
  role: string[];
  status: 'All' | 'Active' | 'Inactive'; // Change to string union type
  phoneNumber: string;
};

export interface UserDetail {
  id: number;
  userId: number;
  fullName: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterUserReqDT {
  registerUserDto: string;
  profileImage?: File;
}

export type RegisterUserResDT = ApiResponseDT<{
  data: UserDT;
}>;

export interface UserDT {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: string;
  profileImage: string;
  role: string;
  status: boolean;
  updatedAt: string;
  fullName: string;
  phoneNumber: string;
  addressId: number;
  addressUserId: number;
  address: string;
  city: string;
  country: string;
  state: string;
}

export interface UsersDataDT {
  users: UserDT[];
}

export interface GetAllUsersResponseDT {
  statusCode: number;
  payload: {
    message: string;
    data: UsersDataDT;
  };
  error: any | null;
}

export interface UpdateUserRequestDT {
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

export interface UpdateUserResponseDT {
  message: string;
}
