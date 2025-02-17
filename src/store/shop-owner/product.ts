import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API } from '../api';
import { ApiResponseDT } from 'src/types/api-response';
import { ProductResDT } from 'src/sections/shop-owner/product/types/types';

export const productApi = createApi({
  reducerPath: 'productApi',
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
  tagTypes: ['productApi'],
  endpoints: (builder) => ({
    getProducts: builder.query<ApiResponseDT<ProductResDT[]>, void>({
      query: () => ({
        url: '/product/get-products',
        method: 'GET',
      }),
      providesTags: ['productApi'],
    }),
  }),
});

export const { useGetProductsQuery } = productApi;
