import type { SxProps, Theme } from '@mui/material/styles';

import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { useCallback, useState, useMemo } from 'react';

import Autocomplete, { autocompleteClasses, createFilterOptions } from '@mui/material/Autocomplete';
import Avatar from '@mui/material/Avatar';
import InputAdornment from '@mui/material/InputAdornment';
import Link, { linkClasses } from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';
import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';
import { SearchNotFound } from 'src/components/search-not-found';
import { useSearchShopsInfinite } from './hooks';
import { ShopInfoDT } from './types/types';
import { slugify } from 'src/utils/slugify';

// ----------------------------------------------------------------------

type Props = {
  sx?: SxProps<Theme>;
  redirectPath: (id: string) => string;
  onSearch?: (query: string) => void;
};

export function ShopSearch({ redirectPath, sx, onSearch }: Props) {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<ShopInfoDT['shop'] | null>(null);

  // Only trigger search when query is not empty
  const effectiveSearchQuery = searchQuery.trim();
  const shouldSearch = effectiveSearchQuery.length > 0;
  
  const { shops: searchResults, isLoading: loading } = useSearchShopsInfinite(
    effectiveSearchQuery, 
    { limit: 10 }
  );

  // Only show loading state when we're actually searching
  const showLoading = shouldSearch && loading;

  // Only show search results when we're actually searching
  const displayResults = shouldSearch ? searchResults : [];

  const handleChange = useCallback(
    (item: ShopInfoDT['shop'] | null) => {
      setSelectedItem(item);
      if (item) {
        router.push(redirectPath(slugify(item.shopName)));
      }
    },
    [redirectPath, router]
  );

  const handleInputChange = useCallback(
    (event: any, newValue: string) => {
      setSearchQuery(newValue);
      if (onSearch) {
        onSearch(newValue);
      }
    },
    [onSearch]
  );

  const filterOptions = createFilterOptions({
    matchFrom: 'any',
    stringify: (option: ShopInfoDT['shop']) => `${option.shopName} ${option.shopAddress}`,
  });

  const paperStyles: SxProps<Theme> = {
    width: 320,
    [` .${autocompleteClasses.listbox}`]: {
      [` .${autocompleteClasses.option}`]: {
        p: 0,
        [` .${linkClasses.root}`]: {
          p: 0.75,
          gap: 1.5,
          width: 1,
          display: 'flex',
          alignItems: 'center',
        },
      },
    },
  };

  return (
    <Autocomplete
      autoHighlight
      popupIcon={null}
      loading={showLoading}
      options={displayResults}
      value={selectedItem}
      filterOptions={filterOptions}
      onChange={(event, newValue) => handleChange(newValue)}
      onInputChange={handleInputChange}
      getOptionLabel={(option) => option.shopName}
      noOptionsText={<SearchNotFound query={effectiveSearchQuery} />}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      slotProps={{ paper: { sx: paperStyles } }}
      sx={[{ flex: 1, width: { xs: 1, sm: 260 } }, ...(Array.isArray(sx) ? sx : [sx])]}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search..."
          slotProps={{
            input: {
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ ml: 1, color: 'text.disabled' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <>
                  {showLoading ? <Iconify icon="svg-spinners:8-dots-rotate" sx={{ mr: -3 }} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
      renderOption={(props, shop, { inputValue }) => {
        const matches = match(shop.shopName, inputValue);
        const parts = parse(shop.shopName, matches);

        return (
          <li {...props} key={shop.id}>
            <Link
              component={RouterLink}
              href={redirectPath(slugify(shop.shopName))}
              color="inherit"
              underline="none"
            >
              <Avatar
                key={shop.id}
                alt={shop.shopName}
                src={shop.shopLogo}
                variant="rounded"
                sx={{
                  width: 48,
                  height: 48,
                  flexShrink: 0,
                  borderRadius: 1,
                }}
              />

              <div key={inputValue}>
                {parts.map((part, index) => (
                  <Typography
                    key={index}
                    component="span"
                    color={part.highlight ? 'primary' : 'textPrimary'}
                    sx={{
                      typography: 'body2',
                      fontWeight: part.highlight ? 'fontWeightSemiBold' : 'fontWeightMedium',
                    }}
                  >
                    {part.text}
                  </Typography>
                ))}
              </div>
            </Link>
          </li>
        );
      }}
    />
  );
}