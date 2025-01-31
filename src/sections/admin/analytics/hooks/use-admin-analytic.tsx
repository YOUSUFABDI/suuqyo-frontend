import { useGetAdminAnalyticQuery } from 'src/store/admin/analytic';
import { isSuccessResponse } from 'src/utils/is-success-res';
import { AdminAnalyticsResDT } from '../types/types';
import { getErrorMessage } from 'src/utils/error.message';

export const UseAdminAnalytic = () => {
  const { data, error, isLoading } = useGetAdminAnalyticQuery();

  const adminAnalytic = isSuccessResponse<AdminAnalyticsResDT>(data) ? data.payload.data : null;
  const errorMessage = error ? getErrorMessage(error) : null;

  return { adminAnalytic, errorMessage, isLoading };
};
