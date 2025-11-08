'use client';

import { useDeleteOneShopCategoryMutation } from 'src/store/admin/category';

export const UseDeleteOneShopCategory = () => {
  const [deleteOneShopCategory, { isLoading: isDeleting }] = useDeleteOneShopCategoryMutation();

  return { deleteOneShopCategory, isDeleting };
};
