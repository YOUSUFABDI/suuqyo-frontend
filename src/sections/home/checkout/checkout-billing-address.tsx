import { useBoolean } from 'minimal-shared/hooks';
import { toast } from 'src/components/snackbar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Button from '@mui/material/Button';

import { _addressBooks } from 'src/_mock';

import { Iconify } from 'src/components/iconify';

import { useCheckoutContext } from './context';
import { CheckoutSummary } from './checkout-summary';
import { AddressItem, AddressNewForm } from '../address';
import { useCurrentShippingAddress } from '../address/hooks';
import { AddressDT } from '../address/types/types';

// ----------------------------------------------------------------------

export function CheckoutBillingAddress() {
  const { onChangeStep, onCreateBillingAddress, state: checkoutState } = useCheckoutContext();

  const addressForm = useBoolean();
  const { currentShippingAddress } = useCurrentShippingAddress();

  return (
    <>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <AddressItem
            address={currentShippingAddress}
            action={
              <Box sx={{ flexShrink: 0, display: 'flex', flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  size="small"
                  // onClick={() => {
                  //   // onChangeStep('next');
                  //   // onCreateBillingAddress(currentShippingAddress);
                  //   if (currentShippingAddress) {
                  //     // <- FIX
                  //     onChangeStep('next');
                  //     onCreateBillingAddress(currentShippingAddress);
                  //   }
                  // }}
                  onClick={() => {
                    if (currentShippingAddress) {
                      onChangeStep('next');
                      onCreateBillingAddress(currentShippingAddress);
                    } else {
                      toast.error('Please select or create a valid address.');
                    }
                  }}
                >
                  Deliver to this address
                </Button>
              </Box>
            }
            sx={[
              (theme) => ({
                p: 3,
                mb: 3,
                borderRadius: 2,
                boxShadow: theme.vars.customShadows.card,
              }),
            ]}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              size="small"
              color="inherit"
              onClick={() => onChangeStep('back')}
              startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
            >
              Back
            </Button>

            <Button
              size="small"
              color="primary"
              onClick={addressForm.onTrue}
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New address
            </Button>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <CheckoutSummary checkoutState={checkoutState} />
        </Grid>
      </Grid>

      <AddressNewForm
        open={addressForm.value}
        onClose={addressForm.onFalse}
        onCreate={(address: AddressDT) => {
          onChangeStep('next');
          onCreateBillingAddress(address);
        }}
      />
    </>
  );
}
