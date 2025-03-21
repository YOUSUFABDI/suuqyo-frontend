'use client';

import { useGetSubscriptionRenewalsQuery } from 'src/store/admin/report';
import { isSuccessResponse } from 'src/utils/is-success-res';
import { getErrorMessage } from 'src/utils/error.message';
import { SubscriptionRenewalResDT } from '../types/subscription-renewal';

export const UseSubscriptionRenewals = () => {
  const { data, error, isLoading, refetch } = useGetSubscriptionRenewalsQuery();

  const subscriptionRenewals = isSuccessResponse<SubscriptionRenewalResDT[]>(data)
    ? data.payload.data
    : [];
  const errorMessage = error ? getErrorMessage(error) : null;

  return { subscriptionRenewals, refetch, errorMessage, isLoading };
};
