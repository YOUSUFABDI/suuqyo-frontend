'use client';

import { useRestoreFromTrashMutation } from 'src/store/shop-owner/product';

export const UseRestoreFromTrash = () => {
  const [restoreFromTrash, { isLoading: isRestoring }] = useRestoreFromTrashMutation();

  return { restoreFromTrash, isRestoring };
};
