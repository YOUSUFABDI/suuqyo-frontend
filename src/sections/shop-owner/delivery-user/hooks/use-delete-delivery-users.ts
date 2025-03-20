'use client';

import { useDeleteDeliveryUsersMutation } from 'src/store/shop-owner/delivery-user';

export const UseDeleteDeliveryUsers = () => {
  const [deleteDeliveryUsers, { isLoading: areDeleting }] = useDeleteDeliveryUsersMutation();

  return { deleteDeliveryUsers, areDeleting };
};
