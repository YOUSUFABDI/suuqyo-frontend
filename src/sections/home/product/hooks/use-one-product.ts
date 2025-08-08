import { useGetOneProductByIdQuery } from 'src/store/customer/product';
import { isSuccessResponse } from 'src/utils/is-success-res';
import { ProductResponse } from '../types/types';

export const useOneProduct = (id: number) => {
  const { data, error, isLoading } = useGetOneProductByIdQuery(
    { id },
    {
      pollingInterval: 3000, // Refresh every 3 seconds
      refetchOnMountOrArgChange: true,
    }
  );

  const product = isSuccessResponse<ProductResponse>(data) ? data.payload.data : null;

  return { product, error, isLoading };
};
