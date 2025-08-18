'use client';

import { useDeleteUserMutation } from 'src/store/admin/user';

export const UseDeleteUser = () => {
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  return { deleteUser, isDeleting };
};
