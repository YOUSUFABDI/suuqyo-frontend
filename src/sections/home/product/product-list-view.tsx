'use client';

import type { IProductFilters } from 'src/types/product';

import { orderBy } from 'es-toolkit';
import { useBoolean, useSetState } from 'minimal-shared/hooks';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import {
  PRODUCT_COLOR_OPTIONS,
  PRODUCT_GENDER_OPTIONS,
  PRODUCT_RATING_OPTIONS,
  PRODUCT_SORT_OPTIONS,
} from 'src/_mock';

import { EmptyContent } from 'src/components/empty-content';

import { useCheckoutContext } from '../checkout/context';
import { CartIcon } from '../components/cart-icon';
import { ProductList } from '../components/product-list';
import { useAllProduct } from './hooks';
import { ProductFiltersDrawer } from './product-filters-drawer';
import { ProductFiltersResult } from './product-filters-result';
import { ProductSearch } from './product-search';
import { ProductSort } from './product-sort';
import { Product, PRODUCT_CATEGORY_OPTIONS } from './types/types';

// ----------------------------------------------------------------------

export function ProductListView() {
  const { state: checkoutState } = useCheckoutContext();
  const { products } = useAllProduct();
  console.log('products', products);

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

  const rawProducts: Product[] = products
    .map((pro) => pro.product)
    .filter((product) => product.images?.length > 0);

  const dataFiltered = applyFilter({
    inputData: rawProducts,
    filters: currentFilters,
    sortBy,
  });
  console.log('dataFiltered', dataFiltered);

  const canReset =
    currentFilters.gender.length > 0 ||
    currentFilters.colors.length > 0 ||
    currentFilters.rating !== '' ||
    currentFilters.category !== 'all' ||
    currentFilters.priceRange[0] !== 0 ||
    currentFilters.priceRange[1] !== 200;

  const notFound = !dataFiltered.length && canReset;
  const productsEmpty = !products?.length;

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
            categories: ['all', ...PRODUCT_CATEGORY_OPTIONS],
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

  const renderResults = () => (
    <ProductFiltersResult filters={filters} totalResults={dataFiltered.length} />
  );

  const renderNotFound = () => <EmptyContent filled sx={{ py: 10 }} />;

  return (
    // sx={{ mt: 5, mb: 10 }}
    <Container sx={{ mb: 15 }}>
      <CartIcon totalItems={checkoutState.totalItems} />

      <Typography variant="h4" sx={{ my: { xs: 3, md: 5 } }}>
        Products
      </Typography>

      <Stack spacing={2.5} sx={{ mb: { xs: 3, md: 5 } }}>
        {renderFilters()}
        {canReset && renderResults()}
      </Stack>

      {(notFound || productsEmpty) && renderNotFound()}

      <ProductList
        products={dataFiltered.map((product) => ({ ...product, id: String(product.id) }))}
      />
    </Container>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  sortBy: string;
  filters: IProductFilters;
  // inputData: IProductItem[];
  // inputData: ProductResponse[];
  inputData: Product[];
};

function applyFilter({ inputData, filters, sortBy }: ApplyFilterProps) {
  const { gender, category, colors, priceRange, rating } = filters;

  const min = priceRange[0];
  const max = priceRange[1];

  // Sort by
  // if (sortBy === 'featured') {
  //   inputData = orderBy(inputData, ['totalSold'], ['desc']);
  // }

  if (sortBy === 'newest') {
    inputData = orderBy(inputData, ['createdAt'], ['desc']);
  }

  if (sortBy === 'priceDesc') {
    inputData = orderBy(inputData, ['sellingPrice'], ['desc']);
  }

  if (sortBy === 'priceAsc') {
    inputData = orderBy(inputData, ['sellingPrice'], ['asc']);
  }

  if (min !== 0 || max !== 200) {
    inputData = inputData.filter(
      (product) => product.sellingPrice >= min && product.sellingPrice <= max
    );
  }

  if (category !== 'all') {
    inputData = inputData.filter(
      (product) => product?.category?.name.toLowerCase() === category.toLowerCase()
    );
  }

  // filters
  // if (gender.length) {
  //   inputData = inputData.filter((product) => product.gender.some((i) => gender.includes(i)));
  // }

  // if (colors.length) {
  //   inputData = inputData.filter((product) =>
  //     product.colors.some((color) => colors.includes(color))
  //   );
  // }

  // if (rating) {
  //   inputData = inputData.filter((product) => {
  //     const convertRating = (value: string) => {
  //       if (value === 'up4Star') return 4;
  //       if (value === 'up3Star') return 3;
  //       if (value === 'up2Star') return 2;
  //       return 1;
  //     };
  //     return product.totalRatings > convertRating(rating);
  //   });
  // }

  return inputData;
}
