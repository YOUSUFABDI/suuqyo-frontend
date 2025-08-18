'use client';

import { useDeleteUsersMutation } from 'src/store/admin/user';

export const UseDeleteUsers = () => {
  const [deleteUsers, { isLoading: areDeleting }] = useDeleteUsersMutation();

  return { deleteUsers, areDeleting };
};
