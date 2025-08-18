import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API } from '../api';
import {
  GetAllUsersResponseDT,
  RegisterUserReqDT,
  UpdateUserResponseDT,
  UserDT,
} from 'src/sections/admin/user/types/types';
import { ApiResponseDT } from 'src/types/api-response';

export const manageUserAsAdminApi = createApi({
  reducerPath: 'manageUserAsAdminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API}`,
    prepareHeaders: (headers) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),
  tagTypes: ['manageUserAsAdminApi'],
  endpoints: (builder) => ({
    registerUser: builder.mutation<RegisterUserReqDT, FormData>({
      query: (formData) => {
        return {
          url: '/manage-user/register-user',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['manageUserAsAdminApi'],
    }),
    getAllUsers: builder.query<GetAllUsersResponseDT, void>({
      query: () => ({
        url: '/manage-user/users',
        method: 'GET',
      }),
      providesTags: ['manageUserAsAdminApi'],
    }),
    getOneUser: builder.query<ApiResponseDT<UserDT>, { id: string }>({
      query: ({ id }) => ({
        url: `/manage-user/users/${id}`,
        method: 'GET',
      }),
      providesTags: ['manageUserAsAdminApi'],
    }),
    updateUser: builder.mutation<UpdateUserResponseDT, { id: number; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/manage-user/update-user/${id}`,
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: ['manageUserAsAdminApi'],
    }),
    deleteUser: builder.mutation<void, number>({
      query: (userId) => ({
        url: `/manage-user/delete-users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['manageUserAsAdminApi'],
    }),
    deleteUsers: builder.mutation<void, number[]>({
      query: (userIds) => ({
        url: '/manage-user/delete-users',
        method: 'DELETE',
        body: { userIds },
      }),
      invalidatesTags: ['manageUserAsAdminApi'],
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useGetAllUsersQuery,
  useGetOneUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useDeleteUsersMutation,
} = manageUserAsAdminApi;
