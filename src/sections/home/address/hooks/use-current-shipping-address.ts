'use client';

import { isSuccessResponse } from 'src/utils/is-success-res';
import { AddressDT } from '../types/types';
import { useGetCurrentShippingAddressQuery } from 'src/store/customer/order';

export const useCurrentShippingAddress = () => {
  const { data, error, isLoading, refetch } = useGetCurrentShippingAddressQuery();

  const currentShippingAddress = isSuccessResponse<AddressDT>(data) ? data.payload.data : null;

  return { currentShippingAddress, isLoading, error, refetch };
};
