import { useGetAllProductsQuery } from 'src/store/customer/product';
import { isSuccessResponse } from 'src/utils/is-success-res';
import { ProductResponse } from '../types/types';

export const useAllProduct = () => {
  const { data, error, isLoading } = useGetAllProductsQuery();

  const products = isSuccessResponse<ProductResponse[]>(data) ? data.payload.data : [];

  return { products, error, isLoading };
};
