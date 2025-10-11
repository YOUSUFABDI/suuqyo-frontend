'use client';

import { useGetAllOrderStatusOfShopOwnersQuery } from 'src/store/admin/shop-owner';
import { getErrorMessage } from 'src/utils/error.message';
import { isSuccessResponse } from 'src/utils/is-success-res';
import { OrderStatusDT } from '../types/types';

export const UseAllOrderStatus = () => {
  const {
    data,
    error,
    isLoading,
    refetch: refetchOrders,
  } = useGetAllOrderStatusOfShopOwnersQuery(undefined, {
    pollingInterval: 2000, // Refresh every 2 seconds
    refetchOnMountOrArgChange: true,
  });

  const allOrderStatus = isSuccessResponse<OrderStatusDT[]>(data) ? data.payload.data : [];
  console.log('allOrderStatus', allOrderStatus);
  const errorMessage = error ? getErrorMessage(error) : null;

  return { allOrderStatus, errorMessage, isLoading, refetchOrders };
};
