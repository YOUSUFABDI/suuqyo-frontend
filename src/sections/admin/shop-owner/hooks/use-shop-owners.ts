'use client';

import { useGetAllShopOwnersQuery } from 'src/store/admin/shop-owner';

export const UseShopOwners = () => {
  const { data, error, isLoading, refetch: refetchShopowners } = useGetAllShopOwnersQuery();

  const shopOwners = data?.payload?.data?.shopOwners ?? [];

  return { shopOwners, isLoading, error, refetchShopowners };
};
