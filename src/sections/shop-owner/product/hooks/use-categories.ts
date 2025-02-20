import { useGetProductCategoriesQuery } from 'src/store/shop-owner/product';
import { isSuccessResponse } from 'src/utils/is-success-res';
import { CategoryDT } from '../types/types';
import { getErrorMessage } from 'src/utils/error.message';

export const UseCategories = () => {
  const { data, error, isLoading } = useGetProductCategoriesQuery();

  const categories = isSuccessResponse<CategoryDT[]>(data) ? data.payload.data : [];
  const errorMessage = error ? getErrorMessage(error) : null;

  return { categories, errorMessage, isLoading };
};
