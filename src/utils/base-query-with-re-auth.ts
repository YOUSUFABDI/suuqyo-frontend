import { BaseQueryFn, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { API } from 'src/store/api';

export const baseQueryWithReauth: BaseQueryFn<
  string | { url: string; method?: string; body?: any; params?: Record<string, any> },
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: API,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  });

  const result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    localStorage.clear();
    localStorage.removeItem('auth_token');
    localStorage.removeItem('role');

    const currentPath = window.location.pathname + window.location.search;
    window.location.href = `/auth/sign-in?returnTo=${encodeURIComponent(currentPath)}`;
  }

  return result;
};
