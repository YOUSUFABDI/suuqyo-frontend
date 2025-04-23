import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API } from '../api';
import { ApiResponseDT } from 'src/types/api-response';
import { OrderResDT } from 'src/sections/shop-owner/order/types/types';
import { DeliveryUserResDT } from 'src/sections/shop-owner/delivery-user/types/types';

export const OrderApi = createApi({
  reducerPath: 'OrderApi',
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
  tagTypes: ['OrderApi'],
  endpoints: (builder) => ({
    getOrders: builder.query<ApiResponseDT<OrderResDT[]>, void>({
      query: () => ({
        url: '/order/get-orders',
        method: 'GET',
      }),
      providesTags: ['OrderApi'],
    }),
    updateOrderStatus: builder.mutation<any, { id: number; status: string }>({
      query: ({ id, status }) => ({
        url: `/order/update-order-status/${id}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['OrderApi'],
    }),
    getActiveDeliveryUsers: builder.query<ApiResponseDT<DeliveryUserResDT[]>, void>({
      query: () => ({
        url: '/order/get-active-delivery-users',
        method: 'GET',
      }),
      providesTags: ['OrderApi'],
    }),
    assignDeliveryUser: builder.mutation<any, { id: number; deliveryUserId: number }>({
      query: ({ id, deliveryUserId }) => ({
        url: `/order/assign-delivery/${id}`,
        method: 'PATCH',
        body: { deliveryUserId },
      }),
      invalidatesTags: ['OrderApi'],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
  useGetActiveDeliveryUsersQuery,
  useAssignDeliveryUserMutation,
} = OrderApi;
