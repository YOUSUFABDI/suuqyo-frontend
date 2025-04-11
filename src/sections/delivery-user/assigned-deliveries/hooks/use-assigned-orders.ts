'use client';

import { useGetAssignedOrdersQuery } from 'src/store/delivery-user/delivery-user';
import { getErrorMessage } from 'src/utils/error.message';
import { isSuccessResponse } from 'src/utils/is-success-res';
import { AssignedOrderDTRes } from '../types/types';

export const UseAssignedOrders = () => {
  const { data, error, isLoading, refetch: refetchAssignedOrders } = useGetAssignedOrdersQuery();

  const assignedOrders = isSuccessResponse<AssignedOrderDTRes[]>(data) ? data.payload.data : [];
  const errorMessage = error ? getErrorMessage(error) : null;

  return { assignedOrders, errorMessage, isLoading, refetchAssignedOrders };
};
