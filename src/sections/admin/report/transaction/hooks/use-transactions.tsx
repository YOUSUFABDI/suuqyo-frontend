'use client';

import { useGetTransactionsQuery } from 'src/store/admin/report';
import { isSuccessResponse } from 'src/utils/is-success-res';
import { getErrorMessage } from 'src/utils/error.message';
import { SubscriptionTransactionResDT } from '../types/transaction';

export const UseTransactions = () => {
  const { data, error, isLoading } = useGetTransactionsQuery();

  const transactions = isSuccessResponse<SubscriptionTransactionResDT[]>(data)
    ? data.payload.data
    : [];
  const errorMessage = error ? getErrorMessage(error) : null;

  return { transactions, errorMessage, isLoading };
};
