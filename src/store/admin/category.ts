import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  DeleteManyProductCategoryReqDT,
  ProductCategoryDT,
  ProductCategoryReqDT,
} from 'src/sections/admin/category/product-category/types/types';
import {
  ShopCategoryDT,
  ShopCategoryReqDT,
} from 'src/sections/admin/category/shop-category/types/types';
import { ApiResponseDT } from 'src/types/api-response';
import { API } from '../api';

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
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
  tagTypes: ['categoryApi'],
  endpoints: (builder) => ({
    // Product category
    getAllProductCategory: builder.query<ApiResponseDT<ProductCategoryDT[]>, void>({
      query: () => ({
        url: 'categories/product-category/all',
        method: 'GET',
      }),
      providesTags: ['categoryApi'],
    }),
    getOneProductCategory: builder.query<ApiResponseDT<ProductCategoryDT>, { id: number }>({
      query: ({ id }) => ({
        url: `categories/product-category/${id}`,
        method: 'GET',
      }),
      providesTags: ['categoryApi'],
    }),
    createOneProductCategory: builder.mutation<any, ProductCategoryReqDT>({
      query: (body) => {
        return {
          url: 'categories/product-category/one',
          method: 'POST',
          body: body,
        };
      },
      invalidatesTags: ['categoryApi'],
    }),
    updateOneProductCategory: builder.mutation<
      any,
      { productCategoryId: number; body: ProductCategoryReqDT }
    >({
      query: ({ productCategoryId, body }) => {
        return {
          url: `categories/update-product-category/${productCategoryId}`,
          method: 'PATCH',
          body: body,
        };
      },
      invalidatesTags: ['categoryApi'],
    }),
    deleteOneProductCategory: builder.mutation<ApiResponseDT<ProductCategoryDT>, { id: number }>({
      query: ({ id }) => ({
        url: `categories/delete-one-product-category/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['categoryApi'],
    }),
    deleteManyProductCategories: builder.mutation<any, DeleteManyProductCategoryReqDT>({
      query: (body) => ({
        url: 'categories/delete-many-product-category',
        method: 'DELETE',
        body,
      }),
      invalidatesTags: ['categoryApi'],
    }),
    // Product category

    // Shop category
    getAllShopCategory: builder.query<ApiResponseDT<ShopCategoryDT[]>, void>({
      query: () => ({
        url: 'categories/shop-category/all',
        method: 'GET',
      }),
      providesTags: ['categoryApi'],
    }),
    getOneShopCategory: builder.query<ApiResponseDT<ShopCategoryDT>, { id: number }>({
      query: ({ id }) => ({
        url: `categories/shop-category/${id}`,
        method: 'GET',
      }),
      providesTags: ['categoryApi'],
    }),
    createOneShopCategory: builder.mutation<any, ShopCategoryReqDT>({
      query: (body) => {
        return {
          url: 'categories/shop-category/one',
          method: 'POST',
          body: body,
        };
      },
      invalidatesTags: ['categoryApi'],
    }),
    updateOneShopCategory: builder.mutation<
      any,
      { shopCategoryId: number; body: ShopCategoryReqDT }
    >({
      query: ({ shopCategoryId, body }) => {
        return {
          url: `categories/update-shop-category/${shopCategoryId}`,
          method: 'PATCH',
          body: body,
        };
      },
      invalidatesTags: ['categoryApi'],
    }),
    deleteOneShopCategory: builder.mutation<ApiResponseDT<ShopCategoryDT>, { id: number }>({
      query: ({ id }) => ({
        url: `categories/delete-one-shop-category/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['categoryApi'],
    }),
    deleteManyShopCategories: builder.mutation<any, DeleteManyProductCategoryReqDT>({
      query: (body) => ({
        url: 'categories/delete-many-shop-category',
        method: 'DELETE',
        body,
      }),
      invalidatesTags: ['categoryApi'],
    }),
    // Shop category
  }),
});

export const {
  // Product category
  useGetAllProductCategoryQuery,
  useGetOneProductCategoryQuery,
  useCreateOneProductCategoryMutation,
  useUpdateOneProductCategoryMutation,
  useDeleteOneProductCategoryMutation,
  useDeleteManyProductCategoriesMutation,
  // Product category

  // Shop category
  useCreateOneShopCategoryMutation,
  useGetAllShopCategoryQuery,
  useGetOneShopCategoryQuery,
  useUpdateOneShopCategoryMutation,
  useDeleteOneShopCategoryMutation,
  useDeleteManyShopCategoriesMutation,
  // Shop category
} = categoryApi;
