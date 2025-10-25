'use client';

import { useDeleteOneColorMutation } from 'src/store/admin/variant';

export const UseDeleteColor = () => {
  const [deleteOneColor, { isLoading: isDeleting }] = useDeleteOneColorMutation();

  return { deleteOneColor, isDeleting };
};
