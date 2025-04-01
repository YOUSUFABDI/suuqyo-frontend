'use client';

import { useGetDeliveryUsersQuery } from 'src/store/shop-owner/delivery-user';
import { isSuccessResponse } from 'src/utils/is-success-res';
import { DeliveryUserResDT } from '../types/types';
import { getErrorMessage } from 'src/utils/error.message';

export const UseDeliveryUsers = () => {
  const { data, error, isLoading } = useGetDeliveryUsersQuery();

  const deliveryUsers = isSuccessResponse<DeliveryUserResDT[]>(data) ? data.payload.data : [];
  const errorMessage = error ? getErrorMessage(error) : null;

  return { deliveryUsers, isLoading, errorMessage };
};
