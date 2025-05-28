import type { PaperProps } from '@mui/material/Paper';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Label } from 'src/components/label';
import { AddressDT } from './types/types';

// ----------------------------------------------------------------------

type Props = PaperProps & {
  action?: React.ReactNode;
  address: AddressDT | null;
};

export function AddressItem({ address, action, sx, ...other }: Props) {
  return (
    <Paper
      sx={[
        () => ({
          gap: 2,
          display: 'flex',
          position: 'relative',
          alignItems: { md: 'flex-end' },
          flexDirection: { xs: 'column', md: 'row' },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Stack flexGrow={1} spacing={1}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="subtitle2">{address?.fullName}</Typography>

          <Label color="info" sx={{ ml: 1 }}>
            Default
          </Label>
        </Box>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {/* {address?.country}-{address?.city}-{address?.state}-{address?.address} */}
          {address?.country}-{address?.city}-{address?.state}-{address?.deliveryAddress}
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {address?.phoneNumber}
        </Typography>
      </Stack>

      {action && action}
    </Paper>
  );
}
