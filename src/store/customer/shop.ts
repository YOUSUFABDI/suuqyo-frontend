import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API } from '../api';
import { ApiResponseDT } from 'src/types/api-response';
import { ShopInfoDT } from 'src/sections/home/shop/types/types';

// Define types for paginated response
export type PaginatedShops = {
  data: ShopInfoDT['shop'][];
  total: number;
  page: number;
  limit: number;
};

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
    shops: builder.query<ApiResponseDT<PaginatedShops>, { page?: number; limit?: number; sortBy?: string }>({
      query: ({ page = 1, limit = 12, sortBy }) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (sortBy) {
          params.append('sortBy', sortBy);
        }
        return {
          url: `/shop/get-shops?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['shops'],
    }),
    searchShops: builder.query<ApiResponseDT<PaginatedShops>, { query: string; page?: number; limit?: number }>({
      query: ({ query, page = 1, limit = 10 }) => {
        const params = new URLSearchParams();
        params.append('q', query);
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        return {
          url: `/shop/search-shops?${params.toString()}`,
          method: 'GET',
        };
      },
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

export const { 
  useShopsQuery, 
  useSearchShopsQuery, 
  useGetShopInfoQuery, 
  useGetAllShopCategoriesQuery 
} = shopsManagementApi;