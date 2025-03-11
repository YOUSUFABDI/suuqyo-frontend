import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API } from '../api';
import { ApiResponseDT } from 'src/types/api-response';
import {
  ReminderResponseDataDT,
  RenewResponseDataDT,
  SubscriptionReqDT,
  SubscriptionResDT,
} from 'src/sections/admin/subscription/types/subscription';
import {
  GetAllShopOwnersResponseDT,
  RegisterShopOwnerResDT,
  ShopOwnerDT,
  UpdateShopOwnerResponseDT,
} from 'src/sections/admin/shop-owner/types/types';

export const shopOwnerApi = createApi({
  reducerPath: 'shopOwnerApi',
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
  tagTypes: ['shopOwnerApi', 'subscription'],
  endpoints: (builder) => ({
    registerShopOwner: builder.mutation<RegisterShopOwnerResDT, FormData>({
      query: (formData) => {
        return {
          url: '/admin/register-shop-owner',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['shopOwnerApi'],
    }),
    getAllShopOwners: builder.query<GetAllShopOwnersResponseDT, void>({
      query: () => ({
        url: '/admin/shop-owners',
        method: 'GET',
      }),
      providesTags: ['shopOwnerApi'],
    }),
    getOneShopOwner: builder.query<ApiResponseDT<ShopOwnerDT>, { id: number }>({
      query: ({ id }) => ({
        url: `/admin/shop-owner/${id}`,
        method: 'GET',
      }),
      providesTags: ['shopOwnerApi'],
    }),

    updateShopOwner: builder.mutation<
      UpdateShopOwnerResponseDT,
      { id: number; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/admin/update-shop-owner/${id}`,
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: ['shopOwnerApi'],
    }),

    deleteShopOwner: builder.mutation<void, number>({
      query: (userId) => ({
        url: `/admin/delete-shop-owner/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['shopOwnerApi', 'subscription'],
    }),

    deleteShopOwners: builder.mutation<void, number[]>({
      query: (userIds) => ({
        url: '/admin/delete-shop-owners',
        method: 'DELETE',
        body: { userIds },
      }),
      invalidatesTags: ['shopOwnerApi', 'subscription'],
    }),

    // subscription
    createSubscription: builder.mutation<ApiResponseDT<SubscriptionResDT>, SubscriptionReqDT>({
      query: (subscriptionResDT) => ({
        url: '/admin/create-subscription',
        method: 'POST',
        body: subscriptionResDT,
      }),
      invalidatesTags: ['subscription', 'shopOwnerApi'],
    }),
    getSubscriptions: builder.query<ApiResponseDT<SubscriptionResDT[]>, void>({
      query: () => ({
        url: '/admin/get-all-subscriptions',
        method: 'GET',
      }),
      providesTags: ['subscription'],
    }),
    getOneSubscription: builder.query<ApiResponseDT<SubscriptionResDT>, { id: number }>({
      query: ({ id }) => ({
        url: `/admin/get-one-subscription/${id}`,
        method: 'GET',
      }),
      providesTags: ['subscription'],
    }),
    sendReminder: builder.mutation<ApiResponseDT<ReminderResponseDataDT>, { shopOwnerId: number }>({
      query: ({ shopOwnerId }) => ({
        url: '/admin/send-subscription-reminder',
        method: 'POST',
        body: { shopOwnerId },
      }),
      invalidatesTags: ['subscription'],
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
      invalidatesTags: ['subscription'],
    }),
  }),
});

export const {
  useRegisterShopOwnerMutation,
  useGetAllShopOwnersQuery,
  useGetOneShopOwnerQuery,
  useUpdateShopOwnerMutation,
  useDeleteShopOwnerMutation,
  useDeleteShopOwnersMutation,

  // subscription
  useCreateSubscriptionMutation,
  useGetSubscriptionsQuery,
  useGetOneSubscriptionQuery,
  useSendReminderMutation,
  useRenewSubscriptionMutation,
} = shopOwnerApi;
