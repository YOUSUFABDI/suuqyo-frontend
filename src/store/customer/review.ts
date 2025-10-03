import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API } from '../api';
import { ApiResponseDT } from 'src/types/api-response';

// Define types
export type Review = {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  comment: string;
  helpful: number;
  isPurchased: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    fullName: string;
    profileImage: string;
  };
};

export type CreateReviewDto = {
  productId: number;
  userId: number;
  rating: number;
  comment: string;
  isPurchased: boolean;
};

export type ReviewStats = {
  totalRatings: number;
  totalReviews: number;
  ratings: {
    name: string;
    starCount: number;
    reviewCount: number;
  }[];
};

export type PaginatedReviews = {
  result: number;
  data: Review[];
  total: number;
  page: number;
  limit: number;
};

export const customerReviewApi = createApi({
  reducerPath: 'customerReview',
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
  tagTypes: ['Review'],
  endpoints: (builder) => ({
    // Create a new review
    createReview: builder.mutation<ApiResponseDT<Review>, CreateReviewDto>({
      query: (reviewData) => ({
        url: '/customer-review/create',
        method: 'POST',
        body: reviewData,
      }),
      invalidatesTags: ['Review'],
    }),
    
    // Get reviews for a product
    getProductReviews: builder.query<
      ApiResponseDT<PaginatedReviews>,
      { productId: number; page?: number; limit?: number }
    >({
      query: ({ productId, page = 1, limit = 10 }) => ({
        url: `/customer-review/product/${productId}?page=${page}&limit=${limit}`,
        method: 'GET',
      }),
      providesTags: ['Review'],
    }),
    
    // Get review statistics for a product
    getReviewStats: builder.query<ApiResponseDT<ReviewStats>, number>({
      query: (productId) => ({
        url: `/customer-review/stats/${productId}`,
        method: 'GET',
      }),
      providesTags: ['Review'],
    }),
  }),
});

export const {
  useCreateReviewMutation,
  useGetProductReviewsQuery,
  useGetReviewStatsQuery,
} = customerReviewApi;