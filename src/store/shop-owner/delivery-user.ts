import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API } from '../api';
import { ApiResponseDT } from 'src/types/api-response';
import { DeliveryUserResDT } from 'src/sections/shop-owner/delivery-user/types/types';

export const deliveryUserApi = createApi({
  reducerPath: 'deliveryUserApi',
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
  tagTypes: ['deliveryUserApi'],
  endpoints: (builder) => ({
    createDeliveryUser: builder.mutation<any, FormData>({
      query: (formData) => {
        return {
          url: '/delivery-user/register-delivery-user',
          method: 'POST',
          body: formData,
        };
      },
    }),
    getDeliveryUsers: builder.query<ApiResponseDT<DeliveryUserResDT[]>, void>({
      query: () => ({
        url: '/delivery-user/get-delivery-users',
        method: 'GET',
      }),
      providesTags: ['deliveryUserApi'],
    }),
    updateDeliveryUser: builder.mutation<any, { id: number; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/delivery-user/update-delivery-user/${id}`,
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: ['deliveryUserApi'],
    }),
    deleteDeliveryUser: builder.mutation<void, number>({
      query: (userId) => ({
        url: `/delivery-user/delete-delivery-user/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['deliveryUserApi'],
    }),
    deleteDeliveryUsers: builder.mutation<void, number[]>({
      query: (userIds) => ({
        url: '/delivery-user/delete-delivery-users',
        method: 'DELETE',
        body: { userIds },
      }),
      invalidatesTags: ['deliveryUserApi'],
    }),
  }),
});

export const {
  useCreateDeliveryUserMutation,
  useGetDeliveryUsersQuery,
  useUpdateDeliveryUserMutation,
  useDeleteDeliveryUserMutation,
  useDeleteDeliveryUsersMutation,
} = deliveryUserApi;
