import { useState, useEffect, useCallback } from 'react';
import { useGetProductsByShopIdQuery } from 'src/store/customer/product';
import { isSuccessResponse } from 'src/utils/is-success-res';
import { PaginatedProductsPayload } from 'src/types/product';
import { Product, ProductResponse } from 'src/sections/home/product/types/types';

const DEFAULT_LIMIT = 8;

interface UseShopProductsInfiniteParams {
  shopId: number;
  category?: string;
  limit?: number;
  sortBy?: string;
  minPrice?: number;
  maxPrice?: number;
}

export const useShopProductsInfinite = ({
  shopId,
  category,
  limit = DEFAULT_LIMIT,
  sortBy,
  minPrice,
  maxPrice,
}: UseShopProductsInfiniteParams) => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState<any>(null);
  const [currentCategory, setCurrentCategory] = useState<string | undefined>(category);
  const [currentSortBy, setCurrentSortBy] = useState<string | undefined>(sortBy);
  const [currentMinPrice, setCurrentMinPrice] = useState<number | undefined>(minPrice);
  const [currentMaxPrice, setCurrentMaxPrice] = useState<number | undefined>(maxPrice);

  // Update local state when props change
  useEffect(() => {
    setCurrentCategory(category);
  }, [category]);

  useEffect(() => {
    setCurrentSortBy(sortBy);
  }, [sortBy]);

  useEffect(() => {
    setCurrentMinPrice(minPrice);
  }, [minPrice]);

  useEffect(() => {
    setCurrentMaxPrice(maxPrice);
  }, [maxPrice]);

  // Fetch current page data
  const {
    data,
    isLoading: isCurrentLoading,
    error: currentError,
    refetch,
  } = useGetProductsByShopIdQuery(
    { 
      shopId,
      page: currentPage, 
      limit, 
      category: currentCategory,
      sortBy: currentSortBy,
      minPrice: currentMinPrice,
      maxPrice: currentMaxPrice
    },
    {
      skip: !shopId,
    }
  );

  // Reset pagination when filters change
  useEffect(() => {
    setAllProducts([]);
    setCurrentPage(1);
    setHasMore(true);
    setTotal(0);
    setIsLoading(true);
    setError(null);
  }, [shopId, currentCategory, currentSortBy, currentMinPrice, currentMaxPrice]);

  // Load more products
  const loadMore = useCallback(() => {
    if (!hasMore || isFetchingMore || isLoading) return;

    setIsFetchingMore(true);
    setCurrentPage((prev) => prev + 1);
  }, [hasMore, isFetchingMore, isLoading]);

  // Reset and fetch first page
  const reset = useCallback(() => {
    setAllProducts([]);
    setCurrentPage(1);
    setHasMore(true);
    setTotal(0);
    setIsLoading(true);
    setError(null);
  }, []);

  // Force refresh method
  const refresh = useCallback(() => {
    setAllProducts([]);
    setCurrentPage(1);
    setHasMore(true);
    setTotal(0);
    setIsLoading(true);
    setError(null);
    refetch();
  }, [refetch]);

  // Change category method
  const changeCategory = useCallback((newCategory?: string) => {
    setCurrentCategory(newCategory);
    setAllProducts([]);
    setCurrentPage(1);
    setHasMore(true);
    setTotal(0);
    setIsLoading(true);
    setError(null);
  }, []);

  // Process the fetched data
  useEffect(() => {
    if (data) {
      const isSuccess = isSuccessResponse<PaginatedProductsPayload>(data);

      if (isSuccess && data.payload && data.payload.data) {
        const {
          data: products,
          total: totalCount,
          page: fetchedPage,
          limit: fetchedLimit,
        } = data.payload.data;

        // Extract the product from ProductResponse
        const extractedProducts = products.map((productResponse: ProductResponse) => productResponse.product);

        setTotal(totalCount);

        if (fetchedPage === 1) {
          // First page, replace all products
          setAllProducts(extractedProducts);
        } else {
          // Subsequent pages, append to existing products
          setAllProducts((prev) => [...prev, ...extractedProducts]);
        }

        // Check if we have more pages
        const totalPages = Math.ceil(totalCount / fetchedLimit);
        setHasMore(fetchedPage < totalPages);
      } else {
        // Reset if no data
        setAllProducts([]);
        setHasMore(false);
      }

      setIsLoading(false);
      setIsFetchingMore(false);
    }

    if (currentError) {
      setError(currentError);
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  }, [data, currentError]);

  return {
    products: allProducts,
    total,
    hasMore,
    isLoading: isLoading || isCurrentLoading,
    isFetchingMore,
    error,
    loadMore,
    reset,
    changeCategory,
    refresh,
  };
};