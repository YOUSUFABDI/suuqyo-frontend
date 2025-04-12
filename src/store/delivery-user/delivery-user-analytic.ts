import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { DeliveryUserAnalyticsResDT } from 'src/sections/delivery-user/analytics/types/types';
import { ApiResponseDT } from 'src/types/api-response';
import { API } from '../api';

export const deliveryUserAnalyticApi = createApi({
  reducerPath: 'deliveryUserAnalyticApi',
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
  tagTypes: ['deliveryUserAnalyticApi'],
  endpoints: (builder) => ({
    getDeliveryUserAnalytic: builder.query<ApiResponseDT<DeliveryUserAnalyticsResDT>, void>({
      query: () => ({
        url: '/delivery-analytic/overview',
        method: 'GET',
      }),
      providesTags: ['deliveryUserAnalyticApi'],
    }),
  }),
});

export const { useGetDeliveryUserAnalyticQuery } = deliveryUserAnalyticApi;
