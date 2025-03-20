'use client';

import { useDeleteDeliveryUserMutation } from 'src/store/shop-owner/delivery-user';

export const UseDeleteDeliveryUser = () => {
  const [deleteDeliveryUser, { isLoading: isDeleting }] = useDeleteDeliveryUserMutation();

  return { deleteDeliveryUser, isDeleting };
};
