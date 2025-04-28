'use client';

import type { IProductFilters } from 'src/types/product';

import { useBoolean, useSetState } from 'minimal-shared/hooks';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { EmptyContent } from 'src/components/empty-content';

import { useSearchShops, UseShops } from '../hooks';
import { ShopFiltersResult } from '../shop-filters-result';
import { ShopList } from '../shop-list';
import { ShopSearch } from '../shop-search';
import { ShopDT } from '../types/types';
import { slugify } from 'src/utils/slugify';

// ----------------------------------------------------------------------

export function ShopView() {
  const { shops } = UseShops();
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

  const dataFiltered = applyFilter({
    // inputData: shops,
    inputData: searchQuery ? searchResults : shops,
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
    </Box>
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
  inputData: ShopDT[];
};

function applyFilter({ inputData }: ApplyFilterProps) {
  return inputData;
}
