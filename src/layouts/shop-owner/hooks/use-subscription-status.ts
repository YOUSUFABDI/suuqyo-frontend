import { useUser } from 'src/sections/auth/hooks';
import { useGetSubscriptionStatusQuery } from 'src/store/shop-owner/subscription';
import { isSuccessResponse } from 'src/utils/is-success-res';
import { SubscriptionStatusResDT } from '../types/types';

export const useSubscriptionStatus = () => {
  const { user } = useUser();

  const { data, isLoading, isError, isSuccess, isFetching } = useGetSubscriptionStatusQuery(
    undefined,
    {
      skip: user?.role !== 'SHOP_OWNER',
      pollingInterval: 3000, // Refresh every 3 seconds
      refetchOnMountOrArgChange: true,
    }
  );
  const res = isSuccessResponse<SubscriptionStatusResDT>(data) ? data.payload.data : null;
  // console.log('res', res);

  const isExpired = res?.isExpired;
  // const isExpired = true;
  const remainingDays = res?.remainingDays;
  // const remainingDays = 1;
  const showWarning = remainingDays && remainingDays <= 10;

  return {
    loading: isLoading || isFetching,
    isExpired,
    remainingDays,
    showWarning,
    isError,
    isSuccess,
    data,
  };
};
