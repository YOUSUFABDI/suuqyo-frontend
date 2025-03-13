import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  ReminderResponseDataDT,
  RenewResponseDataDT,
  SubscriptionReqDT,
  SubscriptionResDT,
} from 'src/sections/admin/subscription/types/subscription';
import { ApiResponseDT } from 'src/types/api-response';
import { API } from '../api';

export const subscriptionApi = createApi({
  reducerPath: 'subscriptionApi',
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
  tagTypes: ['subscriptionApi'],
  endpoints: (builder) => ({
    createSubscription: builder.mutation<ApiResponseDT<SubscriptionResDT>, SubscriptionReqDT>({
      query: (subscriptionResDT) => ({
        url: '/admin/create-subscription',
        method: 'POST',
        body: subscriptionResDT,
      }),
      invalidatesTags: ['subscriptionApi'],
    }),
    getSubscriptions: builder.query<ApiResponseDT<SubscriptionResDT[]>, void>({
      query: () => ({
        url: '/admin/get-all-subscriptions',
        method: 'GET',
      }),
      providesTags: ['subscriptionApi'],
    }),
    getOneSubscription: builder.query<ApiResponseDT<SubscriptionResDT>, { id: number }>({
      query: ({ id }) => ({
        url: `/admin/get-one-subscription/${id}`,
        method: 'GET',
      }),
      providesTags: ['subscriptionApi'],
    }),
    sendReminder: builder.mutation<ApiResponseDT<ReminderResponseDataDT>, { shopOwnerId: number }>({
      query: ({ shopOwnerId }) => ({
        url: '/admin/send-subscription-reminder',
        method: 'POST',
        body: { shopOwnerId },
      }),
      invalidatesTags: ['subscriptionApi'],
    }),
    renewSubscription: builder.mutation<
      ApiResponseDT<RenewResponseDataDT>,
      { shopOwnerId: number }
    >({
      query: ({ shopOwnerId }) => ({
        url: '/admin/renew-subscription',
        method: 'POST',
        body: { shopOwnerId },
      }),
      invalidatesTags: ['subscriptionApi'],
    }),
  }),
});

export const {
  useCreateSubscriptionMutation,
  useGetSubscriptionsQuery,
  useGetOneSubscriptionQuery,
  useSendReminderMutation,
  useRenewSubscriptionMutation,
} = subscriptionApi;
