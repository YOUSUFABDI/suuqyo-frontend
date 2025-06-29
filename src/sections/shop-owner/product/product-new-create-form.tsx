import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
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

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { toast } from 'src/components/snackbar';
import { Field, Form, schemaHelper } from 'src/components/hook-form';
import { UseCategories, UseVariants } from './hooks';
import { useCreateProductMutation } from 'src/store/shop-owner/product';
import { getErrorMessage } from 'src/utils/error.message';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type NewProductSchemaType = zod.infer<typeof NewProductSchema>;

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
    categoryId: zod.number({ coerce: true }).nullable(),
    description: zod.string(),
    isFood: zod.boolean(),
    isAvailiable: zod.boolean().optional(),
    condition: zod.string().optional(),
    variants: zod
      .array(
        zod.object({
          color: zod.string(),
          size: zod.string(),
          quantity: zod.number({ coerce: true }),
        })
      )
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.isFood) {
      if (!data.condition) {
        ctx.addIssue({
          path: ['condition'],
          code: zod.ZodIssueCode.custom,
          message: 'Condition is required for non-food products',
        });
      }
      if (!data.variants || data.variants.length === 0) {
        ctx.addIssue({
          path: ['variants'],
          code: zod.ZodIssueCode.custom,
          message: 'At least one variant is required for non-food products',
        });
      }
    }
  });

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
    categoryId: null,
    isFood: false,
    isAvailiable: false,
    condition: '',
    variants: [{ color: '', size: '', quantity: 0 }],
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
    formState: { isSubmitting },
    control,
  } = methods;

  const values = watch();
  const isFood = values.isFood;
  const isAvailiable = values.isAvailiable;

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

      if (!data.isFood) {
        dto.condition = data.condition;
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
      } else {
        setValue('variants', [{ color: '', size: '', quantity: 0 }]);
      }
    },
    [setValue]
  );

  const handleChangeIsAvailiable = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue('isAvailiable', event.target.checked, { shouldValidate: true });
    },
    [setValue]
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

  const renderProperties = () => (
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
            <option value=""></option>
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
                control={<Switch {...field} checked={field.value} onChange={handleChangeIsFood} />}
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
                    <Switch {...field} checked={field.value} onChange={handleChangeIsAvailiable} />
                  }
                  label="Available for service"
                />
              )}
            />
          )}

          {!isFood && (
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
        </Box>

        {!isFood && (
          <Box>
            <Stack spacing={3}>
              {fields.map((field, idx) => (
                <Stack
                  key={field.id}
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={2}
                  alignItems="flex-end"
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
                  onClick={() => append({ color: '', size: '', quantity: 0 })}
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
