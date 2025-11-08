import { useBoolean, usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';
import { Iconify } from 'src/components/iconify';

import { Typography } from '@mui/material';
import { ShopCategoryDT } from './types/types';
import { ShopCategoryQuickEditForm } from './shop-category-quick-edit-form';

// ----------------------------------------------------------------------

type Props = {
  row: ShopCategoryDT;
  selected: boolean;
  editHref: string;
  onSelectRow: () => void;
  onDeleteRow: (id: string) => void;
  isDeleting: boolean;
};

export function ShopCategoryTableRow({
  row,
  selected,
  editHref,
  onSelectRow,
  onDeleteRow,
  isDeleting,
}: Props) {
  // console.log('ShopCategoryTableRow rendering with row:', row);
  const menuActions = usePopover();
  const confirmDialog = useBoolean();
  const quickEditForm = useBoolean();

  const role = localStorage.getItem('role');

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
        <li>
          <MenuItem onClick={quickEditForm.onTrue}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>
        </li>

        <MenuItem
          onClick={() => {
            onDeleteRow(row.id);
            confirmDialog.onFalse();
            menuActions.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete"
      content="Are you sure want to delete?"
      action={
        <Button
          variant="contained"
          color="error"
          onClick={() => onDeleteRow(row.id)}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      }
    />
  );

  const renderQuickEditForm = () => (
    <ShopCategoryQuickEditForm
      currentColor={row}
      open={quickEditForm.value}
      onClose={quickEditForm.onFalse}
    />
  );

  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            onClick={onSelectRow}
            inputProps={{
              id: `${row.id}-checkbox`,
              'aria-label': `${row.id} checkbox`,
            }}
          />
        </TableCell>

        <TableCell>
          <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Typography color="inherit">{row.name}</Typography>
            </Stack>
          </Box>
        </TableCell>

        {role === 'ADMIN' && (
          <TableCell>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                color={menuActions.open ? 'inherit' : 'default'}
                onClick={menuActions.onOpen}
              >
                <Iconify icon="eva:more-vertical-fill" />
              </IconButton>
            </Box>
          </TableCell>
        )}
      </TableRow>

      {role === 'ADMIN' && renderMenuActions()}
      {renderConfirmDialog()}
      {renderQuickEditForm()}
    </>
  );
}
