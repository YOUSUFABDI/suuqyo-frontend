import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API } from '../api';

export const adminApi = createApi({
  reducerPath: 'adminApi',
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
  tagTypes: ['adminApi'],
  endpoints: (builder) => ({
    updateAdmin: builder.mutation<any, { id: number; formData: FormData }>({
      query: ({ id, formData }) => {
        return {
          url: `user/update-admin/${id}`,
          method: 'PATCH',
          body: formData,
        };
      },
      invalidatesTags: ['adminApi'],
    }),
  }),
});

export const { useUpdateAdminMutation } = adminApi;
