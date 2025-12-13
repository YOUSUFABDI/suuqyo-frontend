'use client';

import type { IProductFilters } from 'src/types/product';

import { orderBy } from 'es-toolkit';
import { useBoolean, useSetState } from 'minimal-shared/hooks';
import { useState, useCallback, useEffect, useMemo } from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';

import { paths } from 'src/routes/paths';

import {
  PRODUCT_COLOR_OPTIONS,
  PRODUCT_GENDER_OPTIONS,
  PRODUCT_RATING_OPTIONS,
  PRODUCT_SORT_OPTIONS,
} from 'src/_mock';

import { EmptyContent } from 'src/components/empty-content';
import { CartIcon } from '../components/cart-icon';
import { ProductList } from '../components/product-list';
import { ProductFiltersDrawer } from './product-filters-drawer';
import { ProductFiltersResult } from './product-filters-result';
import { ProductSearch } from './product-search';
import { ProductSort } from './product-sort';
import { Product, ProductResponse } from './types/types';
import { useTranslate } from 'src/locales';
import { useGetAllProductCategoriesQuery } from 'src/store/customer/product';
import { isSuccessResponse } from 'src/utils/is-success-res';
import { useInfiniteProducts } from './hooks/use-infinite-products';

// --- CONSTANTS ---
const DEFAULT_LIMIT = 8;
const MAX_PRICE = 200;
const MIN_PRICE = 0;
// -------------------

export function ProductListView() {
  const { t } = useTranslate();
  const filters = useSetState<IProductFilters>({
    rating: '',
    gender: [],
    category: 'all',
    colors: [],
    priceRange: [MIN_PRICE, MAX_PRICE],
  });

  const openFilters = useBoolean();

  const [sortBy, setSortBy] = useState('newest');

  // Fetch product categories
  const { data: categoriesData } = useGetAllProductCategoriesQuery();

  const [productCategories, setProductCategories] = useState<string[]>([]);

  useEffect(() => {
    if (categoriesData && isSuccessResponse<string[]>(categoriesData)) {
      setProductCategories(categoriesData.payload.data);
    }
  }, [categoriesData]);

  // Create memoized filter values for the API
  const apiFilters = useMemo(
    () => ({
      category: filters.state.category !== 'all' ? filters.state.category : undefined,
      sortBy: sortBy !== 'newest' ? sortBy : undefined,
      minPrice: filters.state.priceRange[0] !== MIN_PRICE ? filters.state.priceRange[0] : undefined,
      maxPrice: filters.state.priceRange[1] !== MAX_PRICE ? filters.state.priceRange[1] : undefined,
    }),
    [filters.state, sortBy]
  );

  // Use infinite scroll hook
  const {
    products: allProducts,
    hasMore,
    isLoading,
    isFetchingMore,
    loadMore,
    changeCategory,
    refresh,
  } = useInfiniteProducts({
    category: apiFilters.category,
    sortBy: apiFilters.sortBy,
    minPrice: apiFilters.minPrice,
    maxPrice: apiFilters.maxPrice,
    limit: DEFAULT_LIMIT,
  });
  // console.log('allProducts', allProducts);

  // Handle scroll event for infinite loading
  useEffect(() => {
    const handleScroll = () => {
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
  }, [hasMore, isFetchingMore, isLoading, loadMore]);

  // Handle category change from buttons
  const handleCategoryChange = (category: string) => {
    // Update filter state
    filters.setState({ category });

    // Immediately trigger category change in the hook
    changeCategory(category !== 'all' ? category : undefined);
  };

  const canReset =
    filters.state.gender.length > 0 ||
    filters.state.colors.length > 0 ||
    filters.state.rating !== '' ||
    filters.state.category !== 'all' ||
    filters.state.priceRange[0] !== MIN_PRICE ||
    filters.state.priceRange[1] !== MAX_PRICE;

  // Extract products from ProductResponse
  const rawProducts: Product[] = allProducts.map((item: ProductResponse) => item.product);

  const notFound = rawProducts.length === 0 && !isLoading && !canReset;
  const productsEmpty = !isLoading && rawProducts.length === 0 && !canReset;

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
      <ProductSearch redirectPath={(id: string) => paths.customer.product.details(id)} />

      <Box
        sx={{
          gap: 1,
          flexShrink: 0,
          display: 'flex',
        }}
      >
        <ProductFiltersDrawer
          filters={filters}
          canReset={canReset}
          open={openFilters.value}
          onOpen={openFilters.onTrue}
          onClose={() => {
            openFilters.onFalse();
          }}
          onCategoryChange={changeCategory}
          onFilterChange={refresh} // Add callback to refresh when filters change
          options={{
            colors: PRODUCT_COLOR_OPTIONS,
            ratings: PRODUCT_RATING_OPTIONS,
            genders: PRODUCT_GENDER_OPTIONS,
            categories: ['all', ...productCategories],
          }}
        />

        <ProductSort
          sort={sortBy}
          onSort={(newValue: string) => {
            setSortBy(newValue);
          }}
          sortOptions={PRODUCT_SORT_OPTIONS}
        />
      </Box>
    </Box>
  );

  const renderCatorgyButtons = () => (
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
        variant={filters.state.category === 'all' ? 'contained' : 'outlined'}
        onClick={() => handleCategoryChange('all')}
        sx={{ minWidth: 'max-content' }}
      >
        All
      </Button>
      {productCategories.map((category) => (
        <Button
          key={category}
          variant={filters.state.category === category ? 'contained' : 'outlined'}
          onClick={() => handleCategoryChange(category)}
          sx={{ minWidth: 'max-content' }}
        >
          {category}
        </Button>
      ))}
    </Stack>
  );

  const renderResults = () => (
    <ProductFiltersResult
      filters={filters}
      totalResults={rawProducts.length}
      onReset={() => {
        filters.resetState();
        // Reset category to 'all'
        changeCategory(undefined);
        // Force a refresh after reset to ensure products reload
        refresh();
      }}
    />
  );

  const renderNotFound = () => <EmptyContent filled sx={{ py: 10 }} />;

  return (
    <Container sx={{ mb: 15 }}>
      <CartIcon totalItems={0} />

      <Typography variant="h4" sx={{ my: { xs: 3, md: 5 } }}>
        {t('home.productstitle')}
      </Typography>

      <Stack spacing={2.5} sx={{ mb: { xs: 3, md: 5 } }}>
        {renderCatorgyButtons()}
        {renderFilters()}
        {canReset && renderResults()}
      </Stack>

      {(notFound || productsEmpty) && renderNotFound()}

      <ProductList
        products={rawProducts}
        loading={isLoading}
        hasMore={hasMore}
        isFetchingMore={isFetchingMore}
      />
    </Container>
  );
}
