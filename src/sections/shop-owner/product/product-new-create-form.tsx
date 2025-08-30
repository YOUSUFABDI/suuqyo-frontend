import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useMemo } from 'react';
import { useForm, useFieldArray, Controller, useWatch } from 'react-hook-form';
import { z as zod } from 'zod';

import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { toast } from 'src/components/snackbar';
import { Field, Form, schemaHelper } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';

import { getErrorMessage } from 'src/utils/error.message';
import { useCreateProductMutation } from 'src/store/shop-owner/product';
import { UseCategories, UseVariants } from './hooks';

// ----------------------------------------------------------------------

export type NewProductSchemaType = zod.infer<typeof NewProductSchema>;

// [!code ++]
// THIS IS THE CORRECTED SCHEMA
export const NewProductSchema = zod
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
    // discount: schemaHelper
    //   .nullableInput(
    //     zod
    //       .number({ coerce: true })
    //       .min(0, { message: 'Discount cannot be negative.' })
    //       .max(100, { message: 'Discount cannot exceed 100.' })
    //   )
    //   .optional(),
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
    // Base schema for quantity is now very permissive
    quantity: zod.any().optional(),
    variants: zod
      .array(
        zod.object({
          color: zod.string().min(1, { message: 'Color is required.' }),
          size: zod.string().min(1, { message: 'Size is required.' }),
          quantity: zod
            .number({ coerce: true })
            .min(1, { message: 'Quantity must be at least 1.' }),
        })
      )
      .optional(),
  })
  // We use a single, powerful refine method to handle all conditional logic
  .refine(
    (data) => {
      // Logic for non-food items
      if (!data.isFood) {
        if (!data.condition) return false; // Condition is required
        if (data.hasVariants) {
          return data.variants && data.variants.length > 0; // Must have at least one variant
        }
        // If no variants, quantity is required
        const qty = Number(data.quantity);
        return !(data.quantity === null || data.quantity === '' || isNaN(qty) || qty < 0);
      }
      return true; // Pass validation if it's a food item (specifics handled next)
    },
    {
      // This message is a fallback; specific messages are added below
      message: 'Invalid non-food product properties.',
      // Check multiple paths to guide the user
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
      return true; // Pass validation for service food and non-food items
    },
    {
      message: 'Quantity is required for stocked food items.',
      path: ['quantity'],
    }
  );
// [!code ++]

export function ProductNewCreateForm() {
  const router = useRouter();

  const { categories } = UseCategories();
  const { variants } = UseVariants();

  const [createProduct, { isLoading }] = useCreateProductMutation();

  const defaultValues: NewProductSchemaType = {
    name: '',
    content: '',
    description: '',
    images: [],
    sellingPrice: null,
    purchasePrice: null,
    discount: 0,
    categoryId: null,
    isFood: false,
    isAvailiable: false,
    condition: 'BRAND_NEW',
    hasVariants: false,
    quantity: 0,
    variants: [],
  };

  const methods = useForm<NewProductSchemaType>({
    resolver: zodResolver(NewProductSchema),
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

  const values = watch();

  const sellingPrice = useWatch({ control, name: 'sellingPrice' });
  const discount = useWatch({ control, name: 'discount' });

  const afterDiscountPrice = useMemo(() => {
    const price = sellingPrice ?? 0;
    const disc = discount ?? 0;
    if (disc <= 0) return price;
    return price - price * (disc / 100);
  }, [sellingPrice, discount]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  });

  const onSubmit = handleSubmit(async (data) => {
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
          // It's a stocked food item, send the quantity
          dto.quantity = data.quantity;
        }
        // For service food, we intentionally DO NOT send a quantity
      } else {
        // It's a non-food item
        dto.condition = data.condition;
        if (data.hasVariants) {
          if (data.variants && data.variants.length > 0) {
            dto.variants = data.variants!.map((v) => {
              const colorObj = variants!.colors.find((c) => c.name === v.color)!;
              const sizeObj = variants!.sizes.find((s) => s.name === v.size)!;
              return {
                colorId: colorObj.id,
                sizeId: sizeObj.id,
                quantity: v.quantity,
              };
            });
          }
        } else {
          dto.quantity = data.quantity;
        }
      }

      const formData = new FormData();
      formData.append('createProductDto', JSON.stringify(dto));
      data.images.forEach((file) => formData.append('images', file));

      await createProduct(formData).unwrap();
      toast.success('Product created!');
      reset();
      router.push(paths.shopOwner.product.root);
    } catch (err: any) {
      toast.error(getErrorMessage(err));
    }
  });

  const handleRemoveFile = useCallback(
    (inputFile: File | string) => {
      const filtered = values.images?.filter((file) => file !== inputFile) || [];
      setValue('images', filtered);
    },
    [setValue, values.images]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('images', [], { shouldValidate: true });
  }, [setValue]);

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
        setValue('variants', [{ color: '', size: '', quantity: 1 }]);
      } else {
        setValue('variants', []);
        setValue('quantity', 0);
      }
    },
    [setValue]
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

  const renderProperties = () => {
    const showQuantityField =
      // (!values.isFood && !values.hasVariants) || (values.isFood && !values.isAvailiable);
      !values.isFood && !values.hasVariants;

    return (
      <Card>
        <CardHeader title="Properties" subheader="Additional attributes" sx={{ mb: 3 }} />
        <Divider />
        <Stack spacing={3} sx={{ p: 3 }}>
          <Box
            sx={{
              rowGap: 3,
              columnGap: 2,
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            }}
          >
            <Field.Select
              name="categoryId"
              label="Category"
              slotProps={{ select: { native: true }, inputLabel: { shrink: true } }}
            >
              <option value="" />
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
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
                {['', 'USED', 'BRAND_NEW', 'SERVICE'].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Field.Select>
            )}

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
        <Field.Text
          name="sellingPrice"
          label="Price"
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
          placeholder="0"
          type="number"
          slotProps={{
            inputLabel: { shrink: true },
            input: {
              endAdornment: (
                <InputAdornment position="end" sx={{ mr: 0.75 }}>
                  <Box component="span" sx={{ color: 'text.disabled' }}>
                    %
                  </Box>
                </InputAdornment>
              ),
            },
          }}
        />
      </Stack>
    </Card>
  );

  const renderActions = () => (
    <Box sx={{ gap: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
      <LoadingButton
        type="submit"
        variant="contained"
        size="large"
        loading={isSubmitting || isLoading}
      >
        Create product
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
