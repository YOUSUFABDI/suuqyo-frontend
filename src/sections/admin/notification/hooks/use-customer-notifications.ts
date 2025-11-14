'use client';

import { useCustomerNotificationsQuery } from 'src/store/public/notification';
import { isSuccessResponse } from 'src/utils/is-success-res';
import { NotificationDT } from '../types/types';

export const useCustomerNotifications = (id: number) => {
  const {
    data,
    error,
    isLoading,
    refetch: refetchcustomerNotifications,
  } = useCustomerNotificationsQuery({ id });

  const customerNotifications = isSuccessResponse<NotificationDT[]>(data) ? data.payload.data : [];
  // console.log('customerNotifications', customerNotifications);

  return { customerNotifications, isLoading, error, refetchcustomerNotifications };
};
