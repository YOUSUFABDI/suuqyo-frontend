// 2. UPDATED CUSTOM HOOK

import { useGetOrderHistoryQuery } from 'src/store/customer/order';
import { getErrorMessage } from 'src/utils/error.message';
import { isSuccessResponse } from 'src/utils/is-success-res';
import { OrderHistoryDT } from '../types/types';

// This hook now correctly uses the OrderHistoryDT type.
export const UseOrderHistory = () => {
  const { data, error, isLoading } = useGetOrderHistoryQuery();

  // Ensure the hook returns the correctly typed data or null
  const orderHistory: OrderHistoryDT[] | null = isSuccessResponse(data) ? data.payload.data : null;
  const errorMessage = error ? getErrorMessage(error) : null;

  return { orderHistory, errorMessage, isLoading };
};
