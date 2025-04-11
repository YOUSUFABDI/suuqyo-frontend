import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API } from '../api';
import { AssignedOrderDTRes } from 'src/sections/delivery-user/assigned-deliveries/types/types';
import { ApiResponseDT } from 'src/types/api-response';

export const deliveryUserApi = createApi({
  reducerPath: 'deliveryUserManagementApi',
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
  tagTypes: ['AssignedOrders'],
  endpoints: (builder) => ({
    getAssignedOrders: builder.query<ApiResponseDT<AssignedOrderDTRes[]>, void>({
      query: () => ({
        url: '/delivery/assigned-orders',
        method: 'GET',
      }),
      providesTags: ['AssignedOrders'],
    }),
    changeAvailability: builder.mutation<any, { availability: boolean }>({
      query: ({ availability }) => ({
        url: '/delivery/change-availability',
        method: 'PATCH',
        body: { availability },
      }),
    }),
    availability: builder.query<ApiResponseDT<{ availability: boolean }>, void>({
      query: () => ({
        url: '/delivery/availability',
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetAssignedOrdersQuery, useChangeAvailabilityMutation, useAvailabilityQuery } =
  deliveryUserApi;
