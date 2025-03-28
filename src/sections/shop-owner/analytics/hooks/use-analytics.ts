import { useGetShopOwnerAnalyticQuery } from 'src/store/shop-owner/shop-owner-analytics';
import { ShopOwnerAnalyticsResDT } from '../types/types';
import { isSuccessResponse } from 'src/utils/is-success-res';
import { getErrorMessage } from 'src/utils/error.message';

export const UseAnalytics = () => {
  const { data, isLoading, error, refetch } = useGetShopOwnerAnalyticQuery();

  const analyticsData = isSuccessResponse<ShopOwnerAnalyticsResDT>(data) ? data.payload.data : null;
  const errorMessage = error ? getErrorMessage(error) : null;

  return { analyticsData, errorMessage, isLoading, refetchAnalytics: refetch };
};
