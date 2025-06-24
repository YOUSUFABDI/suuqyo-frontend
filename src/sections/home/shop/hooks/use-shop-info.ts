'use client';

import { useGetShopInfoQuery } from 'src/store/customer/shop';
import { isSuccessResponse } from 'src/utils/is-success-res';
import { ShopInfoDT } from '../types/types';
import { getErrorMessage } from 'src/utils/error.message';

export const useShopInfo = (shopName: string) => {
  const { data, error, isLoading } = useGetShopInfoQuery(shopName);
  // console.log('data', data);

  const shop = isSuccessResponse<ShopInfoDT>(data) ? data.payload.data : null;
  const errorMessage = error ? getErrorMessage(error) : null;

  return { shop, isLoading, errorMessage };
};
