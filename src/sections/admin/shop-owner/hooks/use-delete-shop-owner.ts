'use client';

import { useDeleteShopOwnerMutation } from 'src/store/admin/shop-owner';

export const UseDeleteShopOwner = () => {
  const [deleteShopOwner, { isLoading: isDeleting }] = useDeleteShopOwnerMutation();

  return { deleteShopOwner, isDeleting };
};
