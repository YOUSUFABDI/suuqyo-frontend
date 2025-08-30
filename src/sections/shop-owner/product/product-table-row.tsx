import type { GridCellParams } from '@mui/x-data-grid';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Link from '@mui/material/Link';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';

import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

// ----------------------------------------------------------------------

type ParamsProps = {
  params: GridCellParams;
};

export function RenderCellPrice({ params }: ParamsProps) {
  return params.row.sellingPrice;
}

export function RenderCellPurchasePrice({ params }: ParamsProps) {
  return params.row.purchasePrice;
}

export function RenderCellCondition({ params }: ParamsProps) {
  return params.row?.condition;
}

export function RenderCellCreatedAt({ params }: ParamsProps) {
  return (
    <Stack spacing={0.5}>
      <Box component="span">{fDate(params.row.createdAt)}</Box>

      <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
        {fTime(params.row.createdAt)}
      </Box>
    </Stack>
  );
}

export function RenderCellStock({ params }: ParamsProps) {
  const { quantity, isFood, isAvailiable } = params.row;
  const maxQuantity = 100;

  // 🟢 Food item with availability ON
  if (isFood && isAvailiable) {
    return <Box sx={{ typography: 'caption', color: 'success.main' }}>Available</Box>;
  }

  // 🔴 Food item with availability OFF
  if (isFood && !isAvailiable) {
    return <Box sx={{ typography: 'caption', color: 'error.main' }}>Not Available</Box>;
  }

  // 🟡 Regular (non-food) stock display
  const safeQuantity = typeof quantity === 'number' ? quantity : 0;

  const stockLabel =
    safeQuantity === 0 ? 'out of stock' : safeQuantity <= 10 ? 'low stock' : 'in stock';

  return (
    <Stack justifyContent="center" sx={{ typography: 'caption', color: 'text.secondary' }}>
      <LinearProgress
        value={(safeQuantity * 100) / maxQuantity}
        variant="determinate"
        color={(safeQuantity === 0 && 'error') || (safeQuantity <= 10 && 'warning') || 'success'}
        sx={{
          mb: 1,
          width: 1,
          height: 6,
          maxWidth: 80,
        }}
      />
      {safeQuantity} {stockLabel}
    </Stack>
  );
}

export function RenderCellProduct({ params, href }: ParamsProps & { href: string }) {
  return (
    <Box
      sx={{
        py: 2,
        width: 1,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Avatar
        alt={params.row?.images[0]?.image}
        src={params.row?.images[0]?.image}
        variant="rounded"
        sx={{ width: 64, height: 64, mr: 2 }}
      />

      <ListItemText
        disableTypography
        primary={
          <Link
            component={RouterLink}
            href={href}
            noWrap
            color="inherit"
            variant="subtitle2"
            sx={{ cursor: 'pointer' }}
          >
            {params.row.name}
          </Link>
        }
        secondary={
          <Box component="div" sx={{ typography: 'body2', color: 'text.disabled' }}>
            {params.row?.category?.name}
          </Box>
        }
        sx={{ display: 'flex', flexDirection: 'column' }}
      />
    </Box>
  );
}
