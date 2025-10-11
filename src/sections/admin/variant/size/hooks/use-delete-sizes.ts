'use client';

import { useDeleteManySizesMutation } from 'src/store/admin/variant';

export const UseDeleteSizes = () => {
  const [deleteManySizes, { isLoading: areDeleting }] = useDeleteManySizesMutation();

  return { deleteManySizes, areDeleting };
};
