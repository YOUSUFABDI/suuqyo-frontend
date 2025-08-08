import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API } from '../api';
import { ApiResponseDT } from 'src/types/api-response';
import { ShopInfoDT } from 'src/sections/home/shop/types/types';

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
    shops: builder.query<ApiResponseDT<ShopInfoDT['shop'][]>, void>({
      query: () => ({
        url: '/shop/get-shops',
        method: 'GET',
      }),
      providesTags: ['shops'],
    }),
    getShopInfo: builder.query<ApiResponseDT<ShopInfoDT>, string>({
      query: (shopName) => ({
        url: `/shop/get-shop/${shopName}`,
        method: 'GET',
      }),
    }),
    getAllShopCategories: builder.query<ApiResponseDT<string[]>, void>({
      query: () => ({
        url: '/shop/shop-categories',
        method: 'GET',
      }),
    }),
  }),
});

export const { useShopsQuery, useGetShopInfoQuery, useGetAllShopCategoriesQuery } =
  shopsManagementApi;
