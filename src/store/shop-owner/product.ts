import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  CategoryDT,
  CreateProductResDT,
  ProductResDT,
  UpdatedProductResDT,
} from 'src/sections/shop-owner/product/types/types';
import { ApiResponseDT } from 'src/types/api-response';
import { API } from '../api';

export const productApi = createApi({
  reducerPath: 'productApi',
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
  tagTypes: ['productApi'],
  endpoints: (builder) => ({
    getProducts: builder.query<ApiResponseDT<ProductResDT[]>, void>({
      query: () => ({
        url: '/product/get-products',
        method: 'GET',
      }),
      providesTags: ['productApi'],
    }),
    getProduct: builder.query<ApiResponseDT<ProductResDT>, { id: number }>({
      query: ({ id }) => ({
        url: `/product/get-product/${id}`,
        method: 'GET',
      }),
      providesTags: ['productApi'],
    }),
    getTrashProducts: builder.query<ApiResponseDT<ProductResDT[]>, void>({
      query: () => ({
        url: '/product/get-trash-products',
        method: 'GET',
      }),
      providesTags: ['productApi'],
    }),
    createProduct: builder.mutation<CreateProductResDT, FormData>({
      query: (formData) => {
        return {
          url: '/product/create-product',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['productApi'],
    }),
    updateProduct: builder.mutation<UpdatedProductResDT, { id: number; formData: FormData }>({
      query: ({ formData, id }) => {
        return {
          url: `/product/update-product/${id}`,
          method: 'PATCH',
          body: formData,
        };
      },
      invalidatesTags: ['productApi'],
    }),
    deleteProduct: builder.mutation<void, number>({
      query: (productId) => ({
        url: `/product/delete-product/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['productApi'],
    }),
    deleteProducts: builder.mutation<void, number[]>({
      query: (productIds) => ({
        url: `/product/delete-products`,
        method: 'DELETE',
        body: { productIds },
      }),
    }),
    moveToTrashManyProducts: builder.mutation<void, number[]>({
      query: (productIds) => ({
        url: `/product/trash-products`,
        method: 'DELETE',
        body: { productIds },
      }),
    }),
    moveToTrash: builder.mutation<void, number>({
      query: (productId) => ({
        url: `/product/move-to-trash-product/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['productApi'],
    }),
    restoreFromTrash: builder.mutation<void, number>({
      query: (productId) => ({
        url: `/product/restore-product/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['productApi'],
    }),
    getProductCategories: builder.query<ApiResponseDT<CategoryDT[]>, void>({
      query: () => ({
        url: '/product/get-categories',
        method: 'GET',
      }),
      providesTags: ['productApi'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetTrashProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useDeleteProductsMutation,
  useMoveToTrashMutation,
  useRestoreFromTrashMutation,
  useMoveToTrashManyProductsMutation,

  useGetProductCategoriesQuery,
} = productApi;
