import { useSearchProductsQuery } from 'src/store/customer/product';
import { isSuccessResponse } from 'src/utils/is-success-res';
import { PaginatedProductsPayload } from 'src/types/product';
import { ProductResponse } from '../types/types';

export function useSearchProduct(query: string) {
  // Use the backend search API instead of client-side filtering
  const { data, error, isLoading } = useSearchProductsQuery(
    { q: query, page: 1, limit: 10 },
    { skip: !query || query.trim().length === 0 }
  );

  // Add detailed debugging
  // console.log('=== SEARCH HOOK DEBUG ===');
  // console.log('Query:', query);
  // console.log('Skip condition:', !query || query.trim().length === 0);
  // console.log('Raw data:', data);
  // console.log('Loading:', isLoading);
  // console.log('Error:', error);

  // Extract products from the API response
  let searchResults: ProductResponse[] = [];

  if (data) {
    // console.log('Data exists, checking if success response...');
    const isSuccess = isSuccessResponse<PaginatedProductsPayload>(data);
    // console.log('Is success response:', isSuccess);

    if (isSuccess) {
      // console.log('Payload:', data.payload);
      if (data.payload && 'data' in data.payload) {
        // console.log('Payload data:', data.payload.data);
        if (Array.isArray(data.payload.data.data)) {
          // Convert product IDs to strings to match the expected type
          searchResults = data.payload.data.data.map((item) => ({
            product: {
              ...item.product,
              id: String(item.product.id),
            },
          }));
          // console.log('Search results set, count:', searchResults.length);
        } else {
          // console.log('Payload data.data is not an array');
        }
      } else {
        // console.log('No data property in payload');
      }
    } else {
      // console.log('Not a success response');
    }
  } else {
    // console.log('No data received');
  }

  // console.log('Final search results:', searchResults);
  return { searchResults, searchLoading: isLoading };
}
