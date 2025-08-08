import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API } from '../api';
import { ApiResponseDT } from 'src/types/api-response';
import { ProductResponse } from 'src/sections/home/product/types/types';

export const customerProductApi = createApi({
  reducerPath: 'customerProduct',
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
  tagTypes: ['customerProduct'],
  endpoints: (builder) => ({
    getOneProductById: builder.query<ApiResponseDT<ProductResponse>, { id: number }>({
      query: ({ id }) => ({
        url: `/customer-product/product/${id}`,
        method: 'GET',
      }),
      providesTags: ['customerProduct'],
    }),
    getAllProducts: builder.query<ApiResponseDT<ProductResponse[]>, void>({
      query: () => ({
        url: `/customer-product/products`,
        method: 'GET',
      }),
      providesTags: ['customerProduct'],
    }),
    getAllProductCategories: builder.query<ApiResponseDT<string[]>, void>({
      query: () => ({
        url: '/customer-product/product-categories',
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetOneProductByIdQuery,
  useGetAllProductsQuery,
  useGetAllProductCategoriesQuery,
} = customerProductApi;
