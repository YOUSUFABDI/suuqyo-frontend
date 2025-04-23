'use client';

import { getErrorMessage } from 'src/utils/error.message';
import { isSuccessResponse } from 'src/utils/is-success-res';
import { DeliveryUserResDT } from '../types/types';
import { useGetActiveDeliveryUsersQuery } from 'src/store/shop-owner/order';

export const UseActiveDeliveryUsers = () => {
  const { data, error, isLoading } = useGetActiveDeliveryUsersQuery();

  const deliveryUsers = isSuccessResponse<DeliveryUserResDT[]>(data) ? data.payload.data : [];
  const errorMessage = error ? getErrorMessage(error) : null;

  return { deliveryUsers, isLoading, errorMessage };
};
