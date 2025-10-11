import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API } from '../api';
import {
  DeleteManySizesReqDT,
  SizeDT,
  SizeReqDT,
} from 'src/sections/admin/variant/size/types/types';
import { ApiResponseDT } from 'src/types/api-response';

export const variantApi = createApi({
  reducerPath: 'variantApi',
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
  tagTypes: ['variantApi'],
  endpoints: (builder) => ({
    getAllSizes: builder.query<ApiResponseDT<SizeDT[]>, void>({
      query: () => ({
        url: 'product-variants/size/all',
        method: 'GET',
      }),
      providesTags: ['variantApi'],
    }),
    getOneSize: builder.query<ApiResponseDT<SizeDT>, { id: number }>({
      query: ({ id }) => ({
        url: `product-variants/size/${id}`,
        method: 'GET',
      }),
      providesTags: ['variantApi'],
    }),
    createOneSize: builder.mutation<any, SizeReqDT>({
      query: (body) => {
        return {
          url: '/product-variants/size/one',
          method: 'POST',
          body: body,
        };
      },
      invalidatesTags: ['variantApi'],
    }),
    updateOneSize: builder.mutation<any, { sizeId: number; body: SizeReqDT }>({
      query: ({ sizeId, body }) => {
        return {
          url: `product-variants/size/${sizeId}`,
          method: 'PATCH',
          body: body,
        };
      },
      invalidatesTags: ['variantApi'],
    }),
    deleteOneSize: builder.mutation<ApiResponseDT<SizeDT>, { id: number }>({
      query: ({ id }) => ({
        url: `product-variants/delete-one-size/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['variantApi'],
    }),
    deleteManySizes: builder.mutation<any, DeleteManySizesReqDT>({
      query: (body) => ({
        url: 'product-variants/delete-many-size',
        method: 'DELETE',
        body,
      }),
      invalidatesTags: ['variantApi'],
    }),
  }),
});

export const {
  useGetAllSizesQuery,
  useCreateOneSizeMutation,
  useUpdateOneSizeMutation,
  useGetOneSizeQuery,
  useDeleteOneSizeMutation,
  useDeleteManySizesMutation,
} = variantApi;
