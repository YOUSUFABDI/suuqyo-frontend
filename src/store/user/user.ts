import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API } from '../api';

export const userApi = createApi({
  reducerPath: 'userApi',
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
  tagTypes: ['userApi'],
  endpoints: (builder) => ({
    updateUser: builder.mutation<any, { id: number; formData: FormData }>({
      query: ({ id, formData }) => {
        return {
          url: `/user/update-user/${id}`,
          method: 'PATCH',
          body: formData,
        };
      },
      invalidatesTags: ['userApi'],
    }),
  }),
});

export const { useUpdateUserMutation } = userApi;
