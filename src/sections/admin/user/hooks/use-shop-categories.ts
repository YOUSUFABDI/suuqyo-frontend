import { isSuccessResponse } from 'src/utils/is-success-res';
import { ShopCategoryDT } from '../types/types';
import { getErrorMessage } from 'src/utils/error.message';
import { useGetShopCategoriesQuery } from 'src/store/admin/shop-owner';

export const UseShopCategories = () => {
  const { data, error, isLoading } = useGetShopCategoriesQuery();

  const shopCategories = isSuccessResponse<ShopCategoryDT[]>(data) ? data.payload.data : [];
  const errorMessage = error ? getErrorMessage(error) : null;

  return { shopCategories, errorMessage, isLoading };
};
