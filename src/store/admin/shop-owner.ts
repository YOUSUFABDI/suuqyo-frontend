import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';
import {
  GetAllShopOwnersResponseDT,
  RegisterShopOwnerResDT,
  ShopCategoryDT,
  ShopOwnerDT,
  UpdateShopOwnerResponseDT,
} from 'src/sections/admin/shop-owner/types/types';
import { ApiResponseDT } from 'src/types/api-response';
import { API } from '../api';
import { OneOrderStatusDT, OrderStatusDT } from 'src/sections/admin/order-status/types/types';

// Custom base query with retry logic for mobile devices and large files
const baseQueryWithRetry = retry(
  fetchBaseQuery({
    baseUrl: `${API}`,
    timeout: 1800000, // 30 minutes timeout for very large file uploads (1GB support)
    prepareHeaders: (headers) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
      }
      return headers;
    },
    fetchFn: async (input, init) => {
      // Custom fetch with better error handling for mobile and large files
      try {
        const response = await fetch(input, {
          ...init,
          // Remove keepalive for large files as it has size limits
          // keepalive: true,
        });
        return response;
      } catch (error: any) {
        console.error('Fetch error:', error);
        // Don't convert to NETWORK_ERROR immediately, let retry handle it
        throw error;
      }
    },
  }),
  {
    maxRetries: 5, // Retry up to 5 times for network errors
  }
);

export const shopOwnerApi = createApi({
  reducerPath: 'shopOwnerApi',
  baseQuery: baseQueryWithRetry,
  tagTypes: ['shopOwnerApi'],
  endpoints: (builder) => ({
    registerShopOwner: builder.mutation<RegisterShopOwnerResDT, FormData>({
      query: (formData) => {
        // Log file sizes for debugging
        const files = [];
        for (const [key, value] of formData.entries()) {
          if (value instanceof File) {
            files.push(`${key}: ${value.name} (${(value.size / 1024 / 1024).toFixed(2)}MB)`);
          }
        }
        // console.log('Uploading files:', files);

        return {
          url: '/admin-shop-owner/register-shop-owner',
          method: 'POST',
          body: formData,
          // Add headers to help with mobile uploads
          headers: {
            // Don't set Content-Type, let the browser set it with boundary for FormData
          },
        };
      },
      invalidatesTags: ['shopOwnerApi'],
      // Add transformation for better error messages
      transformErrorResponse: (response: any) => {
        console.error('Shop owner registration error:', response);

        // Handle different types of errors
        if (response.status === 'FETCH_ERROR') {
          return {
            status: response.status,
            data: {
              message: 'Network error. Please check your internet connection and try again.',
              originalError: response,
            },
          };
        }

        if (response.status === 413) {
          return {
            status: response.status,
            data: {
              message: 'File too large. Please use smaller images (max 10MB) and PDF (max 5MB).',
              originalError: response,
            },
          };
        }

        if (response.status >= 500) {
          return {
            status: response.status,
            data: {
              message: 'Server error. Please try again later.',
              originalError: response,
            },
          };
        }

        return response;
      },
    }),
    getAllShopOwners: builder.query<GetAllShopOwnersResponseDT, void>({
      query: () => ({
        url: '/admin-shop-owner/shop-owners',
        method: 'GET',
      }),
      providesTags: ['shopOwnerApi'],
    }),
    getOneShopOwner: builder.query<ApiResponseDT<ShopOwnerDT>, { id: number }>({
      query: ({ id }) => ({
        url: `/admin-shop-owner/shop-owner/${id}`,
        method: 'GET',
      }),
      providesTags: ['shopOwnerApi'],
    }),

    updateShopOwner: builder.mutation<
      UpdateShopOwnerResponseDT,
      { id: number; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/admin-shop-owner/update-shop-owner/${id}`,
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: ['shopOwnerApi'],
    }),

    deleteShopOwner: builder.mutation<void, number>({
      query: (userId) => ({
        url: `/admin-shop-owner/delete-shop-owner/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['shopOwnerApi'],
    }),

    deleteShopOwners: builder.mutation<void, number[]>({
      query: (userIds) => ({
        url: '/admin-shop-owner/delete-shop-owners',
        method: 'DELETE',
        body: { userIds },
      }),
      invalidatesTags: ['shopOwnerApi'],
    }),
    getShopCategories: builder.query<ApiResponseDT<ShopCategoryDT[]>, void>({
      query: () => ({
        url: '/admin-shop-owner/get-shop-categories',
        method: 'GET',
      }),
      providesTags: ['shopOwnerApi'],
    }),
    // get order status of shopowner
    getAllOrderStatusOfShopOwners: builder.query<ApiResponseDT<OrderStatusDT[]>, void>({
      query: () => ({
        url: '/admin-shop-owner/get-order-status',
        method: 'GET',
      }),
      providesTags: ['shopOwnerApi'],
    }),
    getOrderStatus: builder.query<ApiResponseDT<OneOrderStatusDT>, { id: number }>({
      query: ({ id }) => ({
        url: `/admin-shop-owner/get-order-status/${id}`,
        method: 'GET',
      }),
      providesTags: ['shopOwnerApi'],
    }),
    // get order status of shopowner
  }),
});

export const {
  useRegisterShopOwnerMutation,
  useGetAllShopOwnersQuery,
  useGetOneShopOwnerQuery,
  useUpdateShopOwnerMutation,
  useDeleteShopOwnerMutation,
  useDeleteShopOwnersMutation,
  useGetShopCategoriesQuery,

  // get order status of shopowner
  useGetAllOrderStatusOfShopOwnersQuery,
  useGetOrderStatusQuery,
  // get order status of shopowner
} = shopOwnerApi;
