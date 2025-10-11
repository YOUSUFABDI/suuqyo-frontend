'use client';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { Label } from 'src/components/label';
import { fDate, fTime } from 'src/utils/format-time';
import { OrderStatusDT } from './types/types';

type Props = {
  row: OrderStatusDT;
  selected: boolean;
  onSelectRow: () => void;
};

export function OrderStatusTableRow({ row, selected, onSelectRow }: Props) {
  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox
          checked={selected}
          onClick={onSelectRow}
          inputProps={{
            id: `${row.shopOwnerId}-checkbox`,
            'aria-label': `${row.shopOwnerId} checkbox`,
          }}
        />
      </TableCell>

      {/* Shop Owner */}
      <TableCell sx={{ minWidth: 240 }}>
        <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
          <Avatar alt={row.name} />
          <ListItemText
            primary={row.name}
            secondary={
              <Box component="span" sx={{ display: 'inline-flex', gap: 1 }}>
                <Box component="span">{row.email}</Box>
                <Box component="span" sx={{ color: 'text.disabled' }}>
                  • {row.phoneNumber}
                </Box>
              </Box>
            }
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.25,
              component: 'span',
              typography: 'caption',
              noWrap: true,
            }}
          />
        </Box>
      </TableCell>

      {/* Shop Name */}
      <TableCell sx={{ minWidth: 160 }}>{row.shopName || '—'}</TableCell>

      {/* Status counts */}
      <TableCell align="center">
        <Label color="warning" variant="soft">
          {row.pending}
        </Label>
      </TableCell>
      <TableCell align="center">
        <Label color="info" variant="soft">
          {row.preparing}
        </Label>
      </TableCell>
      <TableCell align="center">
        <Label color="secondary" variant="soft">
          {row.delivering}
        </Label>
      </TableCell>
      <TableCell align="center">
        <Label color="success" variant="soft">
          {row.completed}
        </Label>
      </TableCell>
      <TableCell align="center">
        <Label color="error" variant="soft">
          {row.canceled}
        </Label>
      </TableCell>
      <TableCell align="center">
        <Label variant="soft">{row.refunded}</Label>
      </TableCell>

      {/* Total */}
      <TableCell align="center" sx={{ fontWeight: 600 }}>
        {row.totalOrders}
      </TableCell>

      {/* Last order */}
      <TableCell>
        {row.lastOrderDate ? (
          <ListItemText
            primary={fDate(row.lastOrderDate)}
            secondary={row.timeAgo || fTime(row.lastOrderDate)}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
              noWrap: true,
            }}
          />
        ) : (
          '—'
        )}
      </TableCell>
    </TableRow>
  );
}
