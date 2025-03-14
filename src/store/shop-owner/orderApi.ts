import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API } from '../api';
import { ApiResponseDT } from 'src/types/api-response';
import { OrderResDT } from 'src/sections/shop-owner/order/types/types';

export const OrderApi = createApi({
  reducerPath: 'OrderApi',
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
  tagTypes: ['OrderApi'],
  endpoints: (builder) => ({
    getOrders: builder.query<ApiResponseDT<OrderResDT[]>, void>({
      query: () => ({
        url: '/shop-owner/get-orders',
        method: 'GET',
      }),
      providesTags: ['OrderApi'],
    }),
  }),
});

export const { useGetOrdersQuery } = OrderApi;
