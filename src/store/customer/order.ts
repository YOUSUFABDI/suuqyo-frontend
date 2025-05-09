import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API } from '../api';
import { ApiResponseDT } from 'src/types/api-response';
import { AddressDT } from 'src/sections/home/address/types/types';

export const orderApi = createApi({
  reducerPath: 'order',
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
  tagTypes: ['order'],
  endpoints: (builder) => ({
    getCurrentShippingAddress: builder.query<ApiResponseDT<AddressDT>, void>({
      query: () => ({
        url: '/customer-order/get-current-shipping-address',
        method: 'GET',
      }),
      providesTags: ['order'],
    }),
    updateShippingAddress: builder.mutation<ApiResponseDT<AddressDT>, AddressDT>({
      query: (body) => ({
        url: '/customer-order/update-shipping-address',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['order'],
    }),
    createOrder: builder.mutation<
      ApiResponseDT<any>,
      {
        items: Array<{ productId: number; quantity: number }>;
        shippingAddressId: number;
        paymentMethod: string;
        senderPhone?: string;
      }
    >({
      query: (body) => ({
        url: '/customer-order/make-order',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['order'],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetCurrentShippingAddressQuery,
  useUpdateShippingAddressMutation,
} = orderApi;
