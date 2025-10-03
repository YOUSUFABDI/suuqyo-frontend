"use client"

import { orderBy } from 'es-toolkit';
import { useBoolean, useSetState } from 'minimal-shared/hooks';
import { useState, useEffect, useCallback, useMemo } from 'react';
import type { IProductFilters } from 'src/types/product';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';

import { paths } from 'src/routes/paths';

import { EmptyContent } from 'src/components/empty-content';

import { PRODUCT_COLOR_OPTIONS, PRODUCT_GENDER_OPTIONS, PRODUCT_RATING_OPTIONS } from 'src/_mock';
import { slugify } from 'src/utils/slugify';
import { useSearchShopsInfinite, useShopsInfinite } from '../hooks';
import { ShopFiltersDrawer } from '../shop-filters-drawer';
import { ShopFiltersResult } from '../shop-filters-result';
import { ShopList } from '../shop-list';
import { ShopSearch } from '../shop-search';
import { ShopSort } from '../shop-sort';
import { SHOP_SORT_OPTIONS, ShopInfoDT } from '../types/types';
import { useTranslate } from 'src/locales';
import { useShopCategories } from '../hooks/use-shop-categories';

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: ShopInfoDT['shop'][];
  filters: IProductFilters;
  sortBy: string;
};

function applyFilter({ inputData, filters, sortBy }: ApplyFilterProps): ShopInfoDT['shop'][] {
  // Apply category filter
  if (filters.category && filters.category !== 'all') {
    inputData = inputData.filter((shop) => 
      shop.ShopCategory?.name.toLowerCase() === filters.category?.toLowerCase()
    );
  }

  // Apply gender filter
  if (filters.gender.length > 0) {
    // For shops, we might not have gender filter, but keeping it for consistency
    // This would typically be applied to products within shops
  }

  // Apply color filter
  if (filters.colors.length > 0) {
    // For shops, we might not have color filter, but keeping it for consistency
    // This would typically be applied to products within shops
  }

  // Apply rating filter
  if (filters.rating) {
    // For shops, we might not have rating filter, but keeping it for consistency
    // This would typically be applied to products within shops
  }

  // Apply price range filter
  if (filters.priceRange[0] > 0 || filters.priceRange[1] < 200) {
    // For shops, we might not have price range filter, but keeping it for consistency
    // This would typically be applied to products within shops
  }

  // Apply sorting
  if (sortBy === 'featured') {
    // Default sorting by creation date (newest first) for featured
    inputData = orderBy(inputData, ['createdAt'], ['desc']);
  } else if (sortBy === 'newest') {
    inputData = orderBy(inputData, ['createdAt'], ['desc']);
  } else if (sortBy === 'oldest') {
    inputData = orderBy(inputData, ['createdAt'], ['asc']);
  } else if (sortBy === 'nameAsc') {
    inputData = orderBy(inputData, [(shop) => shop.shopName.toLowerCase()], ['asc']);
  } else if (sortBy === 'nameDesc') {
    inputData = orderBy(inputData, [(shop) => shop.shopName.toLowerCase()], ['desc']);
  }

  return inputData;
}

// ----------------------------------------------------------------------

export function ShopView() {
  const { t } = useTranslate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  
  const openFilters = useBoolean();

  // Use infinite scroll hooks
  const {
    shops: allShops,
    isLoading,
    hasMore,
    isFetchingMore,
    loadMore,
    total
  } = useShopsInfinite({ limit: 12, sortBy });
  
  const { 
    shops: searchResults, 
    isLoading: isSearchLoading, 
    hasMore: hasMoreSearch, 
    isFetchingMore: isFetchingMoreSearch,
    loadMore: loadMoreSearch 
  } = useSearchShopsInfinite(searchQuery, { limit: 12 });

  const { shopCategories } = useShopCategories();

  const filters = useSetState<IProductFilters>({
    gender: [],
    colors: [],
    rating: '',
    category: 'all',
    priceRange: [0, 200],
  });
  const { state: currentFilters } = filters;

  // Handle category change from buttons
  const handleCategoryChange = (category: string) => {
    filters.setState({ category });
  };

  // Handle scroll for infinite loading
  useEffect(() => {
    const handleScroll = () => {
      // Don't handle scroll for search results since they're not paginated in the same way
      if (searchQuery) {
        return;
      }
      
      if (!hasMore || isFetchingMore || isLoading) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // When user is near the bottom (within 100px)
      if (scrollTop + windowHeight >= documentHeight - 100) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, isFetchingMore, isLoading, searchQuery, loadMore]);

  // Get the current shops to display (search results or all shops)
  const currentShops = useMemo(() => {
    return searchQuery ? searchResults : allShops;
  }, [searchQuery, searchResults, allShops]);

  // Apply filters to the current shops
  const dataFiltered = useMemo(() => {
    return applyFilter({
      inputData: currentShops,
      filters: currentFilters,
      sortBy,
    });
  }, [currentShops, currentFilters, sortBy]);

  // Determine if we should show loading state in the shop list
  // Don't show loading if we've finished initial loading but have no results after filtering
  const shouldShowLoading = (isLoading || isSearchLoading) && 
    (searchQuery ? searchResults.length === 0 : allShops.length === 0);

  const canReset =
    currentFilters.gender.length > 0 ||
    currentFilters.colors.length > 0 ||
    currentFilters.rating !== '' ||
    currentFilters.category !== 'all' ||
    currentFilters.priceRange[0] !== 0 ||
    currentFilters.priceRange[1] !== 200;

  const notFound = !dataFiltered.length && canReset;
  // Fix the shopsEmpty condition to properly handle loading states and search results
  const shopsEmpty = !isLoading && !isSearchLoading && dataFiltered.length === 0 && !searchQuery;

  const renderCategoryButtons = () => (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        overflowX: 'auto',
        flexWrap: 'nowrap',
        gap: 1,
        maxWidth: '100%',
        whiteSpace: 'nowrap',
      }}
    >
      <Button
        variant={currentFilters.category === 'all' ? 'contained' : 'outlined'}
        onClick={() => handleCategoryChange('all')}
        sx={{ minWidth: 'max-content' }}
      >
        All
      </Button>
      {Array.isArray(shopCategories) && shopCategories.map((category) => (
        <Button
          key={category}
          variant={currentFilters.category === category ? 'contained' : 'outlined'}
          onClick={() => handleCategoryChange(category)}
          sx={{ minWidth: 'max-content' }}
        >
          {category}
        </Button>
      ))}
    </Stack>
  );

  const renderFilters = () => (
    <Box
      sx={{
        gap: 3,
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-end', sm: 'center' },
      }}
    >
      <ShopSearch
        redirectPath={(shopName: string) => paths.customer.shop.details(slugify(shopName))}
        onSearch={setSearchQuery}
      />

      <Box sx={{ gap: 1, flexShrink: 0, display: 'flex' }}>
        <ShopFiltersDrawer
          filters={filters}
          canReset={canReset}
          open={openFilters.value}
          onOpen={openFilters.onTrue}
          onClose={openFilters.onFalse}
          options={{
            colors: PRODUCT_COLOR_OPTIONS,
            ratings: PRODUCT_RATING_OPTIONS,
            genders: PRODUCT_GENDER_OPTIONS,
            categories: ['all', ...(Array.isArray(shopCategories) ? shopCategories : [])],
          }}
        />

        <ShopSort
          sort={sortBy}
          onSort={(newValue: string) => setSortBy(newValue)}
          sortOptions={SHOP_SORT_OPTIONS}
        />
      </Box>
    </Box>
  );

  const renderResults = () => (
    <ShopFiltersResult filters={filters} totalResults={dataFiltered.length} />
  );

  const renderNotFound = () => <EmptyContent filled sx={{ py: 10 }} />;

  return (
    <Container sx={{ mb: 15 }}>
      <Typography variant="h4" sx={{ my: { xs: 3, md: 5 } }}>
        {t('home.shoptitle')}
      </Typography>

      <Stack spacing={2.5} sx={{ mb: { xs: 3, md: 5 } }}>
        {renderCategoryButtons()}
        {renderFilters()}
        {canReset && renderResults()}
      </Stack>

      {notFound && renderNotFound()}

      <ShopList 
        shops={dataFiltered} 
        loading={shouldShowLoading}
        hasMore={searchQuery ? hasMoreSearch : hasMore}
        isFetchingMore={searchQuery ? isFetchingMoreSearch : isFetchingMore}
      />
      
      {/* Show "0 results found" when searching and no results */}
      {!isLoading && !isSearchLoading && dataFiltered.length === 0 && searchQuery && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <Typography variant="h6" color="text.secondary">
            No shops found for "{searchQuery}"
          </Typography>
        </Box>
      )}
      
      {/* Show "0 results found" only when we've finished loading and have no results for a specific category */}
      {!isLoading && !isSearchLoading && dataFiltered.length === 0 && !searchQuery && currentFilters.category !== 'all' && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <Typography variant="h6" color="text.secondary">
            0 results found
          </Typography>
        </Box>
      )}
      
      {/* Show "No shops available" only when we've finished loading and have no results at all */}
      {!isLoading && !isSearchLoading && dataFiltered.length === 0 && !searchQuery && currentFilters.category === 'all' && allShops.length === 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <Typography variant="h6" color="text.secondary">
            No shops available
          </Typography>
        </Box>
      )}
    </Container>
  );
}
