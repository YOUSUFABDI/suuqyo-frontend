import { useGetTrashProductsQuery } from 'src/store/shop-owner/product';
import { isSuccessResponse } from 'src/utils/is-success-res';
import { ProductResDT } from '../types/types';
import { getErrorMessage } from 'src/utils/error.message';

export const UseTrashProducts = () => {
  const { data, error, isLoading } = useGetTrashProductsQuery();

  const trashProducts = isSuccessResponse<ProductResDT[]>(data) ? data.payload.data : [];
  const errorMessage = error ? getErrorMessage(error) : null;

  return { trashProducts, errorMessage, isLoading };
};
