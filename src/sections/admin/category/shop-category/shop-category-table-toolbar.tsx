import type { SelectChangeEvent } from '@mui/material/Select';
import type { UseSetStateReturn } from 'minimal-shared/hooks';
import type { IShopCategoryTableFilters } from './types/types';

import { usePopover } from 'minimal-shared/hooks';
import { useCallback } from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import { CustomPopover } from 'src/components/custom-popover';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  onResetPage: () => void;
  filters: UseSetStateReturn<IShopCategoryTableFilters>;
  options: {
    status: string[];
  };
};

export function ShopCatgeoryTableToolbar({ filters, options, onResetPage }: Props) {
  const menuActions = usePopover();

  const { state: currentFilters, setState: updateFilters } = filters;

  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onResetPage();
      updateFilters({ name: event.target.value, phoneNumber: event.target.value });
    },
    [onResetPage, updateFilters]
  );

  return (
    <Box
      sx={{
        p: 2.5,
        gap: 2,
        display: 'flex',
        pr: { xs: 2.5, md: 1 },
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'flex-end', md: 'center' },
      }}
    >
      <Box
        sx={{
          gap: 2,
          width: 1,
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <TextField
          fullWidth
          value={currentFilters.name || ''}
          onChange={handleFilterName}
          placeholder="Search..."
        />
      </Box>
    </Box>
  );
}
