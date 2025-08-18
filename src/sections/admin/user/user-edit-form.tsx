import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input/input';
import { z as zod } from 'zod';

import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { fData } from 'src/utils/format-number';

import { Field, Form, schemaHelper } from 'src/components/hook-form';
import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';

import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { Iconify } from 'src/components/iconify';

import { useBoolean } from 'minimal-shared/hooks';

import { ConfirmDialog } from 'src/components/custom-dialog';

import { CardHeader, Divider } from '@mui/material';
import { useEffect } from 'react';
import { useUpdateUserMutation } from 'src/store/admin/user';
import { getErrorMessage } from 'src/utils/error.message';
import { UseDeleteUser } from './hooks';
import { UserDT } from './types/types';

// ----------------------------------------------------------------------

export type NewUserSchemaType = zod.infer<typeof NewUserSchema>;

export const NewUserSchema = zod.object({
  profileImage: schemaHelper.file().nullable().optional(),
  fullName: zod.string().min(1, { message: 'Full name is required!' }),
  username: zod.string().min(1, { message: 'Usersername is required!' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  phoneNumber: schemaHelper.phoneNumber({ isValid: isValidPhoneNumber }),
  role: zod.string().min(1, { message: 'Role is required!' }),
  country: schemaHelper.nullableInput(zod.string().min(1, { message: 'Country is required!' }), {
    message: 'Country is required!',
  }),
  address: zod.string().min(1, { message: 'Address is required!' }),
  state: zod.string().min(1, { message: 'State is required!' }),
  city: zod.string().min(1, { message: 'City is required!' }),
  status: zod.boolean(),
  password: zod
    .string()
    .min(1, { message: 'Password is required!' })
    .min(6, { message: 'Password must be at least 6 characters!' })
    .optional()
    .or(zod.literal('')),
});

// ----------------------------------------------------------------------

type Props = {
  currentUser?: UserDT;
};

export function UserEditForm({ currentUser }: Props) {
  console.log('currentUser', currentUser);
  const router = useRouter();
  const showPassword = useBoolean();
  const confirmDialog = useBoolean();

  // Hook for RTK Query mutation
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const { deleteUser, isDeleting } = UseDeleteUser();

  const defaultValues: NewUserSchemaType = {
    profileImage: null,
    fullName: '',
    username: '',
    email: '',
    phoneNumber: '',
    role: '',
    country: '',
    state: '',
    city: '',
    address: '',
    password: '',
    status: false,
  };

  const methods = useForm<NewUserSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewUserSchema),
    defaultValues: currentUser || defaultValues,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const UpdateUserDto: any = {
        fullName: data.fullName,
        username: data.username,
        email: data.email,
        phoneNumber: data.phoneNumber,
        role: data.role,

        country: data.country,
        state: data.state,
        city: data.city,
        address: data.address,
      };
      // ✅ Only include password if it's not empty
      if (data.password?.trim()) {
        UpdateUserDto.password = data.password;
      }
      const profileImage = data.profileImage;

      const formData = new FormData();
      formData.append('UpdateUserDto', JSON.stringify(UpdateUserDto));
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      await updateUser({
        id: Number(currentUser?.id) || 0,
        formData,
      }).unwrap();

      toast.success('Saved changes');
      reset();
      router.push(paths.dashboard.user.root);
    } catch (error: any) {
      let errorMessage = 'An unexpected error occurred';
      if (error?.data?.error?.message) {
        errorMessage = error.data.error.message;
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      }
      toast.error(errorMessage);
    }
  });

  const handleDeleteShopOwner = async () => {
    if (!currentUser?.id) {
      toast.error('User not found');
      return;
    }

    try {
      await deleteUser(Number(currentUser.id)).unwrap();
      toast.success('User deleted successfully');
      confirmDialog.onFalse();
      router.push(paths.dashboard.shopOwner.root);
    } catch (error: any) {
      console.error('Error while deleting:', error);
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    }
  };

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete Shop Owner"
      content="Are you sure you want to delete this shop owner? This action cannot be undone."
      action={
        <Button
          variant="contained"
          color="error"
          onClick={async () => {
            await handleDeleteShopOwner();
            confirmDialog.onFalse();
          }}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      }
    />
  );

  useEffect(() => {
    if (currentUser) {
      const mapped = {
        ...defaultValues,
        ...currentUser,
        password: '',
      };
      reset(mapped);
    }
  }, [currentUser, reset]);

  return (
    <>
      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={{ xs: 3, md: 5 }}>
          {/* user detail */}
          <Card sx={{ width: '100%' }}>
            <CardHeader
              title="User detail"
              subheader="Full name, Phone number, image..."
              sx={{ mb: 3 }}
            />
            <Divider />

            <Grid container spacing={3} sx={{ p: 3 }}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ pt: 10, pb: 5, px: 3 }}>
                  {currentUser && (
                    <Label
                      color={values?.status ? 'success' : 'error'}
                      sx={{ position: 'absolute', top: 24, right: 24 }}
                    >
                      {values?.status ? 'Active' : 'Inactive'}
                    </Label>
                  )}

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

                  {currentUser && (
                    <Stack sx={{ mt: 3, alignItems: 'center', justifyContent: 'center' }}>
                      <Button
                        variant="soft"
                        color="error"
                        onClick={() => {
                          console.log('Opening delete confirmation dialog');
                          confirmDialog.onTrue();
                        }}
                      >
                        Delete user
                      </Button>
                    </Stack>
                  )}
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
                    <Field.Text name="fullName" label="Full name" />
                    <Field.Text name="username" label="Username" />
                    <Field.Text name="email" label="Email address" />
                    <Field.Phone name="phoneNumber" label="Phone number" />
                    <Field.Select
                      name="role"
                      label="Role"
                      value={values.role} // This binds the role value from the form state
                      slotProps={{
                        select: { native: true },
                        inputLabel: { shrink: true },
                      }}
                    >
                      {/* Select the role if it's available from the currentUser */}
                      <option value="" disabled>
                        Select Role
                      </option>
                      <option value="STAFF" selected={values.role === 'STAFF'}>
                        Staff
                      </option>
                      <option value="ADMIN" selected={values.role === 'ADMIN'}>
                        Admin
                      </option>{' '}
                      {/* Add more roles as needed */}
                    </Field.Select>

                    <Field.CountrySelect
                      fullWidth
                      name="country"
                      label="Country"
                      placeholder="Choose a country"
                    />

                    <Field.Text name="state" label="State/region" />
                    <Field.Text name="city" label="City" />
                    <Field.Text name="address" label="Address" />
                    <Field.Text
                      name="password"
                      label="Password"
                      placeholder="6+ characters"
                      type={showPassword.value ? 'text' : 'password'}
                      slotProps={{
                        inputLabel: { shrink: true },
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={showPassword.onToggle} edge="end">
                                <Iconify
                                  icon={
                                    showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'
                                  }
                                />
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Card>
          {/* user detail */}

          <Stack sx={{ mt: 3, alignItems: 'flex-end' }}>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              Save changes
            </LoadingButton>
          </Stack>
        </Stack>
      </Form>

      {renderConfirmDialog()}
    </>
  );
}
