'use client';

import { useGetShopsQuery } from 'src/store/shop-owner/shopApi';
import { isSuccessResponse } from 'src/utils/is-success-res';
import { ShopDT } from '../types/types';

export const UseShops = () => {
  const { data, error, isLoading } = useGetShopsQuery();

  const shops = isSuccessResponse<ShopDT[]>(data) ? data.payload.data : [];

  return { shops, isLoading, error };
};
