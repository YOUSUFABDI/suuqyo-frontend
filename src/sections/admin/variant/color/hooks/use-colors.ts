'use client';

import { useGetAllColorsQuery } from 'src/store/admin/variant';
import { isSuccessResponse } from 'src/utils/is-success-res';
import { ColorDT } from '../types/types';

export const UseColors = () => {
  const { data, error, isLoading, refetch: refetchShopowners } = useGetAllColorsQuery();

  const colors = isSuccessResponse<ColorDT[]>(data) ? data.payload.data : [];
  // console.log('colors', colors);

  return { colors, isLoading, error, refetchShopowners };
};
