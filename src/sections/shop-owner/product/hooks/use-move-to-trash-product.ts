'use client';

import { useMoveToTrashMutation } from 'src/store/shop-owner/product';

export const UseMoveToTrash = () => {
  const [moveToTrash, { isLoading: isDeleting }] = useMoveToTrashMutation();

  return { moveToTrash, isDeleting };
};
