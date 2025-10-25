import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  ColorDT,
  ColorReqDT,
  DeleteManyColorsReqDT,
} from 'src/sections/admin/variant/color/types/types';
import {
  DeleteManySizesReqDT,
  SizeDT,
  SizeReqDT,
} from 'src/sections/admin/variant/size/types/types';
import { ApiResponseDT } from 'src/types/api-response';
import { API } from '../api';

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
    // size
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
    // size

    // color
    getAllColors: builder.query<ApiResponseDT<ColorDT[]>, void>({
      query: () => ({
        url: 'product-variants/color/all',
        method: 'GET',
      }),
      providesTags: ['variantApi'],
    }),
    getOneColor: builder.query<ApiResponseDT<ColorDT>, { id: number }>({
      query: ({ id }) => ({
        url: `product-variants/color/${id}`,
        method: 'GET',
      }),
      providesTags: ['variantApi'],
    }),
    createOneColor: builder.mutation<any, ColorReqDT>({
      query: (body) => {
        return {
          url: '/product-variants/color/one',
          method: 'POST',
          body: body,
        };
      },
      invalidatesTags: ['variantApi'],
    }),
    updateOneColor: builder.mutation<any, { colorId: number; body: ColorReqDT }>({
      query: ({ colorId, body }) => {
        return {
          url: `product-variants/color/${colorId}`,
          method: 'PATCH',
          body: body,
        };
      },
      invalidatesTags: ['variantApi'],
    }),
    deleteOneColor: builder.mutation<ApiResponseDT<ColorDT>, { id: number }>({
      query: ({ id }) => ({
        url: `product-variants/delete-one-color/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['variantApi'],
    }),
    deleteManyColors: builder.mutation<any, DeleteManyColorsReqDT>({
      query: (body) => ({
        url: 'product-variants/delete-many-color',
        method: 'DELETE',
        body,
      }),
      invalidatesTags: ['variantApi'],
    }),
    // color
  }),
});

export const {
  // size
  useGetAllSizesQuery,
  useCreateOneSizeMutation,
  useUpdateOneSizeMutation,
  useGetOneSizeQuery,
  useDeleteOneSizeMutation,
  useDeleteManySizesMutation,
  // size

  // color
  useGetAllColorsQuery,
  useCreateOneColorMutation,
  useUpdateOneColorMutation,
  useGetOneColorQuery,
  useDeleteOneColorMutation,
  useDeleteManyColorsMutation,
  // color
} = variantApi;
