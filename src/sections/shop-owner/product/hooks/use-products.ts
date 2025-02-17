import { useGetProductsQuery } from 'src/store/shop-owner/product';
import { isSuccessResponse } from 'src/utils/is-success-res';
import { ProductResDT } from '../types/types';
import { getErrorMessage } from 'src/utils/error.message';

export const UseProducts = () => {
  const { data, error, isLoading } = useGetProductsQuery();

  const products = isSuccessResponse<ProductResDT[]>(data) ? data.payload.data : [];
  const errorMessage = error ? getErrorMessage(error) : null;

  return { products, errorMessage, isLoading };
};
