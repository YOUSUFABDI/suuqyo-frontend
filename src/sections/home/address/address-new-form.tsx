import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input/input';
import { z as zod } from 'zod';
import { toast } from 'src/components/snackbar';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';

import { Field, Form, schemaHelper } from 'src/components/hook-form';
import { AddressDT } from './types/types';
import {
  useGetCurrentShippingAddressQuery,
  useUpdateShippingAddressMutation,
} from 'src/store/customer/order';
import { getErrorMessage } from 'src/utils/error.message';

// ----------------------------------------------------------------------

export type NewAddressSchemaType = zod.infer<typeof NewAddressSchema>;

export const NewAddressSchema = zod.object({
  city: zod.string().min(1, { message: 'City is required!' }),
  state: zod.string().min(1, { message: 'State is required!' }),
  name: zod.string().min(1, { message: 'Name is required!' }),
  address: zod.string().min(1, { message: 'Address is required!' }),
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
  const defaultValues: NewAddressSchemaType = {
    name: '',
    city: '',
    state: '',
    address: '',
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
  } = methods;

  const [updateShippingAddress, { isLoading }] = useUpdateShippingAddressMutation();

  const onSubmit = handleSubmit(async (data) => {
    const reqData = {
      fullName: data.name,
      country: data.country ?? '',
      city: data.city,
      state: data.state,
      address: data.address,
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

  return (
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
            <Field.Text name="address" label="Address" />
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
  );
}
