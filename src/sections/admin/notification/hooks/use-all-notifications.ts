'use client';

import { useGetAllNotificationsQuery } from 'src/store/public/notification';
import { isSuccessResponse } from 'src/utils/is-success-res';
import { AllNotificationDT } from '../types/types';

export const useAllNotifications = () => {
  const {
    data,
    error,
    isLoading,
    refetch: refetchAllNotifications,
  } = useGetAllNotificationsQuery();

  const allNotifications = isSuccessResponse<AllNotificationDT[]>(data) ? data.payload.data : [];
  // console.log('allNotifications', allNotifications);

  return { allNotifications, isLoading, error, refetchAllNotifications };
};
