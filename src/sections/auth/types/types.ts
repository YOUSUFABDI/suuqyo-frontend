export interface LoginReqDT {
  emailOrUsername: string;
  password: string;
}

export interface LoginDT {
  email: string;
  access_token: string;
  role: string;
}

export interface UserDT {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  profileImage: string;
  role: string;
  status: string;
  userId: number;
  fullName: string;
  phoneNumber: string;
}

export interface LoginResDT {
  access_token: string;
  email: string;
  role: string;
}

export type UserResDT = {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  profileImage: string;
  role: string;
  status: string;
  userId: number;
  fullName: string;
  phoneNumber: string;
};
