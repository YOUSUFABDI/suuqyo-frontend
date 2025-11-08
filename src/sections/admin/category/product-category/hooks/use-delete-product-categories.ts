'use client';

import { useDeleteManyProductCategoriesMutation } from 'src/store/admin/category';

export const UseDeleteProductCategories = () => {
  const [deleteManyProductCategories, { isLoading: areDeleting }] =
    useDeleteManyProductCategoriesMutation();

  return { deleteManyProductCategories, areDeleting };
};
