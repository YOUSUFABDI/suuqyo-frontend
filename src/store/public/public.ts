import { createApi } from '@reduxjs/toolkit/query/react';
import { ContactReqDT } from 'src/sections/home/contact/types/types';
import { baseQueryWithReauth } from 'src/utils/base-query-with-re-auth';

export const contactApi = createApi({
  reducerPath: 'contactApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['contact'],
  endpoints: (builder) => ({
    contactUs: builder.mutation<any, ContactReqDT>({
      query: (body) => ({
        url: '/contact',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['contact'],
    }),
  }),
});

export const { useContactUsMutation } = contactApi;
