'use client';

import React, { useEffect, useCallback, useMemo } from 'react';
import { useForm, useFieldArray, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { Field, Form, schemaHelper } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import { useUpdateProductMutation } from 'src/store/shop-owner/product';
import { getErrorMessage } from 'src/utils/error.message';
import { UseCategories, UseVariants } from './hooks';
import { ProductResDT, VariantOptionDT } from './types/types';

// [!code ++]
// THIS SCHEMA IS NOW ALIGNED WITH THE CREATE FORM'S LOGIC
export const UpdateProductSchema = zod
  .object({
    name: zod.string().min(1, { message: 'Name is required!' }),
    content: schemaHelper.editor({ message: 'Content is required!' }),
    images: schemaHelper.files({ message: 'Images is required!' }),
    sellingPrice: schemaHelper.nullableInput(
      zod.number({ coerce: true }).min(1, { message: 'Price is required!' }),
      { message: 'Price is required!' }
    ),
    purchasePrice: schemaHelper.nullableInput(
      zod.number({ coerce: true }).min(1, { message: 'Purchase price is required!' }),
      { message: 'Purchase price is required!' }
    ),
    // discount: zod.any().optional(),
    discount: zod
      .preprocess(
        (val) => (val === '' || val === null ? 0 : val),
        zod
          .number({ coerce: true })
          .min(0, { message: 'Discount cannot be negative.' })
          .max(100, { message: 'Discount cannot exceed 100.' })
      )
      .optional(),
    categoryId: zod.number({ coerce: true }).nullable(),
    description: zod.string(),
    isFood: zod.boolean(),
    isAvailiable: zod.boolean().optional(),
    condition: zod.string().optional(),
    hasVariants: zod.boolean(),
    quantity: zod.any().optional(), // Base schema is permissive, logic handled in `.refine`
    variants: zod
      .array(
        zod.object({
          id: zod.number().optional(), // id is optional for new variants
          color: zod.string().min(1, { message: 'Color is required.' }),
          size: zod.string().min(1, { message: 'Size is required.' }),
          quantity: zod
            .number({ coerce: true })
            .min(1, { message: 'Quantity must be at least 1.' }),
        })
      )
      .optional(),
  })
  .refine(
    (data) => {
      // Logic for non-food items
      if (!data.isFood) {
        if (!data.condition) return false;
        if (data.hasVariants) {
          return data.variants && data.variants.length > 0;
        }
        const qty = Number(data.quantity);
        return !(data.quantity === null || data.quantity === '' || isNaN(qty) || qty < 0);
      }
      return true;
    },
    {
      message: 'Invalid non-food product properties.',
      path: ['condition', 'variants', 'quantity'],
    }
  )
  .refine(
    (data) => {
      // Logic for STOCKED food items (isFood=true, isAvailable=false)
      if (data.isFood && !data.isAvailiable) {
        const qty = Number(data.quantity);
        return !(data.quantity === null || data.quantity === '' || isNaN(qty) || qty < 0);
      }
      return true;
    },
    {
      message: 'Quantity is required for stocked food items.',
      path: ['quantity'],
    }
  );
// [!code ++]

export type UpdateProductSchemaType = zod.infer<typeof UpdateProductSchema>;

async function urlToFile(url: string, filename: string, mimeType?: string): Promise<File> {
  const res = await fetch(url);
  const blob = await res.blob();
  return new File([blob], filename, { type: mimeType || blob.type });
}

type Props = {
  currentProduct: (ProductResDT & { isFood: boolean; isAvailiable: boolean }) | null;
};

export function ProductNewEditForm({ currentProduct }: Props) {
  const router = useRouter();
  const { categories } = UseCategories();
  const { variants } = UseVariants();
  const [updateProduct, { isLoading }] = useUpdateProductMutation();

  const defaultValues = useMemo<UpdateProductSchemaType>(
    () => ({
      name: currentProduct?.name || '',
      content: currentProduct?.content || '',
      description: currentProduct?.description || '',
      images: currentProduct?.images.map((i) => i.image) || [],
      sellingPrice: currentProduct?.sellingPrice || null,
      purchasePrice: currentProduct?.purchasePrice || null,
      discount: currentProduct?.discount || 0,
      categoryId: currentProduct?.categoryId || null,
      isFood: currentProduct?.isFood || false,
      isAvailiable: currentProduct?.isAvailiable || false,
      condition: currentProduct?.condition || 'BRAND_NEW',
      // [!code ++]
      hasVariants: !!currentProduct?.variants && currentProduct.variants.length > 0,
      quantity: currentProduct?.quantity ?? 0,
      variants:
        currentProduct?.variants?.map((v) => ({
          id: v.id,
          color: v.color.name,
          size: v.size.name,
          quantity: v.quantity,
        })) || [],
      // [!code ++]
    }),
    [currentProduct]
  );

  const methods = useForm<UpdateProductSchemaType>({
    resolver: zodResolver(UpdateProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentProduct) {
      reset(defaultValues);
    }
  }, [currentProduct, defaultValues, reset]);

  const { fields, append, remove } = useFieldArray({ name: 'variants', control });
  const values = watch();

  const sellingPrice = useWatch({ control, name: 'sellingPrice' });
  const discount = useWatch({ control, name: 'discount' });

  const afterDiscountPrice = useMemo(() => {
    const price = sellingPrice ?? 0;
    const disc = discount ?? 0;
    if (disc <= 0) return price;
    return price - price * (disc / 100);
  }, [sellingPrice, discount]);

  const onSubmit = handleSubmit(async (data) => {
    if (!currentProduct) return;

    try {
      const dto: any = {
        categoryId: data.categoryId,
        name: data.name,
        description: data.description,
        content: data.content,
        sellingPrice: data.sellingPrice,
        purchasePrice: data.purchasePrice,
        isFood: data.isFood,
        isAvailiable: data.isAvailiable,
      };

      if (data.discount !== null && data.discount !== undefined) {
        // console.log('data.discount', data.discount);
        dto.discount = data.discount;
      }

      const isService = data.isFood && data.isAvailiable;

      if (data.isFood) {
        if (!isService) {
          dto.quantity = data.quantity;
        }
      } else {
        dto.condition = data.condition;
        if (data.hasVariants) {
          if (data.variants && data.variants.length > 0) {
            dto.variants = data.variants.map((v) => ({
              id: v.id,
              colorId: variants!.colors.find((c) => c.name === v.color)!.id,
              sizeId: variants!.sizes.find((s) => s.name === v.size)!.id,
              quantity: v.quantity,
            }));
          } else {
            dto.variants = []; // Send empty array to clear variants
          }
        } else {
          dto.quantity = data.quantity;
          dto.variants = []; // Ensure variants are cleared if hasVariants is false
        }
      }

      const formData = new FormData();
      formData.append('updateProductDto', JSON.stringify(dto));

      const imageFiles = await Promise.all(
        data.images.map((img) => {
          if (img instanceof File) return Promise.resolve(img);
          const filename = img.substring(img.lastIndexOf('/') + 1);
          return urlToFile(img, filename);
        })
      );

      if (imageFiles.length > 0) {
        imageFiles.forEach((file) => formData.append('images', file));
      } else {
        formData.append('images', new Blob());
      }

      await updateProduct({ id: Number(currentProduct.id), formData }).unwrap();

      toast.success('Product updated successfully!');
      router.push(paths.shopOwner.product.root);
    } catch (err) {
      console.error('Submission Error:', err);
      toast.error(getErrorMessage(err));
    }
  });

  const handleRemoveFile = useCallback(
    (file: File | string) =>
      setValue(
        'images',
        (values.images || []).filter((f) => f !== file),
        { shouldValidate: true }
      ),
    [setValue, values.images]
  );
  const handleRemoveAll = useCallback(
    () => setValue('images', [], { shouldValidate: true }),
    [setValue]
  );

  // [!code ++]
  const handleChangeIsFood = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const checked = event.target.checked;
      setValue('isFood', checked, { shouldValidate: true });

      if (checked) {
        setValue('variants', []);
        setValue('condition', '');
        setValue('hasVariants', false);
        setValue('quantity', 1); // Default for "stocked food"
      } else {
        setValue('quantity', 0);
        setValue('isAvailiable', false);
        setValue('condition', 'BRAND_NEW');
      }
    },
    [setValue]
  );

  const handleChangeHasVariants = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const checked = event.target.checked;
      setValue('hasVariants', checked, { shouldValidate: true });

      if (checked) {
        setValue('quantity', null);
        if (fields.length === 0) {
          // Only add a new variant if none exist
          append({ color: '', size: '', quantity: 1 });
        }
      } else {
        setValue('variants', []);
        setValue('quantity', 0);
      }
    },
    [setValue, fields.length, append]
  );

  const handleChangeIsAvailiable = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const checked = event.target.checked;
      setValue('isAvailiable', event.target.checked, { shouldValidate: true });

      if (values.isFood) {
        if (checked) {
          // Is a service, quantity is not tracked
          setValue('quantity', null);
        } else {
          // Is a stocked food item
          setValue('quantity', 1);
        }
      }
    },
    [setValue, values.isFood]
  );
  // [!code ++]

  const renderDetails = () => (
    <Card>
      <CardHeader title="Details" subheader="Title, description & images" sx={{ mb: 3 }} />
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text name="name" label="Name" />
        <Field.Text name="description" label="Short description" multiline rows={3} />
        <Typography variant="subtitle2">Content</Typography>
        <Field.Editor name="content" sx={{ maxHeight: 400 }} />
        <Typography variant="subtitle2">Images</Typography>
        <Field.Upload
          multiple
          thumbnail
          name="images"
          onRemove={handleRemoveFile}
          onRemoveAll={handleRemoveAll}
        />
      </Stack>
    </Card>
  );

  const renderProperties = () => {
    // [!code ++]
    // Logic is now identical to create form
    const showQuantityField = !values.isFood && !values.hasVariants;
    // [!code ++]

    return (
      <Card>
        <CardHeader
          title="Properties"
          subheader="Category, food/service, variants"
          sx={{ mb: 3 }}
        />
        <Divider />
        <Stack spacing={3} sx={{ p: 3 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <Field.Select
              name="categoryId"
              label="Category"
              slotProps={{ select: { native: true }, inputLabel: { shrink: true } }}
            >
              <option value="" />
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Field.Select>
            <Controller
              name="isFood"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch {...field} checked={field.value} onChange={handleChangeIsFood} />
                  }
                  label="Food"
                />
              )}
            />
            {values.isFood && (
              <Controller
                name="isAvailiable"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        {...field}
                        checked={field.value}
                        onChange={handleChangeIsAvailiable}
                      />
                    }
                    label="Available for service (Made to order)"
                  />
                )}
              />
            )}
            {!values.isFood && (
              <Field.Select
                name="condition"
                label="Condition"
                slotProps={{ select: { native: true }, inputLabel: { shrink: true } }}
              >
                <option value="" />
                <option value="USED">USED</option>
                <option value="BRAND_NEW">BRAND_NEW</option>
              </Field.Select>
            )}
            {/* [!code ++] */}
            {!values.isFood && (
              <Controller
                name="hasVariants"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch {...field} checked={field.value} onChange={handleChangeHasVariants} />
                    }
                    label="Has Variants"
                  />
                )}
              />
            )}
            {/* [!code ++] */}
          </Box>

          {showQuantityField && (
            <Field.Text
              name="quantity"
              label="Quantity in Stock"
              type="number"
              slotProps={{ inputLabel: { shrink: true } }}
            />
          )}

          {!values.isFood && values.hasVariants && (
            <Box>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Variants
              </Typography>
              <Stack spacing={3}>
                {fields.map((field, idx) => (
                  <Stack
                    key={field.id}
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={2}
                    alignItems="center"
                  >
                    <Field.Select
                      name={`variants.${idx}.color`}
                      label="Color"
                      fullWidth
                      slotProps={{ select: { native: true }, inputLabel: { shrink: true } }}
                    >
                      <option value="">Select Color</option>
                      {variants?.colors?.map((col) => (
                        <option key={col.id} value={col.name}>
                          {col.name}
                        </option>
                      ))}
                    </Field.Select>

                    <Field.Select
                      name={`variants.${idx}.size`}
                      label="Size"
                      fullWidth
                      slotProps={{ select: { native: true }, inputLabel: { shrink: true } }}
                    >
                      <option value="">Select Size</option>
                      {variants?.sizes?.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </Field.Select>

                    <Field.Text
                      name={`variants.${idx}.quantity`}
                      label="Quantity"
                      type="number"
                      fullWidth
                      slotProps={{ inputLabel: { shrink: true } }}
                    />

                    <IconButton onClick={() => remove(idx)} color="error">
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  </Stack>
                ))}

                <Box>
                  <LoadingButton
                    type="button"
                    onClick={() => append({ color: '', size: '', quantity: 1 })}
                    startIcon={<Iconify icon="mingcute:add-line" />}
                    variant="outlined"
                  >
                    Add Variant
                  </LoadingButton>
                </Box>
              </Stack>
            </Box>
          )}
        </Stack>
      </Card>
    );
  };

  const renderPricing = () => (
    <Card>
      <CardHeader title="Pricing" subheader="Price related inputs" sx={{ mb: 3 }} />
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text
          name="purchasePrice"
          label="Purchase price"
          type="number"
          slotProps={{
            inputLabel: { shrink: true },
            input: { startAdornment: <InputAdornment position="start">$</InputAdornment> },
          }}
        />
        <Field.Text
          name="sellingPrice"
          label="Price"
          type="number"
          slotProps={{
            inputLabel: { shrink: true },
            input: { startAdornment: <InputAdornment position="start">$</InputAdornment> },
          }}
        />
        <TextField
          fullWidth
          label="After Discount Price"
          value={typeof afterDiscountPrice === 'number' ? afterDiscountPrice.toFixed(2) : '0.00'}
          type="text"
          InputProps={{
            readOnly: true,
            startAdornment: (
              <InputAdornment position="start" sx={{ mr: 0.75 }}>
                <Box component="span" sx={{ color: 'text.disabled' }}>
                  $
                </Box>
              </InputAdornment>
            ),
          }}
          InputLabelProps={{ shrink: true }}
        />
        <Field.Text
          name="discount"
          label="Discount"
          type="number"
          slotProps={{
            inputLabel: { shrink: true },
            input: {
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            },
          }}
        />
      </Stack>
    </Card>
  );

  const renderActions = () => (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <LoadingButton type="submit" variant="contained" loading={isSubmitting || isLoading}>
        Update Product
      </LoadingButton>
    </Box>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }}>
        {renderDetails()}
        {renderProperties()}
        {renderPricing()}
        {renderActions()}
      </Stack>
    </Form>
  );
}
