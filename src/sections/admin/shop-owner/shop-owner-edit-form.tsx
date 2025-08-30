import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input/input';
import { boolean, z as zod } from 'zod';

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
import { MultiFilePreview } from 'src/components/upload';
import { useUpdateShopOwnerMutation } from 'src/store/admin/shop-owner';
import { getErrorMessage } from 'src/utils/error.message';
import { UseDeleteShopOwner, UseShopCategories } from './hooks';
import { ShopOwnerDT } from './types/types';
import { useEffect } from 'react';
import { useUser } from 'src/sections/auth/hooks';

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
  country: schemaHelper.nullableInput(zod.string().min(1, { message: 'Country is required!' }), {
    message: 'Country is required!',
  }),
  address: zod.string().min(1, { message: 'Address is required!' }),
  state: zod.string().min(1, { message: 'State is required!' }),
  city: zod.string().min(1, { message: 'City is required!' }),
  role: zod.string().min(1, { message: 'Role is required!' }),
  status: zod.boolean(),
  password: zod
    .string()
    .min(1, { message: 'Password is required!' })
    .min(6, { message: 'Password must be at least 6 characters!' })
    .optional()
    .or(zod.literal('')),
  // Shop detail
  shopLogo: schemaHelper.file().nullable().optional(),
  businessProof: schemaHelper.file().nullable().optional(),
  shopName: zod.string().min(1, { message: 'Shop name is required!' }),
  shopDescription: zod.string().min(1, { message: 'Shop description is required!' }),
  shopAddress: zod.string().min(1, { message: 'Shop address is required!' }),
  shopCategoryId: zod.number({ coerce: true }).nullable(),
  updatedBy: zod.string(),
  // Payment methods
  paymentMethods: zod
    .array(
      zod.object({
        paymentName: zod.string().min(1, { message: 'Payment method is required!' }),
        paymentPhone: zod.string().min(1, { message: 'Payment phone is required!' }),
      })
    )
    .min(1, { message: 'At least one payment method is required!' })
    .max(3, { message: 'You can only add up to 3 payment methods!' }),
});

// ----------------------------------------------------------------------

type Props = {
  currentUser?: ShopOwnerDT;
};

export function ShopOwnerEditForm({ currentUser }: Props) {
  // console.log('currentUser', currentUser);
  const role = localStorage.getItem('role');
  const router = useRouter();
  const { shopCategories } = UseShopCategories();
  const showPassword = useBoolean();
  const confirmDialog = useBoolean();
  const { user } = useUser();

  // Hook for RTK Query mutation
  const [updateShopOwner, { isLoading }] = useUpdateShopOwnerMutation();
  const { deleteShopOwner, isDeleting } = UseDeleteShopOwner();

  const defaultValues: NewUserSchemaType = {
    profileImage: null,
    fullName: '',
    username: '',
    email: '',
    phoneNumber: '',
    country: '',
    state: '',
    city: '',
    address: '',
    password: '',
    role: '',
    status: false,
    // Shop detail
    shopLogo: null,
    businessProof: null,
    shopName: '',
    shopDescription: '',
    shopAddress: '',
    shopCategoryId: null,
    // paymentMethods: [{ paymentName: 'EVC_PLUS', paymentPhone: '' }],
    paymentMethods: currentUser?.paymentMethods?.length
      ? currentUser.paymentMethods
      : [{ paymentName: 'EVC_PLUS', paymentPhone: '' }],
    updatedBy: '',
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
  const businessProof = watch('businessProof');

  const handleAddPaymentMethod = () => {
    const currentMethods = methods.getValues('paymentMethods') || [];
    if (currentMethods.length < 3) {
      methods.setValue('paymentMethods', [
        ...currentMethods,
        { paymentName: '', paymentPhone: '' },
      ]);
    }
  };

  const handleRemovePaymentMethod = (index: number) => {
    const currentMethods = methods.getValues('paymentMethods') || [];
    const newMethods = currentMethods.filter((_, i) => i !== index);
    methods.setValue('paymentMethods', newMethods);
  };

  const onSubmit = handleSubmit(async (data) => {
    if (role !== 'ADMIN') return;

    try {
      const updateShopOwnerDto: any = {
        fullName: data.fullName,
        username: data.username,
        email: data.email,
        phoneNumber: data.phoneNumber,

        country: data.country,
        state: data.state,
        city: data.city,
        address: data.address,
        // shop detail
        shopName: data.shopName,
        shopDescription: data.shopDescription,
        shopAddress: data.shopAddress,
        shopCategoryId: data.shopCategoryId,
        paymentMethods: data.paymentMethods,
        updatedBy: user?.username,
      };
      // ✅ Only include password if it's not empty
      if (data.password?.trim()) {
        updateShopOwnerDto.password = data.password;
      }
      const profileImage = data.profileImage;
      const shopLogo = data.shopLogo;
      const businessProof = data.businessProof;

      const formData = new FormData();
      formData.append('updateShopOwnerDto', JSON.stringify(updateShopOwnerDto));
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }
      if (shopLogo) {
        formData.append('shopLogo', shopLogo);
      }
      if (businessProof) {
        formData.append('businessProof', businessProof);
      }

      await updateShopOwner({
        id: Number(currentUser?.id) || 0,
        formData,
      }).unwrap();

      toast.success('Saved changes');
      reset();
      if (role === 'ADMIN') {
        router.push(paths.dashboard.shopOwner.root);
      } else if (role === 'STAFF') {
        router.push(paths.staff.shopOwner.root);
      }
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
      await deleteShopOwner(Number(currentUser.id)).unwrap();
      toast.success('User deleted successfully');
      confirmDialog.onFalse();
      router.push(paths.dashboard.shopOwner.root);
    } catch (error: any) {
      console.error('Error while deleting:', error);
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    }
  };

  const handleRemove = () => {
    setValue('businessProof', null, { shouldValidate: true });
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
        updatedby: currentUser.updatedBy,
        paymentMethods: currentUser.paymentMethods || defaultValues.paymentMethods,
        shopCategoryId: currentUser.ShopCategory.id,
      };
      reset(mapped);
    }
  }, [currentUser, reset]);

  return (
    <>
      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={{ xs: 3, md: 5 }}>
          {/* shop owner detail */}
          <Card sx={{ width: '100%' }}>
            <CardHeader
              title="Shop owner detail"
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

                  {currentUser && role === 'ADMIN' && (
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
          {/* shop owner detail */}

          {/* Payment method */}
          <Card sx={{ width: '100%' }}>
            <CardHeader
              title="Shop payment methods"
              subheader="Payment name, Payment number..."
              sx={{ mb: 3 }}
            />
            <Divider />

            <Grid container spacing={3} sx={{ p: 3 }}>
              <Grid size={{ xs: 12, md: 12 }}>
                <Card sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    {methods.watch('paymentMethods')?.map((method, index) => (
                      <Box
                        key={index}
                        sx={{
                          rowGap: 3,
                          columnGap: 2,
                          display: 'grid',
                          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr auto' },
                          alignItems: 'center',
                        }}
                      >
                        <Field.Select
                          name={`paymentMethods.${index}.paymentName`}
                          label="Payment method"
                          value={method.paymentName} // Set current value
                          slotProps={{
                            select: { native: true },
                            inputLabel: { shrink: true },
                          }}
                        >
                          <option value="" disabled>
                            Select payment method
                          </option>
                          <option value="EVC_PLUS">EVC Plus</option>
                          <option value="EDAHAB">eDahab</option>
                          <option value="PREMIER_WALLET">Premier wallet</option>
                        </Field.Select>

                        <Field.Text
                          name={`paymentMethods.${index}.paymentPhone`}
                          label="Payment phone"
                          value={method.paymentPhone} // Set current value
                        />

                        <Button
                          onClick={() => handleRemovePaymentMethod(index)}
                          sx={{ color: 'error.main' }}
                          disabled={methods.watch('paymentMethods')?.length <= 1}
                        >
                          <Iconify icon="solar:trash-bin-trash-bold" />
                        </Button>
                      </Box>
                    ))}

                    <Box>
                      <Button
                        variant="outlined"
                        startIcon={<Iconify icon="mingcute:add-line" />}
                        onClick={handleAddPaymentMethod}
                        disabled={(methods.watch('paymentMethods')?.length || 0) >= 3}
                      >
                        Add Payment Method
                      </Button>
                      {(methods.watch('paymentMethods')?.length || 0) >= 3 && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                          Maximum of 3 payment methods allowed.
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </Card>
          {/* Payment method */}

          {/* shop detail */}
          <Card sx={{ width: '100%' }}>
            <CardHeader
              title="Shop detail"
              subheader="Shop name, Shop address, shop logo..."
              sx={{ mb: 3 }}
            />
            <Divider />

            <Grid container spacing={3} sx={{ p: 3 }}>
              <Grid size={{ xs: 12, md: 4 }}>
                {/* shop logo */}
                <Card sx={{ pt: 10, pb: 5, px: 3 }}>
                  <Box sx={{ mb: 5 }}>
                    <Field.UploadAvatar
                      name="shopLogo"
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
                          Shop logo, allowed *.jpeg, *.jpg, *.png, *.gif
                          <br /> max size of {fData(3145728)}
                        </Typography>
                      }
                    />
                  </Box>
                </Card>
                {/* shop logo */}

                {/* businessProof */}
                <Card sx={{ pt: 10, pb: 5, px: 3, mt: 3 }}>
                  <Box sx={{ mb: 5 }}>
                    <Field.Upload
                      onDelete={() => {
                        methods.setValue('businessProof', null, { shouldValidate: true });
                      }}
                      name="businessProof"
                      accept={{ 'application/pdf': ['.pdf'] }}
                      maxSize={5242880}
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
                          Business proof / Shatiga Ganacsiga, allowed *.pdf
                          <br /> Max size of {fData(5242880)}
                        </Typography>
                      }
                    />
                    {businessProof && (
                      <>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            mt: 3,
                          }}
                        >
                          Download
                        </Typography>
                        <MultiFilePreview
                          files={[businessProof]}
                          thumbnail={false}
                          onRemove={handleRemove}
                          sx={{ my: 1, cursor: 'pointer' }}
                          onClick={() => {
                            const file = businessProof;
                            console.log('file', file);

                            const a = document.createElement('a');

                            if (typeof file === 'string') {
                              // Case 1: businessProof is a URL (already uploaded to Cloudinary)
                              a.href = `${file}?download=business-proof.pdf`; // Force download by appending query param
                              a.setAttribute('download', 'business-proof.pdf'); // Ensure it's treated as a download
                            } else if (file instanceof Blob) {
                              // Case 2: businessProof is a newly selected File
                              const url = URL.createObjectURL(file);
                              a.href = url;
                              a.setAttribute('download', file.name || 'business-proof.pdf');
                              URL.revokeObjectURL(url);
                            } else {
                              console.error('Invalid file type:', file);
                              return;
                            }

                            // Trigger download
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                          }}
                        />
                      </>
                    )}
                  </Box>
                </Card>
                {/* businessProof */}
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
                    <Field.Text name="shopName" label="Shop name" />
                    <Field.Text name="shopDescription" label="Shop description" />
                    <Field.Text name="shopAddress" label="Shop address" />
                    <Field.Select
                      name="shopCategoryId"
                      label="Shop category"
                      slotProps={{ select: { native: true }, inputLabel: { shrink: true } }}
                    >
                      <option value="" />
                      {Array.isArray(shopCategories) && shopCategories.length > 0 ? (
                        shopCategories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))
                      ) : (
                        <option disabled>No categories available</option>
                      )}
                    </Field.Select>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Card>
          {/* shop detail */}

          <Divider />
          <Box>
            <Field.Text sx={{ pointerEvents: 'none' }} name="updatedBy" label="Updated by" />
          </Box>

          {role === 'ADMIN' && (
            <Stack sx={{ mt: 3, alignItems: 'flex-end' }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save changes
              </LoadingButton>
            </Stack>
          )}
        </Stack>
      </Form>

      {renderConfirmDialog()}
    </>
  );
}
