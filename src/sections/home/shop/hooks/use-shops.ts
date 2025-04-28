'use client';

import { useShopsQuery } from 'src/store/customer/shop';
import { getErrorMessage } from 'src/utils/error.message';
import { isSuccessResponse } from 'src/utils/is-success-res';
import { ShopDT } from '../types/types';

export const UseShops = () => {
  const { data, error, isLoading } = useShopsQuery();

  const shops = isSuccessResponse<ShopDT[]>(data) ? data.payload.data : [];
  const errorMessage = error ? getErrorMessage(error) : null;

  return { shops, isLoading, errorMessage };
};
