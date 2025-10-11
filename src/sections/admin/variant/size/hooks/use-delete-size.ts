'use client';

import { useDeleteOneSizeMutation } from 'src/store/admin/variant';

export const UseDeleteSize = () => {
  const [deleteOneSize, { isLoading: isDeleting }] = useDeleteOneSizeMutation();

  return { deleteOneSize, isDeleting };
};
