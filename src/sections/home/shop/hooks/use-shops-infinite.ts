'use client';

import { useEffect, useState, useCallback } from 'react';
import { useShopsQuery } from 'src/store/customer/shop';
import { isSuccessResponse } from 'src/utils/is-success-res';
import { ShopInfoDT } from '../types/types';

interface UseInfiniteShopsParams {
  limit?: number;
  sortBy?: string;
}

export const useShopsInfinite = ({
  limit = 12,
  sortBy,
}: UseInfiniteShopsParams = {}) => {
  const [allShops, setAllShops] = useState<ShopInfoDT['shop'][]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState<any>(null);
  const [currentSortBy, setCurrentSortBy] = useState<string | undefined>(sortBy);

  // Update local state when sortBy prop changes
  useEffect(() => {
    setCurrentSortBy(sortBy);
  }, [sortBy]);

  // Fetch current page data
  const {
    data,
    isLoading: isCurrentLoading,
    error: currentError,
    refetch,
  } = useShopsQuery(
    { 
      page: currentPage, 
      limit,
      sortBy: currentSortBy,
    },
    {
      skip: false,
    }
  );

  // Reset pagination when sortBy changes
  useEffect(() => {
    setAllShops([]);
    setCurrentPage(1);
    setHasMore(true);
    setTotal(0);
    setIsLoading(true);
    setIsFetchingMore(false);
    setError(null);
  }, [currentSortBy]);

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
    setIsLoading(true);
    setIsFetchingMore(false);
    setError(null);
  }, []);

  // Force refresh method
  const refresh = useCallback(() => {
    setAllShops([]);
    setCurrentPage(1);
    setHasMore(true);
    setTotal(0);
    setIsLoading(true);
    setIsFetchingMore(false);
    setError(null);
    refetch();
  }, [refetch]);

  // Process the fetched data
  useEffect(() => {
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
  }, [data, currentError]);

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