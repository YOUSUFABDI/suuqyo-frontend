import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API } from '../api';
import { ApiResponseDT } from 'src/types/api-response';
import { ProductResponse } from 'src/sections/home/product/types/types';
import { GetAllProductsArgs, PaginatedProductsPayload } from 'src/types/product';

type SearchProductsArgs = {
  q: string;
  page: number;
  limit: number;
};

type GetAllProductsWithCategoryArgs = GetAllProductsArgs & {
  category?: string;
  sortBy?: string;
  minPrice?: number;
  maxPrice?: number;
};

type GetProductsByShopIdArgs = GetAllProductsArgs & {
  shopId: number;
  category?: string;
  sortBy?: string;
  minPrice?: number;
  maxPrice?: number;
};

export const customerProductApi = createApi({
  reducerPath: 'customerProduct',
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
  tagTypes: ['customerProduct'],
  endpoints: (builder) => ({
    getOneProductById: builder.query<ApiResponseDT<ProductResponse>, { id: number }>({
      query: ({ id }) => ({
        url: `/customer-product/product/${id}`,
        method: 'GET',
      }),
      providesTags: ['customerProduct'],
    }),
    getAllProducts: builder.query<
      ApiResponseDT<PaginatedProductsPayload>,
      GetAllProductsWithCategoryArgs
    >({
      // Correctly uses page, limit, and category from arguments
      query: ({ page, limit, category, sortBy, minPrice, maxPrice }) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());

        // Only add category parameter if it's not 'all' or undefined
        if (category && category !== 'all') {
          params.append('category', category);
        }

        // Add sorting parameter
        if (sortBy) {
          params.append('sortBy', sortBy);
        }

        // Add price filtering parameters
        if (minPrice !== undefined && minPrice > 0) {
          params.append('minPrice', minPrice.toString());
        }

        // Fix: Allow maxPrice to be sent when it's <= 200 (the actual max value)
        if (maxPrice !== undefined && maxPrice <= 200) {
          params.append('maxPrice', maxPrice.toString());
        }

        return {
          url: `/customer-product/products?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['customerProduct'],
    }),
    getProductsByShopId: builder.query<
      ApiResponseDT<PaginatedProductsPayload>,
      GetProductsByShopIdArgs
    >({
      query: ({ shopId, page, limit, category, sortBy, minPrice, maxPrice }) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());

        // Only add category parameter if it's not 'all' or undefined
        if (category && category !== 'all') {
          params.append('category', category);
        }

        // Add sorting parameter
        if (sortBy) {
          params.append('sortBy', sortBy);
        }

        // Add price filtering parameters
        if (minPrice !== undefined && minPrice > 0) {
          params.append('minPrice', minPrice.toString());
        }

        // Fix: Allow maxPrice to be sent when it's <= 200 (the actual max value)
        if (maxPrice !== undefined && maxPrice <= 200) {
          params.append('maxPrice', maxPrice.toString());
        }

        return {
          url: `/customer-product/products/shop/${shopId}?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['customerProduct'],
    }),
    searchProducts: builder.query<ApiResponseDT<PaginatedProductsPayload>, SearchProductsArgs>({
      query: ({ q, page, limit }) => ({
        url: `/customer-product/search?q=${q}&page=${page}&limit=${limit}`,
        method: 'GET',
      }),
      providesTags: ['customerProduct'],
    }),
    getAllProductCategories: builder.query<ApiResponseDT<string[]>, void>({
      query: () => ({
        url: '/customer-product/product-categories',
        method: 'GET',
      }),
      providesTags: ['customerProduct'],
    }),
  }),
});

export const {
  useGetOneProductByIdQuery,
  useGetAllProductsQuery,
  useGetProductsByShopIdQuery,
  useSearchProductsQuery,
  useGetAllProductCategoriesQuery,
} = customerProductApi;