'use client';

import { useDeleteProductMutation } from 'src/store/shop-owner/product';

export const UseDeleteProduct = () => {
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  return { deleteProduct, isDeleting };
};
