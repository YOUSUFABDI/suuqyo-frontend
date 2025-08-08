import { useGetAllProductsQuery } from 'src/store/customer/product';
import { isSuccessResponse } from 'src/utils/is-success-res';
import { ProductResponse } from '../types/types';

export const useAllProduct = () => {
  const { data, error, isLoading } = useGetAllProductsQuery(undefined, {
    // skip: user?.role !== 'SHOP_OWNER',
    pollingInterval: 3000, // Refresh every 3 seconds
    refetchOnMountOrArgChange: true,
  });

  const products = isSuccessResponse<ProductResponse[]>(data) ? data.payload.data : [];

  return { products, error, isLoading };
};
