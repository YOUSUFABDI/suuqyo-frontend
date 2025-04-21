import Box from '@mui/material/Box';
import CardHeader from '@mui/material/CardHeader';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';

import { Autocomplete, TextField } from '@mui/material';
import { useState } from 'react';
import { UseDeliveryUsers } from '../delivery-user/hooks';
import { DeliveryUserResDT } from '../delivery-user/types/types';
import { DeliveryUserDT } from './types/types';

// ----------------------------------------------------------------------

type Props = {
  delivery?: DeliveryUserDT;
};

export function OrderDetailsDelivery({ delivery }: Props) {
  const { deliveryUsers } = UseDeliveryUsers();
  const [selectedDeliveryUser, setSelectedDeliveryUser] = useState<DeliveryUserResDT | null>(null);
  return (
    <>
      <CardHeader title="Delivery" />
      <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Assign to Delivery
          </Box>
          <Autocomplete
            fullWidth
            options={deliveryUsers}
            getOptionLabel={(option) =>
              `${option.user?.fullName || 'Unnamed'} (${option.user?.phoneNumber || 'No Phone'})`
            }
            filterOptions={(options, state) =>
              options.filter(
                (option) =>
                  option.user.fullName.toLowerCase().includes(state.inputValue.toLowerCase()) ||
                  option.user.phoneNumber?.toLowerCase().includes(state.inputValue.toLowerCase())
              )
            }
            value={selectedDeliveryUser}
            onChange={(event, newValue) => setSelectedDeliveryUser(newValue)}
            renderInput={(params) => <TextField {...params} label="Search Delivery Users" />}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                {option.user.fullName} ({option.user.phoneNumber})
              </li>
            )}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Name
          </Box>
          {selectedDeliveryUser?.user.fullName || delivery?.user.fullName}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Phone no
          </Box>
          <Link underline="always" color="inherit">
            {selectedDeliveryUser?.user.phoneNumber || delivery?.user.phoneNumber}
          </Link>
        </Box>
      </Stack>
    </>
  );
}
