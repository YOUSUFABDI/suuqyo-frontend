'use client';

import type { IProductFilters } from 'src/types/product';
import { PRODUCT_CATEGORY_OPTIONS, type ShopInfoDT } from './types/types';
import { Product } from '../product/types/types';
import { orderBy } from 'es-toolkit';
import { useBoolean, useSetState } from 'minimal-shared/hooks';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import { paths } from 'src/routes/paths';
import {
  PRODUCT_COLOR_OPTIONS,
  PRODUCT_GENDER_OPTIONS,
  PRODUCT_RATING_OPTIONS,
  PRODUCT_SORT_OPTIONS,
  // Ensure this is imported
} from 'src/_mock';

import { EmptyContent } from 'src/components/empty-content';
import { ProductFiltersDrawer } from '../product/product-filters-drawer';
import { ProductFiltersResult } from '../product/product-filters-result';
import { ProductList } from '../components/product-list';
import { ProductSearch } from '../product/product-search';
import { ProductSort } from '../product/product-sort';

// ----------------------------------------------------------------------

type Props = {
  shop: ShopInfoDT['shop'];
  products: Product[];
};

export function ShopProduct({ products, shop }: Props) {
  const openFilters = useBoolean();

  const [sortBy, setSortBy] = useState('featured');

  const filters = useSetState<IProductFilters>({
    gender: [],
    colors: [],
    rating: '',
    category: 'all',
    priceRange: [0, 200],
  });
  const { state: currentFilters } = filters;

  // Use the static PRODUCT_CATEGORY_OPTIONS for filtering, including 'All'
  const productCategories = ['All', ...PRODUCT_CATEGORY_OPTIONS];

  const dataFiltered = applyFilter({
    inputData: products,
    filters: currentFilters,
    sortBy,
  });

  const canReset =
    currentFilters.gender.length > 0 ||
    currentFilters.colors.length > 0 ||
    currentFilters.rating !== '' ||
    currentFilters.category.toLowerCase() !== 'all' ||
    currentFilters.priceRange[0] !== 0 ||
    currentFilters.priceRange[1] !== 200;

  const notFound = !dataFiltered.length && canReset;
  const productsEmpty = !products.length;

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

  const renderFilters = () => (
    <Box
      sx={{
        gap: 1,
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { sm: 'center' },
      }}
    >
      <ProductSearch
        redirectPath={(id: string) => paths.customer.product.details(id)}
        sx={{ width: { xs: 1, sm: 260 } }}
      />

      <Box sx={{ gap: 1, flexShrink: 0, display: 'flex' }}>
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
            categories: PRODUCT_CATEGORY_OPTIONS, // Pass the static list
          }}
        />
        <ProductSort
          sort={sortBy}
          onSort={(newValue: string) => setSortBy(newValue)}
          sortOptions={PRODUCT_SORT_OPTIONS}
        />
      </Box>
    </Box>
  );

  const renderCategoryButtons = () => (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        overflowX: 'auto',
        flexWrap: 'nowrap',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {productCategories.map((category) => (
        <Button
          key={category}
          variant={
            currentFilters.category.toLowerCase() === category.toLowerCase()
              ? 'contained'
              : 'outlined'
          }
          onClick={() => filters.setState({ category })}
          sx={{
            flexShrink: 0,
            minWidth: 'max-content',
            textTransform: 'capitalize',
          }}
        >
          {category}
        </Button>
      ))}
    </Stack>
  );

  const renderResults = () => (
    <ProductFiltersResult filters={filters} totalResults={dataFiltered.length} />
  );

  const renderNotFound = () => <EmptyContent filled title="No Products Found" sx={{ py: 10 }} />;

  return (
    <Stack spacing={3}>
      {renderShopCover()}

      <Stack spacing={2.5}>
        {renderCategoryButtons()}
        {renderFilters()}
        {canReset && renderResults()}
      </Stack>

      {(notFound || productsEmpty) && renderNotFound()}

      {!notFound && <ProductList products={dataFiltered} />}
    </Stack>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  sortBy: string;
  filters: IProductFilters;
  inputData: Product[];
};

function applyFilter({ inputData, filters, sortBy }: ApplyFilterProps): Product[] {
  const { category, priceRange } = filters;
  const minPrice = priceRange[0];
  const maxPrice = priceRange[1];

  let filteredData = [...inputData];

  // **SORTING**
  if (sortBy === 'featured') {
    filteredData = orderBy(filteredData, ['createdAt'], ['desc']);
  }
  if (sortBy === 'newest') {
    filteredData = orderBy(filteredData, ['createdAt'], ['desc']);
  }
  if (sortBy === 'priceDesc') {
    filteredData = orderBy(filteredData, ['sellingPrice'], ['desc']);
  }
  if (sortBy === 'priceAsc') {
    filteredData = orderBy(filteredData, ['sellingPrice'], ['asc']);
  }

  // **FILTERING**
  if (category.toLowerCase() !== 'all') {
    filteredData = filteredData.filter(
      (product) => product.category?.name.toLowerCase() === category.toLowerCase()
    );
  }

  if (minPrice > 0 || maxPrice < 200) {
    filteredData = filteredData.filter(
      (product) => product.sellingPrice >= minPrice && product.sellingPrice <= maxPrice
    );
  }

  return filteredData;
}
