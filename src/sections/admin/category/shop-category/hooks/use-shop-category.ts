import { useGetOneShopCategoryQuery } from 'src/store/admin/category';
import { isSuccessResponse } from 'src/utils/is-success-res';
import { ShopCategoryDT } from '../types/types';

export const UseOneShopCategory = (id: number) => {
  const { data, error, isLoading } = useGetOneShopCategoryQuery({ id });

  const oneColor = isSuccessResponse<ShopCategoryDT>(data) ? data.payload.data : null;

  return { oneColor, error, isLoading };
};
