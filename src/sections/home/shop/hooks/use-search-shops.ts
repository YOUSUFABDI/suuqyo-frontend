import { useSearchShopsQuery } from 'src/store/customer/shop';
import { isSuccessResponse } from 'src/utils/is-success-res';
import { ShopInfoDT } from '../types/types';

export function useSearchShops(query: string) {
  // Use the backend search API instead of client-side filtering
  const { data, error, isLoading } = useSearchShopsQuery(
    { query, page: 1, limit: 10 },
    { skip: !query || query.trim().length === 0 }
  );

  // Extract shops from the API response
  let searchResults: ShopInfoDT['shop'][] = [];

  if (data) {
    const isSuccess = isSuccessResponse(data);

    if (isSuccess && data.payload && 'data' in data.payload) {
      if (Array.isArray(data.payload.data.data)) {
        searchResults = data.payload.data.data;
      }
    }
  }

  return { searchResults, searchLoading: isLoading };
}