'use client';

import { orderBy } from 'es-toolkit';
import { useBoolean, useSetState } from 'minimal-shared/hooks';
import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';

import {
  PRODUCT_COLOR_OPTIONS,
  PRODUCT_GENDER_OPTIONS,
  PRODUCT_RATING_OPTIONS,
  PRODUCT_SORT_OPTIONS,
} from 'src/_mock';
import { paths } from 'src/routes/paths';
import { useShopProductsInfinite } from './hooks/product/use-shop-products-infinite';

import type { IProductFilters } from 'src/types/product';
import { type Product } from '../product/types/types';
import { type ShopInfoDT } from './types/types';

import { EmptyContent } from 'src/components/empty-content';
import { ProductList } from '../components/product-list';
import { useCategories } from '../product/hooks';
import { ProductFiltersDrawer } from '../product/product-filters-drawer';
import { ProductFiltersResult } from '../product/product-filters-result';
import { ProductSearch } from '../product/product-search';
import { ProductSort } from '../product/product-sort';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

type Props = {
  shop: ShopInfoDT['shop'];
  products: Product[]; // This will be replaced by infinite scroll
};

export function ShopProduct({ shop }: Props) {
  const openFilters = useBoolean();
  const { productCategories } = useCategories();
  const [sortBy, setSortBy] = useState('featured');

  const filters = useSetState<IProductFilters>({
    gender: [],
    colors: [],
    rating: '',
    category: 'all',
    priceRange: [0, 200],
  });
  const { state: currentFilters } = filters;

  // Use the new infinite scroll hook
  const {
    products: shopProducts,
    isLoading,
    isFetchingMore,
    hasMore,
    loadMore,
    changeCategory,
    refresh,
  } = useShopProductsInfinite({
    shopId: parseInt(shop.id, 10),
    category: currentFilters.category,
    sortBy,
    minPrice: currentFilters.priceRange[0],
    maxPrice: currentFilters.priceRange[1],
  });

  // Handle category change
  const handleCategoryChange = useCallback(
    (category: string) => {
      changeCategory(category);
      filters.setState({ category });
    },
    [changeCategory, filters]
  );

  // Handle price range change
  const handlePriceRangeChange = useCallback(
    (priceRange: [number, number]) => {
      filters.setState({ priceRange });
    },
    [filters]
  );

  // Handle sort change
  const handleSortChange = useCallback((newValue: string) => {
    setSortBy(newValue);
  }, []);

  // Handle reset filters
  const handleResetFilters = useCallback(() => {
    filters.setState({
      gender: [],
      colors: [],
      rating: '',
      category: 'all',
      priceRange: [0, 200],
    });
    setSortBy('featured');
  }, [filters]);

  // Handle scroll for infinite loading
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
        hasMore &&
        !isFetchingMore
      ) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, isFetchingMore, loadMore]);

  const canReset =
    currentFilters.gender.length > 0 ||
    currentFilters.colors.length > 0 ||
    currentFilters.rating !== '' ||
    currentFilters.category.toLowerCase() !== 'all' ||
    currentFilters.priceRange[0] !== 0 ||
    currentFilters.priceRange[1] !== 200;

  const notFound = !shopProducts.length && canReset;
  const productsEmpty = !shopProducts.length && !isLoading;

  const renderShopCover = () => (
    <Box
      component="img"
      src={shop.shopLogo}
      alt={`${shop.shopName} cover`}
      sx={{
        width: '100%',
        height: { xs: 180, sm: 240, md: 280 },
        objectFit: 'cover',
        display: 'block',
        borderRadius: 1.5,
      }}
    />
  );

  const renderCategoryButtons = () => (
    <Box
      // sx={{
      //   width: '770px',
      //   overflowX: 'auto',
      //   '&::-webkit-scrollbar': {
      //     display: 'none',
      //   },
      //   scrollbarWidth: 'none',
      // }}
      sx={{
        overflowX: 'auto',
        flexWrap: 'nowrap',
        gap: 1,
        width: '770px',
        whiteSpace: 'nowrap',
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{
          flexWrap: 'nowrap',
        }}
      >
        {/* "All" button */}
        <Button
          variant={currentFilters.category === 'all' ? 'contained' : 'outlined'}
          onClick={() => handleCategoryChange('all')}
          sx={{ flexShrink: 0 }}
        >
          All
        </Button>
        {/* Category buttons */}
        {Array.isArray(productCategories) && productCategories.length > 0 ? (
          productCategories.map((category) => (
            <Button
              key={category}
              variant={currentFilters.category === category ? 'contained' : 'outlined'}
              onClick={() => handleCategoryChange(category)}
              sx={{ flexShrink: 0 }}
            >
              {category}
            </Button>
          ))
        ) : (
          <Button disabled sx={{ flexShrink: 0 }}>
            No categories
          </Button>
        )}
      </Stack>
    </Box>
  );

  const renderFilters = () => (
    <Stack
      spacing={1.5}
      direction={{ xs: 'column', sm: 'row' }}
      alignItems={{ sm: 'center' }}
      justifyContent="space-between"
    >
      <ProductSearch
        redirectPath={(id: string) => paths.customer.product.details(id)}
        sx={{ width: { xs: 1, sm: 260 } }}
      />

      <Stack direction="row" spacing={1} flexShrink={0}>
        <ProductFiltersDrawer
          filters={filters}
          canReset={canReset}
          open={openFilters.value}
          onOpen={openFilters.onTrue}
          onClose={openFilters.onFalse}
          options={{
            colors: PRODUCT_COLOR_OPTIONS,
            ratings: PRODUCT_RATING_OPTIONS,
            genders: PRODUCT_GENDER_OPTIONS,
            categories: ['all', ...(Array.isArray(productCategories) ? productCategories : [])],
          }}
          onPriceRangeChange={handlePriceRangeChange}
        />
        <ProductSort sort={sortBy} onSort={handleSortChange} sortOptions={PRODUCT_SORT_OPTIONS} />
      </Stack>
    </Stack>
  );

  const renderResults = () => (
    <ProductFiltersResult
      filters={filters}
      totalResults={shopProducts.length}
      onReset={handleResetFilters}
    />
  );

  const renderNotFound = () => <EmptyContent filled title="No Products Found" sx={{ py: 10 }} />;

  const renderLoading = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
      <LoadingScreen />
    </Box>
  );

  return (
    <Stack spacing={3}>
      {renderShopCover()}

      <Stack spacing={2.5}>
        {renderCategoryButtons()}
        {renderFilters()}
        {canReset && renderResults()}
      </Stack>

      {isLoading && renderLoading()}

      {(notFound || productsEmpty) && renderNotFound()}

      {!notFound && !isLoading && <ProductList products={shopProducts} />}

      {isFetchingMore && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <LoadingScreen />
        </Box>
      )}
    </Stack>
  );
}
