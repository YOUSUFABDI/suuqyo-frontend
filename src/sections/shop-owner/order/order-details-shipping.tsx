import Box from '@mui/material/Box';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';

import { CustomerDT, ShippingAddressDT } from './types/types';

// ----------------------------------------------------------------------

type Props = {
  shippingAddress?: ShippingAddressDT;
};

export function OrderDetailsShipping({ shippingAddress }: Props) {
  return (
    <>
      <CardHeader title="Shipping" />
      <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
        <Box sx={{ display: 'flex' }}>
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Address
          </Box>

          {/* {shippingAddress?.address} */}
          {shippingAddress?.deliveryAddress}
        </Box>
        <Box sx={{ display: 'flex' }}>
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Full name
          </Box>

          {shippingAddress?.fullName}
        </Box>

        <Box sx={{ display: 'flex' }}>
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Phone number
          </Box>

          {shippingAddress?.phoneNumber}
        </Box>
      </Stack>
    </>
  );
}
