'use client';

import { useShopsQuery } from 'src/store/customer/shop';
import { getErrorMessage } from 'src/utils/error.message';
import { isSuccessResponse } from 'src/utils/is-success-res';
import { ShopInfoDT } from '../types/types';

export const UseShops = () => {
  const { data, error, isLoading } = useShopsQuery(undefined, {
    // skip: user?.role !== 'SHOP_OWNER',
    pollingInterval: 3000, // Refresh every 3 seconds
    refetchOnMountOrArgChange: true,
  });

  const shops = isSuccessResponse<ShopInfoDT['shop'][]>(data) ? data.payload.data : [];
  const errorMessage = error ? getErrorMessage(error) : null;

  return { shops, isLoading, errorMessage };
};
