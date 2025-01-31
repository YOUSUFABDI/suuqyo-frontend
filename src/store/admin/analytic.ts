import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API } from '../api';
import { ApiResponseDT } from 'src/types/api-response';
import { AdminAnalyticsResDT } from 'src/sections/admin/analytics/types/types';

export const analyticApi = createApi({
  reducerPath: 'analyticApi',
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
  tagTypes: ['analyticApi'],
  endpoints: (builder) => ({
    getAdminAnalytic: builder.query<ApiResponseDT<AdminAnalyticsResDT>, void>({
      query: () => ({
        url: '/admin-analytics',
        method: 'GET',
      }),
      providesTags: ['analyticApi'],
    }),
  }),
});

export const { useGetAdminAnalyticQuery } = analyticApi;
