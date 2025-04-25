import { createApi } from '@reduxjs/toolkit/query/react';
import {
  ChangePasswordReqDT,
  ForgotPasswordPasswordReqDT,
  LoginReqDT,
  LoginResDT,
  ResetPasswordPasswordReqDT,
  SignUpReqDT,
  UserResDT,
  VerifyOTPReqDT,
} from 'src/sections/auth/types/types';
import { ApiResponseDT } from 'src/types/api-response';
import { baseQueryWithReauth } from 'src/utils/base-query-with-re-auth';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['auth'],
  endpoints: (builder) => ({
    signup: builder.mutation<any, SignUpReqDT>({
      query: (body) => ({
        url: '/auth/signup',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['auth'],
    }),
    verifyOTP: builder.mutation<any, VerifyOTPReqDT>({
      query: (body) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['auth'],
    }),
    login: builder.mutation<ApiResponseDT<LoginResDT>, LoginReqDT>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['auth'],
    }),

    getUser: builder.query<ApiResponseDT<UserResDT>, void>({
      query: () => ({
        url: '/auth/me',
        method: 'GET',
      }),
      providesTags: ['auth'],
    }),

    changePassword: builder.mutation<ApiResponseDT<any>, ChangePasswordReqDT>({
      query: (data) => ({
        url: '/auth/change-password',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['auth'],
    }),

    forgotPassword: builder.mutation<any, ForgotPasswordPasswordReqDT>({
      query: (data) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['auth'],
    }),
    resetPassword: builder.mutation<any, ResetPasswordPasswordReqDT>({
      query: (data) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useVerifyOTPMutation,
  useSignupMutation,
  useLoginMutation,
  useGetUserQuery,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
