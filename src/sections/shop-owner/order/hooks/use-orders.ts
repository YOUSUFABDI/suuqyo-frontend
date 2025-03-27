'use client';

import { useGetOrdersQuery } from 'src/store/shop-owner/order';
import { getErrorMessage } from 'src/utils/error.message';
import { isSuccessResponse } from 'src/utils/is-success-res';
import { OrderResDT } from '../types/types';

export const UseOrders = () => {
  const { data, error, isLoading } = useGetOrdersQuery();

  const orders = isSuccessResponse<OrderResDT[]>(data) ? data.payload.data : [];
  const errorMessage = error ? getErrorMessage(error) : null;

  return { orders, errorMessage, isLoading };
};
