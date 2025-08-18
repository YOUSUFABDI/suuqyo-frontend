import type { SelectChangeEvent } from '@mui/material/Select';
import type { UseSetStateReturn } from 'minimal-shared/hooks';
import type { IShopOwnerTableFilters } from './types/types';

import { usePopover } from 'minimal-shared/hooks';
import { useCallback } from 'react';

import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import TextField from '@mui/material/TextField';

import { FormControl, InputLabel, Select } from '@mui/material';
import { CustomPopover } from 'src/components/custom-popover';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  onResetPage: () => void;
  filters: UseSetStateReturn<IShopOwnerTableFilters>;
  options: {
    status: string[];
  };
};

export function UserTableToolbar({ filters, options, onResetPage }: Props) {
  const menuActions = usePopover();

  const { state: currentFilters, setState: updateFilters } = filters;

  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onResetPage();
      updateFilters({ name: event.target.value, phoneNumber: event.target.value });
    },
    [onResetPage, updateFilters]
  );

  const handleFilterStatus = useCallback(
    (event: SelectChangeEvent) => {
      onResetPage();
      updateFilters({ status: event.target.value as IShopOwnerTableFilters['status'] });
    },
    [onResetPage, updateFilters]
  );

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
        <MenuItem onClick={() => menuActions.onClose()}>
          <Iconify icon="solar:printer-minimalistic-bold" />
          Print
        </MenuItem>

        <MenuItem onClick={() => menuActions.onClose()}>
          <Iconify icon="solar:import-bold" />
          Import
        </MenuItem>

        <MenuItem onClick={() => menuActions.onClose()}>
          <Iconify icon="solar:export-bold" />
          Export
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

  return (
    <>
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
        <FormControl sx={{ width: { xs: 1, md: 200 } }}>
          <InputLabel>Status</InputLabel>
          <Select value={currentFilters.status} onChange={handleFilterStatus} label="Status">
            {options.status.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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
            value={currentFilters.name}
            onChange={handleFilterName}
            placeholder="Search..."
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              },
            }}
          />
          {/* 
          <IconButton onClick={menuActions.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton> */}
        </Box>
      </Box>

      {/* {renderMenuActions()} */}
    </>
  );
}
