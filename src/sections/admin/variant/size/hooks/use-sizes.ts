'use client';

import { useGetAllSizesQuery } from 'src/store/admin/variant';
import { SizeDT } from '../types/types';
import { isSuccessResponse } from 'src/utils/is-success-res';

export const UseSizes = () => {
  const { data, error, isLoading, refetch: refetchShopowners } = useGetAllSizesQuery();

  const sizes = isSuccessResponse<SizeDT[]>(data) ? data.payload.data : [];
  // console.log('sizes', sizes);

  return { sizes, isLoading, error, refetchShopowners };
};
