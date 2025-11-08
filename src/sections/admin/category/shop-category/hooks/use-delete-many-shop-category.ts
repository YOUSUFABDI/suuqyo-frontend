'use client';

import { useDeleteManyShopCategoriesMutation } from 'src/store/admin/category';

export const UseDeleteManyShopCategory = () => {
  const [deleteManyShopCategories, { isLoading: areDeleting }] =
    useDeleteManyShopCategoriesMutation();

  return { deleteManyShopCategories, areDeleting };
};
