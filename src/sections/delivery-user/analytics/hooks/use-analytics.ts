import { useGetDeliveryUserAnalyticQuery } from 'src/store/delivery-user/delivery-user-analytic';
import { getErrorMessage } from 'src/utils/error.message';
import { isSuccessResponse } from 'src/utils/is-success-res';
import { DeliveryUserAnalyticsResDT } from '../types/types';

export const UseAnalytics = () => {
  const { data, isLoading, error, refetch } = useGetDeliveryUserAnalyticQuery();

  const analyticsData = isSuccessResponse<DeliveryUserAnalyticsResDT>(data)
    ? data.payload.data
    : null;
  const errorMessage = error ? getErrorMessage(error) : null;

  return { analyticsData, errorMessage, isLoading, refetchAnalytics: refetch };
};
