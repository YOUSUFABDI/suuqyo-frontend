'use client';

import { orderBy } from 'es-toolkit';
import { useBoolean, useSetState } from 'minimal-shared/hooks';
import { useState } from 'react';
import type { IProductFilters } from 'src/types/product';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { EmptyContent } from 'src/components/empty-content';

import { Button } from '@mui/material';
import { PRODUCT_COLOR_OPTIONS, PRODUCT_GENDER_OPTIONS, PRODUCT_RATING_OPTIONS } from 'src/_mock';
import { slugify } from 'src/utils/slugify';
import { useSearchShops, useShopCategories, UseShops } from '../hooks';
import { ShopFiltersDrawer } from '../shop-filters-drawer';
import { ShopFiltersResult } from '../shop-filters-result';
import { ShopList } from '../shop-list';
import { ShopSearch } from '../shop-search';
import { ShopSort } from '../shop-sort';
import { SHOP_SORT_OPTIONS, ShopInfoDT } from '../types/types';

// ----------------------------------------------------------------------

export function ShopView() {
  const { shops } = UseShops();
  const { shopCategories } = useShopCategories();
  const [searchQuery, setSearchQuery] = useState('');
  const { searchResults } = useSearchShops(searchQuery);

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

  const shopArray = searchQuery ? searchResults : shops;
  const dataFiltered = applyFilter({
    inputData: Array.isArray(shopArray) ? shopArray : [shopArray],
    filters: currentFilters,
    sortBy,
  });

  const canReset =
    currentFilters.gender.length > 0 ||
    currentFilters.colors.length > 0 ||
    currentFilters.rating !== '' ||
    currentFilters.category !== 'all' ||
    currentFilters.priceRange[0] !== 0 ||
    currentFilters.priceRange[1] !== 200;

  const notFound = !dataFiltered.length && canReset;
  const productsEmpty = !shops.length;

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
            categories: ['all', ...shopCategories],
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

  const renderCatorgyButtons = () => (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        overflowX: 'auto', // Enable horizontal scrolling if the content overflows
        flexWrap: 'nowrap', // Prevent buttons from wrapping to the next line
        gap: 1, // Adjust gap between buttons
        maxWidth: '100%', // Ensure that the stack doesn't exceed the width of its container
        whiteSpace: 'nowrap', // Prevent the buttons from wrapping even on large screens
        // '&::-webkit-scrollbar': {
        //   display: 'none', // Hides the scrollbar
        // },
      }}
    >
      {/* Button for "All" categories */}
      <Button
        variant={currentFilters.category === 'all' ? 'contained' : 'outlined'}
        onClick={() => filters.setState({ category: 'all' })}
        sx={{
          minWidth: 'max-content', // Ensure buttons don’t stretch too much
        }}
      >
        All
      </Button>
      {/* Map through product categories and create a button for each */}
      {shopCategories.map((category) => (
        <Button
          key={category}
          variant={currentFilters.category === category ? 'contained' : 'outlined'}
          onClick={() => filters.setState({ category })}
          sx={{
            minWidth: 'max-content', // Ensure buttons don’t stretch too much
          }}
        >
          {category}
        </Button>
      ))}
    </Stack>
  );

  const renderResults = () => (
    <ShopFiltersResult filters={filters} totalResults={dataFiltered.length} />
  );

  const renderNotFound = () => <EmptyContent filled sx={{ py: 10 }} />;

  return (
    <Container sx={{ mb: 15 }}>
      <Typography variant="h4" sx={{ my: { xs: 3, md: 5 } }}>
        Shops
      </Typography>

      <Stack spacing={2.5} sx={{ mb: { xs: 3, md: 5 } }}>
        {renderCatorgyButtons()}
        {renderFilters()}
        {canReset && renderResults()}
      </Stack>

      {(notFound || productsEmpty) && renderNotFound()}

      <ShopList shops={dataFiltered} />
    </Container>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  sortBy: string;
  filters: IProductFilters;
  inputData: ShopInfoDT['shop'][];
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

  // if (sortBy === 'priceDesc') {
  //   inputData = orderBy(inputData, ['sellingPrice'], ['desc']);
  // }

  // if (sortBy === 'priceAsc') {
  //   inputData = orderBy(inputData, ['sellingPrice'], ['asc']);
  // }

  // if (min !== 0 || max !== 200) {
  //   inputData = inputData.filter(
  //     (product) => product.sellingPrice >= min && product.sellingPrice <= max
  //   );
  // }

  if (category !== 'all') {
    inputData = inputData.filter(
      (shop) => shop?.ShopCategory?.name.toLowerCase() === category.toLowerCase()
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
