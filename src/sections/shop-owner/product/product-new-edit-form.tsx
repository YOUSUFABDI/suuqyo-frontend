import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { ProductResDT } from './types/types';
import { UseCategories } from './hooks';
import { useUpdateProductMutation } from 'src/store/shop-owner/product';
import { getErrorMessage } from 'src/utils/error.message';

// ----------------------------------------------------------------------

export type NewProductSchemaType = zod.infer<typeof NewProductSchema>;

export const NewProductSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  content: schemaHelper.editor({ message: 'Content is required!' }),
  images: schemaHelper.files({ message: 'Images is required!' }),
  quantity: schemaHelper.nullableInput(
    zod.number({ coerce: true }).min(1, { message: 'Quantity is required!' }),
    {
      // message for null value
      message: 'Quantity is required!',
    }
  ),
  sellingPrice: schemaHelper.nullableInput(
    zod.number({ coerce: true }).min(1, { message: 'Price is required!' }),
    {
      // message for null value
      message: 'Price is required!',
    }
  ),
  // Not required
  categoryId: zod.number({ coerce: true }).nullable(),
  condition: zod.string(),
  model: zod.string(),
  description: zod.string(),
  discount: zod.number({ coerce: true }).nullable(),
});

// ----------------------------------------------------------------------

type Props = {
  currentProduct?: ProductResDT;
};

export function ProductNewEditForm({ currentProduct }: Props) {
  const router = useRouter();

  const { categories } = UseCategories();
  const [updateProduct, { isLoading }] = useUpdateProductMutation();

  const [includeTaxes, setIncludeTaxes] = useState(false);

  const defaultValues: NewProductSchemaType = {
    name: '',
    content: '',
    description: '',
    images: [],
    sellingPrice: null,
    discount: null,
    quantity: null,
    categoryId: null,
    condition: '',
    model: '',
  };

  const methods = useForm<NewProductSchemaType>({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
    values: currentProduct
      ? {
          ...currentProduct,
          images: currentProduct.images.map(
            (image) => (typeof image === 'string' ? image : image.image) // Assuming Image has a 'url' property
          ),
        }
      : undefined,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    const updateProductDto = {
      categoryId: data.categoryId,
      name: data.name,
      description: data.description,
      content: data.content,
      sellingPrice: data.sellingPrice,
      discount: data.discount,
      quantity: data.quantity,
      model: data.model,
      condition: data.condition,
    };
    const images = data.images;

    console.log('images', images);

    const formData = new FormData();
    formData.append('updateProductDto', JSON.stringify(updateProductDto));
    if (images && images.length > 0) {
      images.forEach((image) => {
        formData.append('images', image);
      });
    }

    try {
      await updateProduct({
        formData,
        id: Number(currentProduct?.id) || 0,
      }).unwrap();
      reset();
      toast.success('Updated!');
      router.push(paths.shopOwner.product.root);
    } catch (error) {
      console.error(error);
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    }
  });

  const handleRemoveFile = useCallback(
    (inputFile: File | string) => {
      const filtered = values.images && values.images?.filter((file) => file !== inputFile);
      setValue('images', filtered);
    },
    [setValue, values.images]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('images', [], { shouldValidate: true });
  }, [setValue]);

  const handleChangeIncludeTaxes = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setIncludeTaxes(event.target.checked);
  }, []);

  const renderDetails = () => (
    <Card>
      <CardHeader title="Details" subheader="Title, short description, image..." sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text name="name" label="Product name" />

        <Field.Text name="description" label="Sub description" multiline rows={4} />

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Content</Typography>
          <Field.Editor name="content" sx={{ maxHeight: 480 }} />
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Images</Typography>
          <Field.Upload
            multiple
            thumbnail
            name="images"
            maxSize={3145728}
            onRemove={handleRemoveFile}
            onRemoveAll={handleRemoveAllFiles}
            onUpload={() => console.info('ON UPLOAD')}
          />
        </Stack>
      </Stack>
    </Card>
  );

  const renderProperties = () => (
    <Card>
      <CardHeader
        title="Properties"
        subheader="Additional functions and attributes..."
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Box
          sx={{
            rowGap: 3,
            columnGap: 2,
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
          }}
        >
          <Field.Text
            name="quantity"
            label="Quantity"
            placeholder="0"
            type="number"
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <Field.Select
            name="categoryId"
            label="Category"
            slotProps={{
              select: { native: true },
              inputLabel: { shrink: true },
            }}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Field.Select>

          <Field.Select
            name="condition"
            label="Condition"
            slotProps={{
              select: { native: true },
              inputLabel: { shrink: true },
            }}
          >
            {['', 'USED', 'BRAND_NEW'].map((condition) => (
              <option key={condition} value={condition}>
                {condition}
              </option>
            ))}
          </Field.Select>

          <Field.Text name="model" label="Product model" />
        </Box>
      </Stack>
    </Card>
  );

  const renderPricing = () => (
    <Card>
      <CardHeader title="Pricing" subheader="Price related inputs" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text
          name="sellingPrice"
          label="price"
          placeholder="0.00"
          type="number"
          slotProps={{
            inputLabel: { shrink: true },
            input: {
              startAdornment: (
                <InputAdornment position="start" sx={{ mr: 0.75 }}>
                  <Box component="span" sx={{ color: 'text.disabled' }}>
                    $
                  </Box>
                </InputAdornment>
              ),
            },
          }}
        />

        <FormControlLabel
          control={
            <Switch id="toggle-taxes" checked={includeTaxes} onChange={handleChangeIncludeTaxes} />
          }
          label="Price includes Discount"
        />

        {!includeTaxes && (
          <Field.Text
            name="discount"
            label="Discount (%)"
            placeholder="0.00"
            type="number"
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                startAdornment: (
                  <InputAdornment position="start" sx={{ mr: 0.75 }}>
                    <Box component="span" sx={{ color: 'text.disabled' }}>
                      %
                    </Box>
                  </InputAdornment>
                ),
              },
            }}
          />
        )}
      </Stack>
    </Card>
  );

  const renderActions = () => (
    <Box
      sx={{
        gap: 3,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      <LoadingButton
        type="submit"
        variant="contained"
        size="large"
        loading={isSubmitting || isLoading}
      >
        Save changes
      </LoadingButton>
    </Box>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack
        spacing={{ xs: 3, md: 5 }}
        // sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}
      >
        {renderDetails()}
        {renderProperties()}
        {renderPricing()}
        {renderActions()}
      </Stack>
    </Form>
  );
}
