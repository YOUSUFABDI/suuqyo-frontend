import type { IOrderDelivery } from 'src/types/order';

import Box from '@mui/material/Box';
import CardHeader from '@mui/material/CardHeader';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';

import { Autocomplete, TextField } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
  delivery?: IOrderDelivery;
};

export function OrderDetailsDelivery({ delivery }: Props) {
  return (
    <>
      <CardHeader title="Delivery" />
      <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Assign to Delivery
          </Box>
          {/* <Autocomplete
            fullWidth
            options={shopOwners}
            getOptionLabel={(option) =>
              `${option?.fullName || 'Unnamed'} (${option?.phoneNumber || 'No Phone'})`
            }
            filterOptions={(options, state) =>
              options.filter(
                (option) =>
                  option.fullName.toLowerCase().includes(state.inputValue.toLowerCase()) ||
                  option.phoneNumber?.toLowerCase().includes(state.inputValue.toLowerCase())
              )
            }
            value={selectedShopOwner}
            onChange={(event, newValue) => setSelectedShopOwner(newValue)} // Update selectedShopOwner here
            renderInput={(params) => <TextField {...params} label="Search by Name or Phone" />}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                {option.fullName} ({option.phoneNumber})
              </li>
            )}
          /> */}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Phone No.
          </Box>

          <Link underline="always" color="inherit">
            61XXXXXXX
          </Link>
        </Box>
      </Stack>
    </>
  );
}
