import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API } from '../api';
import { ApiResponseDT } from 'src/types/api-response';
import { SubscriptionStatusResDT } from 'src/layouts/shop-owner/types/types';

export const shopSubscriptionApi = createApi({
  reducerPath: 'shopSubscriptionApi',
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
  tagTypes: ['shopSubscriptionApi'],
  endpoints: (builder) => ({
    getSubscriptionStatus: builder.query<ApiResponseDT<SubscriptionStatusResDT>, void>({
      query: () => ({
        url: '/shop-owner-subscription/status',
        method: 'GET',
      }),
      providesTags: ['shopSubscriptionApi'],
    }),
  }),
});

export const { useGetSubscriptionStatusQuery } = shopSubscriptionApi;
