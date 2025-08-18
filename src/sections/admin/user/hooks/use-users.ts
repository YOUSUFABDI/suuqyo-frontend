'use client';

import { useGetAllUsersQuery } from 'src/store/admin/user';

export const UseUsers = () => {
  const { data, error, isLoading, refetch: refetchShopowners } = useGetAllUsersQuery();
  // console.log('data', data);

  const users = data?.payload?.data?.users ?? [];

  return { users, isLoading, error, refetchShopowners };
};
