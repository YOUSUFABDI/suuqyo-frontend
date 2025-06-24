import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { fData } from 'src/utils/format-number';

import { Field, Form, schemaHelper } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';
import { useUpdateShopDetailMutation } from 'src/store/shop-owner/shop';
import { UseShopDetail } from './hooks';

// ----------------------------------------------------------------------

export type UpdateUserSchemaType = zod.infer<typeof UpdateUserSchema>;

export const UpdateUserSchema = zod.object({
  shopName: zod.string().min(1, { message: 'shopName is required!' }).optional(),
  shopDescription: zod.string().min(1, { message: 'shopDescription is required!' }).optional(),
  shopAddress: zod.string().min(1, { message: 'shopAddress is required!' }).optional(),
  shopLogo: schemaHelper.file({ message: 'Avatar is required!' }).optional(),
});

// ----------------------------------------------------------------------

export function MyShop() {
  const { shopDetail } = UseShopDetail();
  const [updateShopDetail, { isLoading }] = useUpdateShopDetailMutation();

  const currentShop: UpdateUserSchemaType = {
    shopName: shopDetail?.shopName || '',
    shopDescription: shopDetail?.shopDescription || '',
    shopAddress: shopDetail?.shopAddress || '',
    shopLogo: shopDetail?.shopLogo || null,
  };

  const defaultValues: UpdateUserSchemaType = {
    shopName: '',
    shopDescription: '',
    shopAddress: '',
    shopLogo: null,
  };

  const methods = useForm<UpdateUserSchemaType>({
    mode: 'all',
    resolver: zodResolver(UpdateUserSchema),
    defaultValues,
    values: currentShop,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const updateShopDto = {
        shopName: data.shopName,
        shopDescription: data.shopDescription,
        shopAddress: data.shopAddress,
      };
      const shopLogo = data.shopLogo;

      const formData = new FormData();
      formData.append('updateShopDto', JSON.stringify(updateShopDto));
      if (shopLogo) {
        formData.append('shopLogo', shopLogo);
      }

      await updateShopDetail({
        formData,
      }).unwrap();
      toast.success('Saved changes');
    } catch (error) {
      console.error(error);
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
              <Field.Text name="shopName" label="Shop name" />
              <Field.Text name="shopDescription" label="Shop description" />
              <Field.Text name="shopAddress" label="Shop address" />
              <Field.Text
                sx={{ pointerEvents: 'none' }}
                name=""
                defaultValue={shopDetail?.ShopCategory?.name}
                // label="Shop category"
              />
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
