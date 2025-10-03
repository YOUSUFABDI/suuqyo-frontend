'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchShopsQuery } from 'src/store/customer/shop';
import { isSuccessResponse } from 'src/utils/is-success-res';
import { ShopInfoDT } from '../types/types';

interface UseSearchShopsInfiniteParams {
  limit?: number;
}

export const useSearchShopsInfinite = (query: string, {
  limit = 10,
}: UseSearchShopsInfiniteParams = {}) => {
  const [allShops, setAllShops] = useState<ShopInfoDT['shop'][]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState<any>(null);

  // Only search when query is not empty
  const shouldSearch = !!(query && query.trim().length > 0);

  // Fetch current page data
  const {
    data,
    isLoading: isCurrentLoading,
    error: currentError,
    refetch,
  } = useSearchShopsQuery(
    { 
      query: query.trim(),
      page: currentPage, 
      limit,
    },
    {
      skip: !shouldSearch, // Skip the query when there's no search term
    }
  );

  // Reset pagination when query changes
  useEffect(() => {
    setAllShops([]);
    setCurrentPage(1);
    setHasMore(true);
    setTotal(0);
    // Only set loading to true when we actually have a query to search
    setIsLoading(shouldSearch);
    setIsFetchingMore(false);
    setError(null);
  }, [query, shouldSearch]);

  // Load more shops
  const loadMore = useCallback(() => {
    if (!hasMore || isFetchingMore || isLoading) return;

    setIsFetchingMore(true);
    setCurrentPage((prev) => prev + 1);
  }, [hasMore, isFetchingMore, isLoading]);

  // Reset and fetch first page
  const reset = useCallback(() => {
    setAllShops([]);
    setCurrentPage(1);
    setHasMore(true);
    setTotal(0);
    setIsLoading(shouldSearch);
    setIsFetchingMore(false);
    setError(null);
  }, [shouldSearch]);

  // Force refresh method
  const refresh = useCallback(() => {
    setAllShops([]);
    setCurrentPage(1);
    setHasMore(true);
    setTotal(0);
    setIsLoading(shouldSearch);
    setIsFetchingMore(false);
    setError(null);
    if (shouldSearch) {
      refetch();
    }
  }, [refetch, shouldSearch]);

  // Process the fetched data
  useEffect(() => {
    // If we shouldn't search, reset the state
    if (!shouldSearch) {
      setAllShops([]);
      setHasMore(false);
      setTotal(0);
      setIsLoading(false);
      setIsFetchingMore(false);
      return;
    }

    if (data) {
      const isSuccess = isSuccessResponse(data);

      if (isSuccess && data.payload && data.payload.data) {
        const {
          data: shops,
          total: totalCount,
          page: fetchedPage,
          limit: fetchedLimit,
        } = data.payload.data;

        setTotal(totalCount);

        if (fetchedPage === 1) {
          // First page, replace all shops
          setAllShops(shops);
        } else {
          // Subsequent pages, append to existing shops
          setAllShops((prev) => [...prev, ...shops]);
        }

        // Check if we have more pages
        const totalPages = Math.ceil(totalCount / fetchedLimit);
        setHasMore(fetchedPage < totalPages);
      } else {
        // Reset if no data
        setAllShops([]);
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
  }, [data, currentError, query, shouldSearch]);

  return {
    shops: allShops,
    total,
    hasMore,
    isLoading,
    isFetchingMore,
    error,
    loadMore,
    reset,
    refresh,
  };
};