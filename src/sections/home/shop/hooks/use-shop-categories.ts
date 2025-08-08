import { useGetAllShopCategoriesQuery } from 'src/store/customer/shop';
import { getErrorMessage } from 'src/utils/error.message';
import { isSuccessResponse } from 'src/utils/is-success-res';

export const useShopCategories = () => {
  const { data, isLoading, error } = useGetAllShopCategoriesQuery();
  const shopCategories = isSuccessResponse<string[]>(data) ? data.payload.data : [];
  const errorMessage = error ? getErrorMessage(error) : null;

  return { shopCategories, errorMessage, isLoading };
};
