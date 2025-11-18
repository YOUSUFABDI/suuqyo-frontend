import { useGetOrderHistoryQuery } from 'src/store/customer/order';
import { getErrorMessage } from 'src/utils/error.message';
import { isSuccessResponse } from 'src/utils/is-success-res';
import { IOrderHistory } from '../types/types';

export const UseOrderHistory = () => {
  const { data, error, isLoading } = useGetOrderHistoryQuery();

  const orderHistory: IOrderHistory[] | null = isSuccessResponse(data)
    ? (data.payload.data as IOrderHistory[])
    : null;

  const errorMessage = error ? getErrorMessage(error) : null;

  return { orderHistory, errorMessage, isLoading };
};
