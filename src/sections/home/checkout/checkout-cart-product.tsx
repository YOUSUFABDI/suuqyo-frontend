import type { CheckoutContextValue, ICheckoutItem } from 'src/types/checkout';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

import { fCurrency } from 'src/utils/format-number';
import { Iconify } from 'src/components/iconify';
import { NumberInput } from 'src/components/number-input';

// ----------------------------------------------------------------------

type Props = {
  row: ICheckoutItem;
  onDeleteCartItem: CheckoutContextValue['onDeleteCartItem'];
  onChangeItemQuantity: CheckoutContextValue['onChangeItemQuantity'];
};

export function CheckoutCartProduct({ row, onDeleteCartItem, onChangeItemQuantity }: Props) {
  const isNonVariant =
    row.colors.length === 1 &&
    row.colors[0].id === 0 &&
    row.colors[0].sizes.length === 1 &&
    row.colors[0].sizes[0].id === 0;

  if (isNonVariant) {
    const size = row.colors[0].sizes[0];
    const itemId = `${row.id}-0-0`;

    return (
      <TableRow>
        <TableCell>
          <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar
              variant="rounded"
              alt={row.name}
              src={row.coverUrl}
              sx={{ width: 64, height: 64 }}
            />
            <Stack spacing={0.5}>
              <Typography noWrap variant="subtitle2" sx={{ maxWidth: 240 }}>
                {row.name}
              </Typography>
            </Stack>
          </Box>
        </TableCell>

        <TableCell>{row.price}</TableCell>

        <TableCell>
          <Box sx={{ width: 100, textAlign: 'right' }}>
            <NumberInput
              hideDivider
              value={size.quantity}
              onChange={(event, quantity: number) => onChangeItemQuantity(itemId, quantity)}
              // max={size.available}
              min={1}
            />
            {/* <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
              available: {size.available}
            </Typography> */}
          </Box>
        </TableCell>

        <TableCell align="right">{row.price * size.quantity}</TableCell>

        <TableCell align="right" sx={{ px: 1 }}>
          <IconButton onClick={() => onDeleteCartItem(row.id)}>
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  }

  // -------- Variant UI (existing layout) --------
  const totalQuantity = row.colors.reduce(
    (sum, color) => sum + color.sizes.reduce((s, size) => s + size.quantity, 0),
    0
  );

  const totalPrice = row.price * totalQuantity;

  return (
    <TableRow
      sx={{
        '&:hover': { backgroundColor: 'action.hover' },
        borderBottom: '1px solid',
        borderColor: 'divider',
        verticalAlign: 'middle',
      }}
    >
      <TableCell sx={{ py: 3 }}>
        <Grid container spacing={2}>
          <Grid item>
            <Avatar
              variant="rounded"
              alt={row.name}
              src={row.coverUrl}
              sx={{ width: 80, height: 80, borderRadius: 1.5 }}
            />
          </Grid>

          <Grid item xs>
            <Typography variant="subtitle1" fontWeight={600} mb={1}>
              {row.name}
            </Typography>

            <Stack spacing={2} divider={<Divider flexItem />}>
              {row.colors.map((color) => (
                <Box key={color.id}>
                  <Typography variant="body2" fontWeight={500} color="text.primary" mb={1}>
                    {color.name}
                  </Typography>

                  <Grid container spacing={1}>
                    {color.sizes.map((size) => (
                      <Grid item key={size.id}>
                        <Stack spacing={0.5} alignItems="flex-end">
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Chip
                              label={size.name}
                              size="small"
                              variant="outlined"
                              sx={{
                                borderRadius: 0.75,
                                fontWeight: 'fontWeightMedium',
                                minWidth: 60,
                              }}
                            />
                            <NumberInput
                              hideDivider
                              value={size.quantity}
                              onChange={(event, quantity: number) =>
                                onChangeItemQuantity(`${row.id}-${color.id}-${size.id}`, quantity)
                              }
                              max={size.available}
                              min={1}
                              sx={{
                                width: 100,
                                textAlign: 'right',
                                '& input': {
                                  textAlign: 'right',
                                },
                              }}
                            />
                          </Stack>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            available: {size.available}
                          </Typography>
                        </Stack>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </TableCell>

      <TableCell sx={{ py: 3, verticalAlign: 'top' }}>
        <Typography variant="body2" fontWeight={600}>
          {row.price}
        </Typography>
      </TableCell>

      <TableCell sx={{ py: 3, verticalAlign: 'top' }}>
        <Typography variant="subtitle2" fontWeight={600}>
          {totalQuantity}
        </Typography>
      </TableCell>

      <TableCell sx={{ py: 3, verticalAlign: 'top' }}>
        <Typography variant="subtitle2" fontWeight={600}>
          {totalPrice}
        </Typography>
      </TableCell>

      <TableCell align="right" sx={{ py: 3, verticalAlign: 'top' }}>
        <Button
          variant="outlined"
          size="small"
          color="error"
          onClick={() => onDeleteCartItem(row.id)}
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" width={18} />}
          sx={{
            borderWidth: 1,
            '&:hover': { borderWidth: 1 },
          }}
        >
          Remove
        </Button>
      </TableCell>
    </TableRow>
  );
}
