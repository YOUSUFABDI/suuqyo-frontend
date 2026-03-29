import { zodResolver } from '@hookform/resolvers/zod';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import { useForm } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input/input';
import { toast } from 'src/components/snackbar';
import { z as zod } from 'zod';

import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { Field, Form, schemaHelper } from 'src/components/hook-form';
import { useUpdateShippingAddressMutation } from 'src/store/customer/order';
import { getErrorMessage } from 'src/utils/error.message';
import { AddressDT } from './types/types';

// ----------------------------------------------------------------------

export type NewAddressSchemaType = zod.infer<typeof NewAddressSchema>;

export const NewAddressSchema = zod.object({
  city: zod.string().min(1, { message: 'City is required!' }),
  state: zod.string().min(1, { message: 'State is required!' }),
  name: zod.string().min(1, { message: 'Name is required!' }),
  address: zod.string().min(1, { message: 'Address is required!' }),
  deliveryAddress: zod.string().min(1, { message: 'deliveryAddress is required!' }),
  phoneNumber: schemaHelper.phoneNumber({ isValid: isValidPhoneNumber }),
  country: schemaHelper.nullableInput(zod.string().min(1, { message: 'Country is required!' }), {
    // message for null value
    message: 'Country is required!',
  }),
});

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (address: AddressDT) => void;
};

export function AddressNewForm({ open, onClose, onCreate }: Props) {
  const [hasFetchedAddress, setHasFetchedAddress] = useState(false);

  const defaultValues: NewAddressSchemaType = {
    name: '',
    city: '',
    state: '',
    address: '',
    deliveryAddress: '',
    country: '',
    phoneNumber: '',
  };

  const methods = useForm<NewAddressSchemaType>({
    mode: 'all',
    resolver: zodResolver(NewAddressSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = methods;

  const [updateShippingAddress, { isLoading }] = useUpdateShippingAddressMutation();

  const onSubmit = handleSubmit(async (data) => {
    const reqData = {
      fullName: data.name,
      country: data.country ?? '',
      city: data.city,
      state: data.state,
      address: data.address,
      deliveryAddress: data.deliveryAddress,
      phoneNumber: String(data.phoneNumber),
    };
    try {
      const response = await updateShippingAddress(reqData).unwrap();
      if (response.error === null) {
        const newAddress: AddressDT = {
          id: response.payload.data.id, // Ensure this is a number
          fullName: data.name,
          country: data.country ?? '',
          city: data.city,
          state: data.state,
          address: data.address,
          deliveryAddress: data.deliveryAddress,
          phoneNumber: data.phoneNumber,
        };
        onCreate(newAddress); // Pass the new address to parent
        onClose();
        toast.success('Saved!');
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    }
  });

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`
          );

          const data = await response.json();

          if (data.status === 'OK' && data.results.length > 0) {
            const address = data.results[0].formatted_address;
            methods.setValue('address', address);
            setHasFetchedAddress(true); // 👈 Show address field
            toast.success('Address autofilled!');
          } else {
            toast.error('Could not fetch address from location');
          }
        } catch (error) {
          toast.error('Error fetching address');
        }
      },
      (error) => {
        toast.error('Could not get your location');
      }
    );
  };

  // Auto-fetch user's address on open
  useEffect(() => {
    if (!open || hasFetchedAddress) return;

    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyCshsTPtTESZ2xsLnaH5E65yr5CzWJkCHQ`
          );

          const data = await response.json();

          if (data.status === 'OK' && data.results.length > 0) {
            const address = data.results[0].formatted_address;
            setValue('address', address);
            setHasFetchedAddress(true);
            toast.success('Address autofilled!');
          } else {
            toast.error('Could not fetch address from location');
          }
        } catch (error) {
          toast.error('Error fetching address');
        }
      },
      () => {
        toast.error('Could not get your location');
      }
    );
  }, [open, hasFetchedAddress, setValue]);

  return (
    <>
      <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
        <Form methods={methods} onSubmit={onSubmit}>
          <DialogTitle>New address</DialogTitle>

          <DialogContent dividers>
            <Stack spacing={3}>
              <Box
                sx={{
                  mt: 1,
                  rowGap: 3,
                  columnGap: 2,
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              >
                <Field.Text name="name" label="Full name" />

                <Field.Phone name="phoneNumber" label="Phone number" country="US" />
              </Box>

              <Field.CountrySelect name="country" label="Country" placeholder="Choose a country" />

              <Box
                sx={{
                  rowGap: 3,
                  columnGap: 2,
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              >
                <Field.Text name="city" label="Town/city" />

                <Field.Text name="state" label="State" />
              </Box>

              <Box>
                <Field.Text name="deliveryAddress" label="Delivery address" />
                {hasFetchedAddress && (
                  <Field.Text name="address" label="Address" sx={{ display: 'none' }} />
                )}

                {/* <Stack direction="row" spacing={1} mt={1}>
                  <Button variant="text" size="small" onClick={handleUseCurrentLocation}>
                    Use my current location
                  </Button>
                </Stack> */}
              </Box>
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button color="inherit" variant="outlined" onClick={onClose}>
              Cancel
            </Button>

            <LoadingButton type="submit" variant="contained" loading={isSubmitting || isLoading}>
              Deliver to this address
            </LoadingButton>
          </DialogActions>
        </Form>
      </Dialog>
    </>
  );
}
