'use client';

import { useMoveToTrashManyProductsMutation } from 'src/store/shop-owner/product';

export const UseMoveToTrashManyProducts = () => {
  const [moveToTrashManyProducts, { isLoading: areMovingToTrash }] =
    useMoveToTrashManyProductsMutation();

  return { moveToTrashManyProducts, areMovingToTrash };
};
