'use client';

import { useDeleteOneProductCategoryMutation } from 'src/store/admin/category';

export const UseDeleteOneProductCategory = () => {
  const [deleteOneProductCategory, { isLoading: isDeleting }] =
    useDeleteOneProductCategoryMutation();

  return { deleteOneProductCategory, isDeleting };
};
