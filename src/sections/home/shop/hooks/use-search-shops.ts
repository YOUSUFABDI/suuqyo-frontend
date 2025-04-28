import { useDebounce } from 'minimal-shared/hooks';
import { UseShops } from './use-shops';
import { useMemo } from 'react';

export function useSearchShops(query: string) {
  const { shops } = UseShops();

  const debouncedQuery = useDebounce(query, 500);

  const searchResults = useMemo(() => {
    if (!debouncedQuery.trim()) return shops;

    return shops.filter(
      (shop) =>
        shop.shopName.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        shop.shopDescription.toLowerCase().includes(debouncedQuery.toLowerCase())
    );
  }, [shops, debouncedQuery]);

  return { searchResults, searchLoading: false };
}
