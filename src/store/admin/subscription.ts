import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  ReminderResponseDataDT,
  RenewResponseDataDT,
  SubscriptionReqDT,
  SubscriptionResDT,
  UpdateSubscriptionReqDT,
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
        url: '/admin-subscription/create-subscription',
        method: 'POST',
        body: subscriptionResDT,
      }),
      invalidatesTags: ['subscriptionApi'],
    }),
    // NEW: The updateSubscription mutation
    updateSubscription: builder.mutation<ApiResponseDT<SubscriptionResDT>, UpdateSubscriptionReqDT>(
      {
        query: (updateData) => ({
          url: '/admin-subscription/update-subscription',
          method: 'PATCH', // Using PATCH for partial updates
          body: updateData,
        }),
        invalidatesTags: ['subscriptionApi'], // Refetch subscriptions after an update
      }
    ),
    getSubscriptions: builder.query<ApiResponseDT<SubscriptionResDT[]>, void>({
      query: () => ({
        url: '/admin-subscription/get-all-subscriptions',
        method: 'GET',
      }),
      providesTags: ['subscriptionApi'],
    }),
    getOneSubscription: builder.query<ApiResponseDT<SubscriptionResDT>, number>({
      query: (id) => ({
        url: `/admin-subscription/get-one-subscription/${id}`,
        method: 'GET',
      }),
      providesTags: ['subscriptionApi'],
    }),
    sendReminder: builder.mutation<ApiResponseDT<ReminderResponseDataDT>, { shopOwnerId: number }>({
      query: ({ shopOwnerId }) => ({
        url: '/admin-subscription/send-subscription-reminder',
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
        url: '/admin-subscription/renew-subscription',
        method: 'POST',
        body: { shopOwnerId },
      }),
      invalidatesTags: ['subscriptionApi'],
    }),
  }),
});

export const {
  useCreateSubscriptionMutation,
  useUpdateSubscriptionMutation,
  useGetSubscriptionsQuery,
  useGetOneSubscriptionQuery,
  useSendReminderMutation,
  useRenewSubscriptionMutation,
} = subscriptionApi;
