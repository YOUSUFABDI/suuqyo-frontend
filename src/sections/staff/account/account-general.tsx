import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input/input';
import { z as zod } from 'zod';

import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { fData } from 'src/utils/format-number';

import { Field, Form, schemaHelper } from 'src/components/hook-form';
import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { useUser } from 'src/sections/auth/hooks';
import { useUpdateUserMutation } from 'src/store/user/user';
import { getErrorMessage } from 'src/utils/error.message';

// ----------------------------------------------------------------------

export type UpdateUserSchemaType = zod.infer<typeof UpdateUserSchema>;

export const UpdateUserSchema = zod.object({
  fullName: zod.string().optional(),
  username: zod.string().optional(),
  sex: zod.string().optional(),
  email: zod.string().email().optional(),
  profileImage: schemaHelper.file().optional(),
  phoneNumber: schemaHelper.phoneNumber({ isValid: isValidPhoneNumber }).optional(),
  country: schemaHelper.nullableInput(zod.string(), {}).optional(),
  address: zod.string().optional(),
  state: zod.string().optional(),
  city: zod.string().optional(),
});

// ----------------------------------------------------------------------

export function AccountGeneral() {
  const { user, refetch } = useUser();
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const currentUser: UpdateUserSchemaType = {
    fullName: user?.fullName || '',
    username: user?.username || '',
    sex: user?.sex || '',
    email: user?.email || '',
    profileImage: user?.profileImage || null,
    phoneNumber: user?.phoneNumber || '',
    country: user?.country || null,
    city: user?.city || '',
    state: user?.state || '',
    address: user?.address || '',
  };

  const defaultValues: UpdateUserSchemaType = {
    fullName: '',
    username: '',
    sex: '',
    email: '',
    profileImage: null,
    phoneNumber: '',
    country: null,
    city: '',
    address: '',
    state: '',
  };

  const methods = useForm<UpdateUserSchemaType>({
    mode: 'all',
    resolver: zodResolver(UpdateUserSchema),
    defaultValues,
    values: currentUser,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const updateUserDto = {
        fullName: data.fullName,
        username: data.username,
        sex: data.sex,
        email: data.email,
        phoneNumber: data.phoneNumber,
        country: data.country,
        state: data.state,
        city: data.city,
        address: data.address,
      };
      const profileImage = data.profileImage;

      const formData = new FormData();
      formData.append('updateUserDto', JSON.stringify(updateUserDto));
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      await updateUser({
        id: Number(user?.id) || 0,
        formData,
      }).unwrap();

      refetch();

      toast.success('Saved changes');
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              pt: 10,
              pb: 5,
              px: 3,
              textAlign: 'center',
            }}
          >
            <Label
              color={user?.status ? 'success' : 'error'}
              sx={{ position: 'absolute', top: 24, right: 24 }}
            >
              {user?.status ? 'Active' : 'Inactive'}
            </Label>

            <Box sx={{ mb: 5 }}>
              <Field.UploadAvatar
                name="profileImage"
                maxSize={3145728}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <Field.Text name="fullName" label="Name" />
              <Field.Text name="username" label="Username" />
              <Field.Text name="email" label="Email address" />
              <Field.Phone name="phoneNumber" label="Phone number" />
              <Field.Text name="sex" label="Gender" />
              <Field.Text name="address" label="Address" />

              <Field.CountrySelect name="country" label="Country" placeholder="Choose a country" />

              <Field.Text name="state" label="State/region" />
              <Field.Text name="city" label="City" />
            </Box>

            <Stack spacing={3} sx={{ mt: 3, alignItems: 'flex-end' }}>
              <LoadingButton
                type="submit"
                variant="contained"
                disabled={isSubmitting || isLoading}
                loading={isSubmitting || isLoading}
              >
                Save changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
