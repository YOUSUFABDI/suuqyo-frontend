import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ApiResponseDT } from 'src/types/api-response';
import { API } from '../api';
import { SubscriptionTransactionResDT } from 'src/sections/admin/report/transaction/types/transaction';
import { SubscriptionRenewalResDT } from 'src/sections/admin/report/subscription-renewal/types/subscription-renewal';

export const reportApi = createApi({
  reducerPath: 'reportApi',
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
  tagTypes: ['reportApi'],
  endpoints: (builder) => ({
    getTransactions: builder.query<ApiResponseDT<SubscriptionTransactionResDT[]>, void>({
      query: () => ({
        url: `/admin/subscription-transactions`,
        method: 'GET',
      }),
      providesTags: ['reportApi'],
    }),
    getSubscriptionRenewals: builder.query<ApiResponseDT<SubscriptionRenewalResDT[]>, void>({
      query: () => ({
        url: `/admin/subscription-renewal-history`,
        method: 'GET',
      }),
      providesTags: ['reportApi'],
    }),
  }),
});

export const { useGetTransactionsQuery, useGetSubscriptionRenewalsQuery } = reportApi;
