import { useGetAllProductCategoriesQuery } from 'src/store/customer/product';
import { getErrorMessage } from 'src/utils/error.message';
import { isSuccessResponse } from 'src/utils/is-success-res';

export const useCategories = () => {
  const { data, isLoading, error } = useGetAllProductCategoriesQuery();
  const productCategories = isSuccessResponse<string[]>(data) ? data.payload.data : [];
  const errorMessage = error ? getErrorMessage(error) : null;

  return {
    productCategories,
    errorMessage,
    isLoading,
  };
};
