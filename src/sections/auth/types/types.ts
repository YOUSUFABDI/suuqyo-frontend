export interface LoginReqDT {
  emailOrUsername: string;
  password: string;
}

export interface SignUpReqDT {
  fullName: string;
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface VerifyOTPReqDT {
  email: string;
  code: number;
}

export interface ChangePasswordReqDT {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordPasswordReqDT {
  email: string;
}
export interface ResetPasswordPasswordReqDT {
  email: string;
  otp: number;
  newPassword: string;
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
  status: boolean;
  userId: number;
  fullName: string;
  phoneNumber: string;
  country: string;
  city: string;
  state: string;
  address: string;
}

export interface LoginResDT {
  access_token: string;
  email: string;
  role: string;
}

export type UserResDT = {
  id: number;
  username: string;
  sex: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  profileImage: string;
  role: string;
  status: string;
  userId: number;
  fullName: string;
  phoneNumber: string;
  country: string;
  city: string;
  state: string;
  address: string;
};
