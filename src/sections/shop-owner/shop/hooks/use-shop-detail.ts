'use client';

import { useGetShopDetailQuery } from 'src/store/shop-owner/shopApi';
import { isSuccessResponse } from 'src/utils/is-success-res';
import { ShopDT } from '../types/types';

export const UseShopDetail = () => {
  const { data, error, isLoading } = useGetShopDetailQuery();

  const shopDetail = isSuccessResponse<ShopDT>(data) ? data.payload.data : null;

  return { shopDetail, isLoading, error };
};
