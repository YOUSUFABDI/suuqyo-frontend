'use client';

import { useDeleteProductsMutation } from 'src/store/shop-owner/product';

export const UseDeleteProducts = () => {
  const [deleteProducts, { isLoading: areDeleting }] = useDeleteProductsMutation();

  return { deleteProducts, areDeleting };
};
