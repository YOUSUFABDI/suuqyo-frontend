import { useDebounce } from 'minimal-shared/hooks';
import { useAllProduct } from './use-all-product';
import { useMemo } from 'react';

export function useSearchProduct(query: string) {
  const { products } = useAllProduct();

  const debouncedQuery = useDebounce(query, 500);

  const searchResults = useMemo(() => {
    if (!debouncedQuery.trim()) return products;

    return products.filter(
      (product) =>
        product.product.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        product.product.description.toLowerCase().includes(debouncedQuery.toLowerCase())
    );
  }, [products, debouncedQuery]);

  return { searchResults, searchLoading: false };
}
