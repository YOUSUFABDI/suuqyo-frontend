import { useGetOneProductCategoryQuery } from 'src/store/admin/category';
import { isSuccessResponse } from 'src/utils/is-success-res';
import { ProductCategoryDT } from '../types/types';

export const UseOneProductCategory = (id: number) => {
  const { data, error, isLoading } = useGetOneProductCategoryQuery({ id });

  const oneProductCategory = isSuccessResponse<ProductCategoryDT>(data) ? data.payload.data : null;

  return { oneProductCategory, error, isLoading };
};
