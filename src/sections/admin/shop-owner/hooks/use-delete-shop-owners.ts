'use client';

import { useDeleteShopOwnersMutation } from 'src/store/admin/shop-owner';

export const UseDeleteShopOwners = () => {
  const [deleteShopOwners, { isLoading: areDeleting }] = useDeleteShopOwnersMutation();

  return { deleteShopOwners, areDeleting };
};
