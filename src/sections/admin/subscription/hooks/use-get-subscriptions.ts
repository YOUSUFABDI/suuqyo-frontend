'use client';

import { useGetSubscriptionsQuery } from 'src/store/admin/subscription';
import { isSuccessResponse } from 'src/utils/is-success-res';
import { SubscriptionResDT } from 'src/sections/admin/subscription/types/subscription';
import { getErrorMessage } from 'src/utils/error.message';

export const useSubscriptions = () => {
  const { data, error, isLoading, refetch } = useGetSubscriptionsQuery();

  const subscriptions = isSuccessResponse<SubscriptionResDT[]>(data) ? data.payload.data : [];
  const errorMessage = error ? getErrorMessage(error) : null;

  return { subscriptions, refetch, errorMessage, isLoading };
};
