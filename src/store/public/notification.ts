import { createApi } from '@reduxjs/toolkit/query/react';
import {
  AllNotificationDT,
  NotificationDT,
  NotificationReqDT,
} from 'src/sections/admin/notification/types/types';
import { ApiResponseDT } from 'src/types/api-response';
import { baseQueryWithReauth } from 'src/utils/base-query-with-re-auth';

export const notificationApi = createApi({
  reducerPath: 'notificationApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['notificationApi'],
  endpoints: (builder) => ({
    sendNotificationToShopOwner: builder.mutation<any, NotificationReqDT>({
      query: (body) => ({
        url: '/notification/send-to-shop-owners',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['notificationApi'],
    }),
    sendNotificationToCustomer: builder.mutation<any, NotificationReqDT>({
      query: (body) => ({
        url: '/notification/send-to-customers',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['notificationApi'],
    }),
    shopOwnerNotifications: builder.query<ApiResponseDT<NotificationDT[]>, { id: number }>({
      query: ({ id }) => ({
        url: `/notification/shop-owner/${id}`,
        method: 'GET',
      }),
      providesTags: ['notificationApi'],
    }),
    customerNotifications: builder.query<ApiResponseDT<NotificationDT[]>, { id: number }>({
      query: ({ id }) => ({
        url: `/notification/customer/${id}`,
        method: 'GET',
      }),
      providesTags: ['notificationApi'],
    }),
    getAllNotifications: builder.query<ApiResponseDT<AllNotificationDT[]>, void>({
      query: () => ({
        url: '/notification/all',
        method: 'GET',
      }),
      providesTags: ['notificationApi'],
    }),

    // -------- SMS (NEW) --------
    sendSmsToShopOwners: builder.mutation<any, NotificationReqDT>({
      query: (body) => ({
        url: '/notification/send-sms-to-shop-owners',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['notificationApi'],
    }),

    sendSmsToCustomers: builder.mutation<any, NotificationReqDT>({
      query: (body) => ({
        url: '/notification/send-sms-to-customers',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['notificationApi'],
    }),
    // -------- SMS (NEW) --------
  }),
});

export const {
  useSendNotificationToShopOwnerMutation,
  useSendNotificationToCustomerMutation,
  useShopOwnerNotificationsQuery,
  useCustomerNotificationsQuery,
  useGetAllNotificationsQuery,

  useSendSmsToShopOwnersMutation,
  useSendSmsToCustomersMutation,
} = notificationApi;
