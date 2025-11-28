'use client';

import { useGetOrderStatusQuery } from 'src/store/admin/shop-owner';
import { getErrorMessage } from 'src/utils/error.message';
import { isSuccessResponse } from 'src/utils/is-success-res';
import { OneOrderStatusDT } from '../types/types';

export const UseOrderStatus = (id: number) => {
  const { data, isLoading, error } = useGetOrderStatusQuery({ id });

  const OneOrderStatus = isSuccessResponse<OneOrderStatusDT>(data) ? data.payload.data : null;
  const errorMessage = error ? getErrorMessage(error) : null;

  return { OneOrderStatus, errorMessage };
};
