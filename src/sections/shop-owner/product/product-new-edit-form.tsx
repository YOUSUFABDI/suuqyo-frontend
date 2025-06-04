import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { Field, Form, schemaHelper } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';
import { useUpdateProductMutation } from 'src/store/shop-owner/product';
import { getErrorMessage } from 'src/utils/error.message';
import { UseCategories } from './hooks';
import { ProductResDT } from './types/types';

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
  description: zod.string(),
  discount: zod.number({ coerce: true }).nullable(),
});

// ----------------------------------------------------------------------

type Props = {
  currentProduct?: ProductResDT | null;
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
    // Prepare the product data (excluding files)
    const updateProductDto = {
      categoryId: data.categoryId,
      name: data.name,
      description: data.description,
      content: data.content,
      sellingPrice: data.sellingPrice,
      discount: data.discount,
      quantity: data.quantity,
      condition: data.condition,
    };

    // Create FormData object
    const formData = new FormData();

    // Append the product data (non-file fields) as a JSON string
    formData.append('updateProductDto', JSON.stringify(updateProductDto));

    // Handle the images: check if they're strings and convert them to files
    const imageFiles = data.images.map((image: any) => {
      if (typeof image === 'string') {
        // If the image is a string (URL or base64), convert it to a File object
        // Here we would need to fetch the image or create a Blob from base64 data
        return fetch(image)
          .then((response) => response.blob())
          .then((blob) => {
            const file = new File([blob], 'image.jpg', { type: blob.type });
            return file;
          });
      }
      return image instanceof File ? image : null;
    });

    // Wait for all promises (if images are being converted from strings to Files)
    const resolvedImageFiles = await Promise.all(imageFiles);

    // Filter out any null values (in case there were invalid images)
    const validImageFiles = resolvedImageFiles.filter((file) => file instanceof File);

    // Append the image files to the FormData
    validImageFiles.forEach((file) => {
      formData.append('images', file);
    });

    try {
      // Send the FormData to the API
      await updateProduct({
        formData,
        id: Number(currentProduct?.id) || 0,
      }).unwrap();

      // Reset the form and show success message
      reset();
      toast.success('Product updated successfully!');
      router.push(paths.shopOwner.product.root);
    } catch (error) {
      // Handle any error that occurred during the API call
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
