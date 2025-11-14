'use client';

import { useShopOwnerNotificationsQuery } from 'src/store/public/notification';
import { isSuccessResponse } from 'src/utils/is-success-res';
import { NotificationDT } from '../types/types';

export const useShopOwnerNotifications = (id: number) => {
  const {
    data,
    error,
    isLoading,
    refetch: refetchShopOwnerNotifications,
  } = useShopOwnerNotificationsQuery({ id });

  const shopOwnerNotifications = isSuccessResponse<NotificationDT[]>(data) ? data.payload.data : [];
  // console.log('shopOwnerNotifications', shopOwnerNotifications);

  return { shopOwnerNotifications, isLoading, error, refetchShopOwnerNotifications };
};
