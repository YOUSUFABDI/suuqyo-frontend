
import { useGetAllProductsQuery } from 'src/store/customer/product';
import { isSuccessResponse } from 'src/utils/is-success-res';
import { PaginatedProductsPayload, UseAllProductParams } from 'src/types/product';

// Set default values in the parameter destructuring to prevent the TypeError
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 8; // Use 8 to match the infinite scroll implementation

type UseAllProductWithCategoryParams = UseAllProductParams & {
  category?: string;
};

export const useAllProduct = (
  { page, limit, category }: UseAllProductWithCategoryParams = {
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
  }
) => {
  const { data, error, isLoading } = useGetAllProductsQuery(
    // Ensure the query arguments are non-null
    { page: page || DEFAULT_PAGE, limit: limit || DEFAULT_LIMIT, category },
    {
      pollingInterval: 3000,
      refetchOnMountOrArgChange: true,
    }
  );

  const isSuccess = isSuccessResponse<PaginatedProductsPayload>(data);

  // Handle the actual backend response structure
  const products =
    isSuccess && data.payload && data.payload.data && data.payload.data.data
      ? data.payload.data.data
      : [];
  const total =
    isSuccess && data.payload && data.payload.data && data.payload.data.total !== undefined
      ? data.payload.data.total
      : 0;
  const currentPage =
    isSuccess && data.payload && data.payload.data && data.payload.data.page !== undefined
      ? data.payload.data.page
      : page || DEFAULT_PAGE;
  const currentLimit =
    isSuccess && data.payload && data.payload.data && data.payload.data.limit !== undefined
      ? data.payload.data.limit
      : limit || DEFAULT_LIMIT;

  return { products, total, page: currentPage, limit: currentLimit, error, isLoading };
};
