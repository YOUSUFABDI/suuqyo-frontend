import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API } from '../api';
import { ApiResponseDT } from 'src/types/api-response';
import { ShopOwnerAnalyticsResDT } from 'src/sections/shop-owner/analytics/types/types';

export const shopOwnerAnalyticApi = createApi({
  reducerPath: 'shopOwnerAnalyticApi',
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
  tagTypes: ['shopOwnerAnalyticApi'],
  endpoints: (builder) => ({
    getShopOwnerAnalytic: builder.query<ApiResponseDT<ShopOwnerAnalyticsResDT>, void>({
      query: () => ({
        url: '/analytics/overview',
        method: 'GET',
      }),
      providesTags: ['shopOwnerAnalyticApi'],
    }),
  }),
});

export const { useGetShopOwnerAnalyticQuery } = shopOwnerAnalyticApi;
