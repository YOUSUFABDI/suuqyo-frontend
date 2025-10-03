'use client';

import { useShopsQuery } from 'src/store/customer/shop';
import { getErrorMessage } from 'src/utils/error.message';
import { isSuccessResponse } from 'src/utils/is-success-res';
import { ShopInfoDT } from '../types/types';

export const UseShops = () => {
  const { data, error, isLoading } = useShopsQuery({
    page: 1,
    limit: 12,
  }, {
    // skip: user?.role !== 'SHOP_OWNER',
    pollingInterval: 3000, // Refresh every 3 seconds
    refetchOnMountOrArgChange: true,
  });

  const shops = isSuccessResponse(data) && data.payload && 'data' in data.payload && data.payload.data ? data.payload.data.data : [];
  const errorMessage = error ? getErrorMessage(error) : null;

  return { shops, isLoading, errorMessage };
};