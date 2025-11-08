'use client';

import { useGetAllShopCategoryQuery } from 'src/store/admin/category';
import { isSuccessResponse } from 'src/utils/is-success-res';
import { ShopCategoryDT } from '../types/types';

export const UseShopCategories = () => {
  const { data, error, isLoading, refetch: refetchShopowners } = useGetAllShopCategoryQuery();

  const shopCategories = isSuccessResponse<ShopCategoryDT[]>(data) ? data.payload.data : [];

  return { shopCategories, isLoading, error, refetchShopowners };
};
