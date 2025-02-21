import { createApi } from '@reduxjs/toolkit/query/react';
import {
  ChangePasswordReqDT,
  LoginReqDT,
  LoginResDT,
  UserResDT,
} from 'src/sections/auth/types/types';
import { ApiResponseDT } from 'src/types/api-response';
import { baseQueryWithReauth } from 'src/utils/base-query-with-re-auth';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['auth'],
  endpoints: (builder) => ({
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

    updateAdmin: builder.mutation<any, { id: number; formData: FormData }>({
      query: ({ id, formData }) => {
        return {
          url: `user/update-admin/${id}`,
          method: 'PATCH',
          body: formData,
        };
      },
      invalidatesTags: ['auth'],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetUserQuery,
  useChangePasswordMutation,
  useUpdateAdminMutation,
} = authApi;
