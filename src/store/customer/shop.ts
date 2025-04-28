import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API } from '../api';
import { ApiResponseDT } from 'src/types/api-response';
import { ShopDT } from 'src/sections/home/shop/types/types';

export const shopsManagementApi = createApi({
  reducerPath: 'shops',
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
  tagTypes: ['shops'],
  endpoints: (builder) => ({
    shops: builder.query<ApiResponseDT<ShopDT[]>, void>({
      query: () => ({
        url: '/customer-order/get-shops',
        method: 'GET',
      }),
      providesTags: ['shops'],
    }),
  }),
});

export const { useShopsQuery } = shopsManagementApi;
