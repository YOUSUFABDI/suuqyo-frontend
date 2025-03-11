import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API } from '../api';
import { ApiResponseDT } from 'src/types/api-response';

export const shopApi = createApi({
  reducerPath: 'shopApi',
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
  tagTypes: ['shopApi'],
  endpoints: (builder) => ({
    getShopDetail: builder.query<ApiResponseDT<any>, void>({
      query: () => ({
        url: '/shop/get-shop-detail',
        method: 'GET',
      }),
      providesTags: ['shopApi'],
    }),
    updateShopDetail: builder.mutation<any, { formData: FormData }>({
      query: ({ formData }) => {
        return {
          url: `shop/update-shop`,
          method: 'PATCH',
          body: formData,
        };
      },
      invalidatesTags: ['shopApi'],
    }),
  }),
});

export const { useGetShopDetailQuery, useUpdateShopDetailMutation } = shopApi;
