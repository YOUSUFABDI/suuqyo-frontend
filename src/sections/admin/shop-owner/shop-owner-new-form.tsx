import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input/input';
import { z as zod } from 'zod';

import { useBoolean } from 'minimal-shared/hooks';

import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';

import { Field, Form, schemaHelper } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';
import { paths } from 'src/routes/paths';
import { useRegisterShopOwnerMutation } from 'src/store/admin/shop-owner';

import { Button, CardHeader, Divider, IconButton, InputAdornment } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { MultiFilePreview } from 'src/components/upload';
import { getErrorMessage } from 'src/utils/error.message';
import {
  createOptimizedFormData,
  getMobileUploadErrorMessage,
  isMobileDevice,
  showUploadProgress,
} from 'src/utils/mobile-upload';
import { diagnoseUploadIssue, logNetworkDiagnostics } from 'src/utils/network-diagnostics';
import { API } from 'src/store/api';
import { UseShopCategories } from './hooks';
import { useUser } from 'src/sections/auth/hooks';
import { useEffect } from 'react';

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
    // message for null value
    message: 'Country is required!',
  }),
  address: zod.string().min(1, { message: 'Address is required!' }),
  state: zod.string().min(1, { message: 'State is required!' }),
  city: zod.string().min(1, { message: 'City is required!' }),
  password: zod
    .string()
    .min(1, { message: 'Password is required!' })
    .min(6, { message: 'Password must be at least 6 characters!' }),
  // Shop detail
  shopLogo: schemaHelper.file().nullable().optional(),
  businessProof: schemaHelper.file().nullable().optional(),
  shopName: zod.string().min(1, { message: 'Shop name is required!' }),
  shopDescription: zod.string().min(1, { message: 'Shop description is required!' }),
  shopAddress: zod.string().min(1, { message: 'Shop address is required!' }),
  shopCategoryId: zod.number({ coerce: true }).nullable(),
  createdBy: zod.string(),
  paymentMethods: zod
    .array(
      zod.object({
        paymentName: zod.string().min(1, { message: 'Payment method is required!' }),
        paymentPhone: zod.string().min(1, { message: 'Payment phone is required!' }),
      })
    )
    .min(1, { message: 'At least one payment method is required!' })
    .max(4, { message: 'You can only add up to 4 payment methods!' }),
  policy: zod.boolean().refine((val) => val === true, {
    message: 'You must agree to the policy to register!',
  }),
});

// ----------------------------------------------------------------------

export function ShopOwnerNewForm() {
  const role = localStorage.getItem('role');
  const router = useRouter();
  const { shopCategories } = UseShopCategories();
  const { user } = useUser();

  const [registerShopOwner, { isLoading }] = useRegisterShopOwnerMutation();

  const showPassword = useBoolean();

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
    // Shop detail
    shopLogo: null,
    businessProof: null,
    shopName: '',
    shopDescription: '',
    shopAddress: '',
    shopCategoryId: null,
    paymentMethods: [{ paymentName: 'EVC_PLUS', paymentPhone: '' }],
    createdBy: '',
    policy: false,
  };

  const methods = useForm<NewUserSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();
  const businessProof = watch('businessProof');

  const handleAddPaymentMethod = () => {
    const currentMethods = methods.getValues('paymentMethods') || [];
    if (currentMethods.length < 4) {
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
    try {
      const createShopOwnerDto = {
        fullName: data.fullName,
        username: data.username,
        email: data.email,
        phoneNumber: data.phoneNumber,
        country: data.country,
        state: data.state,
        city: data.city,
        address: data.address,
        password: data.password,

        // shop detail
        shopName: data.shopName,
        shopDescription: data.shopDescription,
        shopAddress: data.shopAddress,
        shopCategoryId: data.shopCategoryId,

        paymentMethods: data.paymentMethods,

        createdBy: user?.username ?? '',
      };
      // console.log('---------', createShopOwnerDto);
      const profileImage = data.profileImage;
      const shopLogo = data.shopLogo;
      const businessProof = data.businessProof;
      // console.log('businessProof', businessProof);

      // Log network diagnostics before upload
      logNetworkDiagnostics('Before Upload');

      // Show progress message based on file sizes
      const filesToUpload = [profileImage, shopLogo, businessProof].filter(Boolean) as File[];
      if (filesToUpload.length > 0) {
        const progressMessage = showUploadProgress(filesToUpload);
        toast.info(progressMessage, {
          duration: 10000, // Show for 10 seconds for large files
          position: 'top-center',
        });

        // Additional warning for very large files
        const totalSize = filesToUpload.reduce((sum, file) => sum + file.size, 0);
        const totalSizeGB = totalSize / (1024 * 1024 * 1024);

        if (totalSizeGB >= 0.5) {
          // 500MB or larger
          toast.warning(
            'Large file detected! Please ensure you have a stable internet connection and keep this page open during upload. Do not close the browser or navigate away.',
            {
              duration: 15000, // Show for 15 seconds
              position: 'top-center',
            }
          );
        }
      }

      // Use optimized FormData creation for mobile
      const formData = await createOptimizedFormData(
        { createShopOwnerDto: JSON.stringify(createShopOwnerDto) },
        {
          profileImage: profileImage instanceof File ? profileImage : null,
          shopLogo: shopLogo instanceof File ? shopLogo : null,
          businessProof: businessProof instanceof File ? businessProof : null,
        }
      );

      await registerShopOwner(formData).unwrap();
      toast.success('Shop owner created successfully!');
      reset();
      if (role === 'ADMIN') {
        router.push(paths.dashboard.shopOwner.root);
      } else if (role === 'STAFF') {
        router.push(paths.staff.shopOwner.root);
      }
    } catch (error: any) {
      console.error('Shop owner creation error:', error);

      // Run diagnostics for upload failures
      const filesToUpload = [data.profileImage, data.shopLogo, data.businessProof].filter(
        Boolean
      ) as File[];
      const totalSize = filesToUpload.reduce((sum, file) => sum + file.size, 0);

      if (filesToUpload.length > 0) {
        // Run detailed diagnostics in background
        diagnoseUploadIssue(error, totalSize, API).catch(console.error);
      }

      // Use mobile-specific error messages
      const errorMessage = isMobileDevice()
        ? getMobileUploadErrorMessage(error)
        : getErrorMessage(error);

      toast.error(errorMessage, {
        duration: 8000, // Show error longer for debugging
        position: 'top-center',
      });
    }
  });

  const handleRemove = () => {
    setValue('businessProof', null, { shouldValidate: true });
  };

  useEffect(() => {
    if (user) {
      const mapped = {
        ...defaultValues,
        createdBy: user.username,
      };
      reset(mapped);
    }
  }, [user, reset]);

  return (
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
                <Box sx={{ mb: 5 }}>
                  <Field.UploadAvatar
                    name="profileImage"
                    // maxSize={3145728}
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
                        Shop owner image, allowed *.jpeg, *.jpg, *.png, *.gif
                        {/* <br /> max size of {fData(3145728)} */}
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

        {/*  payment method */}
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
                        slotProps={{
                          select: { native: true },
                          inputLabel: { shrink: true },
                        }}
                      >
                        <option value="EVC_PLUS">EVC Plus</option>
                        <option value="MERCHANT_WALLET">Merchant wallet</option>
                        <option value="EDAHAB">eDahab</option>
                        <option value="PREMIER_WALLET">Premier wallet</option>
                      </Field.Select>

                      <Field.Text
                        name={`paymentMethods.${index}.paymentPhone`}
                        label="Payment phone"
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
                      disabled={(methods.watch('paymentMethods')?.length || 0) >= 4}
                    >
                      Add Payment Method
                    </Button>
                    {(methods.watch('paymentMethods')?.length || 0) >= 4 && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                        Maximum of 4 payment methods allowed.
                      </Typography>
                    )}
                  </Box>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Card>
        {/*  payment method */}

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
                    // maxSize={3145728}
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
                        {/* <br /> max size of {fData(3145728)} */}
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
                    // maxSize={5242880}
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
                        {/* <br /> Max size of {fData(5242880)} */}
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
                          const file: any = businessProof;
                          const url = URL.createObjectURL(file);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = file.name;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
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
                    <option value=""></option>
                    {Array.isArray(shopCategories) && shopCategories.length > 0 ? (
                      shopCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))
                    ) : (
                      <option disabled>No categories available</option>
                    )}
                  </Field.Select>
                </Box>
              </Card>
            </Grid>

            {/* policy */}
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
                  <Field.Checkbox
                    name="policy"
                    label={
                      <Typography variant="body2">
                        Waxaan ogolaaday inaan qaado masuuliyadda soo gelinta badeeco sax ah,
                        xaqiijinta dalabaadka iyo helida lacagta dalabkaas una geeya macaamilkii
                        alaabta soo dalbaday. Sidoo kalena, lacag u celinta macaamilka ayadoo la
                        raacayo sharciga alaab celinta ee dalabkaas.
                      </Typography>
                    }
                  />
                </Box>
              </Card>
            </Grid>
            {/* policy */}
          </Grid>
        </Card>
        {/* shop detail */}

        <Divider />
        <Box>
          <Field.Text sx={{ pointerEvents: 'none' }} name="createdBy" label="Created by" />
        </Box>

        <Stack sx={{ mt: 3, alignItems: 'flex-end' }}>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Create shop owner
          </LoadingButton>
        </Stack>
      </Stack>
    </Form>
  );
}
