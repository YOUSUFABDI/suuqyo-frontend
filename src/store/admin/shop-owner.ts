import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  GetAllShopOwnersResponseDT,
  RegisterShopOwnerResDT,
  ShopOwnerDT,
  UpdateShopOwnerResponseDT,
} from 'src/sections/admin/shop-owner/types/types';
import { ApiResponseDT } from 'src/types/api-response';
import { API } from '../api';

export const shopOwnerApi = createApi({
  reducerPath: 'shopOwnerApi',
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
  tagTypes: ['shopOwnerApi'],
  endpoints: (builder) => ({
    registerShopOwner: builder.mutation<RegisterShopOwnerResDT, FormData>({
      query: (formData) => {
        return {
          url: '/admin-shop-owner/register-shop-owner',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['shopOwnerApi'],
    }),
    getAllShopOwners: builder.query<GetAllShopOwnersResponseDT, void>({
      query: () => ({
        url: '/admin-shop-owner/shop-owners',
        method: 'GET',
      }),
      providesTags: ['shopOwnerApi'],
    }),
    getOneShopOwner: builder.query<ApiResponseDT<ShopOwnerDT>, { id: number }>({
      query: ({ id }) => ({
        url: `/admin-shop-owner/shop-owner/${id}`,
        method: 'GET',
      }),
      providesTags: ['shopOwnerApi'],
    }),

    updateShopOwner: builder.mutation<
      UpdateShopOwnerResponseDT,
      { id: number; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/admin-shop-owner/update-shop-owner/${id}`,
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: ['shopOwnerApi'],
    }),

    deleteShopOwner: builder.mutation<void, number>({
      query: (userId) => ({
        url: `/admin-shop-owner/delete-shop-owner/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['shopOwnerApi'],
    }),

    deleteShopOwners: builder.mutation<void, number[]>({
      query: (userIds) => ({
        url: '/admin-shop-owner/delete-shop-owners',
        method: 'DELETE',
        body: { userIds },
      }),
      invalidatesTags: ['shopOwnerApi'],
    }),
  }),
});

export const {
  useRegisterShopOwnerMutation,
  useGetAllShopOwnersQuery,
  useGetOneShopOwnerQuery,
  useUpdateShopOwnerMutation,
  useDeleteShopOwnerMutation,
  useDeleteShopOwnersMutation,
} = shopOwnerApi;
