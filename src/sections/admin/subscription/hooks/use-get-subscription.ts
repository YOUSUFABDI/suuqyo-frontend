'use client';

import { SubscriptionResDT } from 'src/sections/admin/subscription/types/subscription';
import { useGetOneSubscriptionQuery } from 'src/store/admin/subscription';
import { isSuccessResponse } from 'src/utils/is-success-res';
import { getErrorMessage } from 'src/utils/error.message';

export const useSubscription = (id: number) => {
  const { data, isLoading: susbIsloading, error } = useGetOneSubscriptionQuery(id);

  const subscription = isSuccessResponse<SubscriptionResDT>(data) ? data.payload.data : null;
  const errorMessage = error ? getErrorMessage(error) : null;

  return { subscription, errorMessage, susbIsloading };
};
