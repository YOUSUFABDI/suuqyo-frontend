'use client';

import { useGetAllProductCategoryQuery } from 'src/store/admin/category';
import { isSuccessResponse } from 'src/utils/is-success-res';
import { ProductCategoryDT } from '../types/types';

export const UseProductCategories = () => {
  const { data, error, isLoading, refetch: refetchShopowners } = useGetAllProductCategoryQuery();

  const productCategories = isSuccessResponse<ProductCategoryDT[]>(data) ? data.payload.data : [];
  // console.log('productCategories', productCategories);

  return { productCategories, isLoading, error, refetchShopowners };
};
