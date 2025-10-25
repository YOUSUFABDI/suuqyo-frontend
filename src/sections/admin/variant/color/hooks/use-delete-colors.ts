'use client';

import { useDeleteManyColorsMutation } from 'src/store/admin/variant';

export const UseDeleteColors = () => {
  const [deleteManyColors, { isLoading: areDeleting }] = useDeleteManyColorsMutation();

  return { deleteManyColors, areDeleting };
};
