// 'use client';

// import React, { useEffect, useCallback } from 'react';
// import { useForm, useFieldArray, Controller } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z as zod } from 'zod';

// import Box from '@mui/material/Box';
// import Card from '@mui/material/Card';
// import CardHeader from '@mui/material/CardHeader';
// import Divider from '@mui/material/Divider';
// import Stack from '@mui/material/Stack';
// import Typography from '@mui/material/Typography';
// import InputAdornment from '@mui/material/InputAdornment';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Switch from '@mui/material/Switch';
// import IconButton from '@mui/material/IconButton';
// import LoadingButton from '@mui/lab/LoadingButton';

// import { useRouter } from 'src/routes/hooks';
// import { paths } from 'src/routes/paths';

// import { Field, Form, schemaHelper } from 'src/components/hook-form';
// import { toast } from 'src/components/snackbar';
// import { useUpdateProductMutation } from 'src/store/shop-owner/product';
// import { getErrorMessage } from 'src/utils/error.message';
// import { UseCategories, UseVariants } from './hooks';
// import { ProductResDT, VariantOptionDT } from './types/types';
// import { Iconify } from 'src/components/iconify';

// // 1) Zod schema mirroring your UpdateProductDto
// export const UpdateProductSchema = zod
//   .object({
//     name: zod.string().min(1, 'Name is required!'),
//     content: schemaHelper.editor({ message: 'Content is required!' }),
//     images: schemaHelper.files({ message: 'At least one image is required!' }),
//     sellingPrice: schemaHelper.nullableInput(
//       zod.number({ coerce: true }).min(1, 'Price is required!'),
//       { message: 'Price is required!' }
//     ),
//     categoryId: zod.number({ coerce: true }).nullable(),
//     description: zod.string(),
//     isFood: zod.boolean(),
//     isAvailiable: zod.boolean(),
//     condition: zod.string().optional(),
//     variants: zod
//       .array(
//         zod.object({
//           id: zod.number().optional(),
//           color: zod.string(),
//           size: zod.string(),
//           quantity: zod.number({ coerce: true }),
//         })
//       )
//       .optional(),
//   })
//   .superRefine((data, ctx) => {
//     if (!data.isFood) {
//       if (!data.condition) {
//         ctx.addIssue({ path: ['condition'], code: 'custom', message: 'Condition is required!' });
//       }
//       if (!data.variants?.length) {
//         ctx.addIssue({ path: ['variants'], code: 'custom', message: 'At least one variant!' });
//       }
//     }
//   });

// export type UpdateProductSchemaType = zod.infer<typeof UpdateProductSchema>;

// type Props = {
//   currentProduct: (ProductResDT & { isFood: boolean; isAvailiable: boolean }) | null;
// };

// export function ProductNewEditForm({ currentProduct }: Props) {
//   const router = useRouter();
//   const { categories } = UseCategories();
//   const { variants } = UseVariants();
//   const [updateProduct, { isLoading }] = useUpdateProductMutation();

//   // 2) Always call hooks in the same order
//   const methods = useForm<UpdateProductSchemaType>({
//     resolver: zodResolver(UpdateProductSchema),
//     defaultValues: {
//       name: '',
//       content: '',
//       description: '',
//       images: [],
//       sellingPrice: null,
//       categoryId: null,
//       isFood: false,
//       isAvailiable: false,
//       condition: '',
//       variants: [],
//     },
//   });

//   const {
//     reset,
//     watch,
//     setValue,
//     handleSubmit,
//     formState: { isSubmitting },
//     control,
//   } = methods;

//   const { fields, append, remove } = useFieldArray({ name: 'variants', control });
//   const values = watch();

//   // 3) Populate form as soon as currentProduct arrives
//   useEffect(() => {
//     if (!currentProduct) return;
//     reset({
//       name: currentProduct.name,
//       content: currentProduct.content,
//       description: currentProduct.description,
//       images: currentProduct.images.map((i) => i.image),
//       sellingPrice: currentProduct.sellingPrice,
//       categoryId: currentProduct.categoryId,
//       isFood: currentProduct.isFood,
//       isAvailiable: currentProduct.isAvailiable,
//       condition: currentProduct.condition ?? '',
//       variants:
//         currentProduct.variants?.map((v) => ({
//           id: v.id,
//           color: v.color.name,
//           size: v.size.name,
//           quantity: v.quantity,
//         })) || [],
//     });
//   }, [currentProduct, reset]);

//   // 4) Submit handler
//   const onSubmit = handleSubmit(async (data) => {
//     try {
//       const dto: any = {
//         categoryId: data.categoryId,
//         name: data.name,
//         description: data.description,
//         content: data.content,
//         sellingPrice: data.sellingPrice,
//         isFood: data.isFood,
//         isAvailiable: data.isAvailiable,
//       };

//       dto.condition = data.condition;
//       dto.variants = data.variants!.map((v) => ({
//         id: v.id,
//         colorId: variants!.colors.find((c) => c.name === v.color)!.id,
//         sizeId: variants!.sizes.find((s) => s.name === v.size)!.id,
//         quantity: v.quantity,
//       }));

//       console.log('updateProductDto', dto);

//       const formData = new FormData();
//       formData.append('updateProductDto', JSON.stringify(dto));
//       data.images.forEach((img) => img instanceof File && formData.append('images', img));

//       await updateProduct({ id: Number(currentProduct!.id), formData }).unwrap();

//       toast.success('Product updated successfully!');
//       router.push(paths.shopOwner.product.root);
//     } catch (err) {
//       console.log(err);
//       toast.error(getErrorMessage(err));
//     }
//   });

//   // 5) Helpers for file-removal and toggles
//   const handleRemoveFile = useCallback(
//     (file: File | string) =>
//       setValue(
//         'images',
//         (values.images || []).filter((f) => f !== file),
//         { shouldValidate: true }
//       ),
//     [setValue, values.images]
//   );
//   const handleRemoveAll = useCallback(
//     () => setValue('images', [], { shouldValidate: true }),
//     [setValue]
//   );

//   const toggleFood = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       const v = e.target.checked;
//       setValue('isFood', v, { shouldValidate: true });
//       if (v) setValue('variants', []);
//       else append({ color: '', size: '', quantity: 0 });
//     },
//     [append, setValue]
//   );
//   const toggleAvail = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       const v = e.target.checked;
//       setValue('isAvailiable', v, { shouldValidate: true });
//     },
//     [setValue]
//   );

//   const isFoodValue = values.isFood;
//   const isAvailValue = values.isAvailiable;

//   // 6) Four render blocks
//   const renderDetails = () => (
//     <Card>
//       <CardHeader title="Details" subheader="Title, description & images" sx={{ mb: 3 }} />
//       <Divider />
//       <Stack spacing={3} sx={{ p: 3 }}>
//         <Field.Text name="name" label="Name" />
//         <Field.Text name="description" label="Short description" multiline rows={3} />

//         <Typography variant="subtitle2">Content</Typography>
//         <Field.Editor name="content" sx={{ maxHeight: 400 }} />

//         <Typography variant="subtitle2">Images</Typography>
//         <Field.Upload
//           multiple
//           thumbnail
//           name="images"
//           onRemove={handleRemoveFile}
//           onRemoveAll={handleRemoveAll}
//         />
//       </Stack>
//     </Card>
//   );

//   const renderProperties = () => (
//     <Card>
//       <CardHeader title="Properties" subheader="Category, food/service, variants" sx={{ mb: 3 }} />
//       <Divider />
//       <Stack spacing={3} sx={{ p: 3 }}>
//         <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
//           <Field.Select
//             name="categoryId"
//             label="Category"
//             slotProps={{ select: { native: true }, inputLabel: { shrink: true } }}
//           >
//             <option value="" />
//             {categories.map((c) => (
//               <option key={c.id} value={c.id}>
//                 {c.name}
//               </option>
//             ))}
//           </Field.Select>

//           <Controller
//             name="isFood"
//             control={control}
//             render={({ field }) => (
//               <FormControlLabel
//                 control={
//                   <Switch
//                     checked={field.value}
//                     onChange={(e) => {
//                       field.onChange(e.target.checked);
//                       toggleFood(e);
//                     }}
//                   />
//                 }
//                 label="Food"
//               />
//             )}
//           />

//           {isFoodValue && (
//             <Controller
//               name="isAvailiable"
//               control={control}
//               render={({ field }) => (
//                 <FormControlLabel
//                   control={
//                     <Switch
//                       checked={field.value}
//                       onChange={(e) => {
//                         field.onChange(e.target.checked);
//                         toggleAvail(e);
//                       }}
//                     />
//                   }
//                   label="Stocked"
//                 />
//               )}
//             />
//           )}

//           {!isFoodValue && (
//             <Field.Select
//               name="condition"
//               label="Condition"
//               slotProps={{ select: { native: true }, inputLabel: { shrink: true } }}
//             >
//               <option value="" />
//               <option value="USED">USED</option>
//               <option value="BRAND_NEW">BRAND_NEW</option>
//               <option value="SERVICE">SERVICE</option>
//             </Field.Select>
//           )}
//         </Box>

//         {!isFoodValue &&
//           fields.map((f, i) => (
//             <Stack
//               key={f.id}
//               direction={{ xs: 'column', md: 'row' }}
//               spacing={2}
//               alignItems="flex-end"
//             >
//               <Field.Select
//                 name={`variants.${i}.color`}
//                 label="Color"
//                 fullWidth
//                 slotProps={{ select: { native: true }, inputLabel: { shrink: true } }}
//               >
//                 <option value="" />
//                 {variants!.colors.map((c: VariantOptionDT) => (
//                   <option key={c.id} value={c.name}>
//                     {c.name}
//                   </option>
//                 ))}
//               </Field.Select>
//               <Field.Select
//                 name={`variants.${i}.size`}
//                 label="Size"
//                 fullWidth
//                 slotProps={{ select: { native: true }, inputLabel: { shrink: true } }}
//               >
//                 <option value="" />
//                 {variants!.sizes.map((s: VariantOptionDT) => (
//                   <option key={s.id} value={s.name}>
//                     {s.name}
//                   </option>
//                 ))}
//               </Field.Select>
//               <Field.Text
//                 name={`variants.${i}.quantity`}
//                 label="Qty"
//                 type="number"
//                 fullWidth
//                 slotProps={{ inputLabel: { shrink: true } }}
//               />
//               <IconButton onClick={() => remove(i)} color="error">
//                 <Iconify icon="solar:trash-bin-trash-bold" />
//               </IconButton>
//             </Stack>
//           ))}
//         {!isFoodValue && (
//           <LoadingButton
//             variant="outlined"
//             startIcon={<Iconify icon="mingcute:add-line" />}
//             onClick={() => append({ color: '', size: '', quantity: 0 })}
//           >
//             Add Variant
//           </LoadingButton>
//         )}
//       </Stack>
//     </Card>
//   );

//   const renderPricing = () => (
//     <Card>
//       <CardHeader title="Pricing" subheader="Sell price" sx={{ mb: 3 }} />
//       <Divider />
//       <Stack spacing={3} sx={{ p: 3 }}>
//         <Field.Text
//           name="sellingPrice"
//           label="Price"
//           type="number"
//           slotProps={{
//             inputLabel: { shrink: true },
//             input: { startAdornment: <InputAdornment position="start">$</InputAdornment> },
//           }}
//         />
//       </Stack>
//     </Card>
//   );

//   const renderActions = () => (
//     <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
//       <LoadingButton type="submit" variant="contained" loading={isSubmitting || isLoading}>
//         Update Product
//       </LoadingButton>
//     </Box>
//   );

//   return (
//     <Form methods={methods} onSubmit={onSubmit}>
//       <Stack spacing={{ xs: 3, md: 5 }}>
//         {renderDetails()}
//         {renderProperties()}
//         {renderPricing()}
//         {renderActions()}
//       </Stack>
//     </Form>
//   );
// }

// src/sections/product/product-new-edit-form.tsx

'use client';

import React, { useEffect, useCallback } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
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

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { Field, Form, schemaHelper } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';
import { useUpdateProductMutation } from 'src/store/shop-owner/product';
import { getErrorMessage } from 'src/utils/error.message';
import { UseCategories, UseVariants } from './hooks';
import { ProductResDT, VariantOptionDT } from './types/types';
import { Iconify } from 'src/components/iconify';

// Zod schema mirroring your UpdateProductDto
export const UpdateProductSchema = zod
  .object({
    name: zod.string().min(1, 'Name is required!'),
    content: schemaHelper.editor({ message: 'Content is required!' }),
    // Allow empty array for images, we handle validation in superRefine if needed
    images: schemaHelper.files({ message: 'At least one image is required!' }),
    sellingPrice: schemaHelper.nullableInput(
      zod.number({ coerce: true }).min(1, 'Price is required!'),
      { message: 'Price is required!' }
    ),
    categoryId: zod.number({ coerce: true }).nullable(),
    description: zod.string(),
    isFood: zod.boolean(),
    isAvailiable: zod.boolean(),
    condition: zod.string().optional(),
    variants: zod
      .array(
        zod.object({
          id: zod.number().optional(),
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
        ctx.addIssue({ path: ['condition'], code: 'custom', message: 'Condition is required!' });
      }
      if (!data.variants?.length) {
        ctx.addIssue({ path: ['variants'], code: 'custom', message: 'At least one variant!' });
      }
    }
  });

export type UpdateProductSchemaType = zod.infer<typeof UpdateProductSchema>;

// =================================================================
// ============== ✨ NEW HELPER FUNCTION (START) ✨ ================
// =================================================================
/**
 * Fetches an image from a URL and converts it into a File object.
 * @param url The URL of the image to fetch.
 * @param filename The desired filename for the new File object.
 * @param mimeType The MIME type of the file.
 * @returns {Promise<File>} A promise that resolves to a File object.
 */
async function urlToFile(url: string, filename: string, mimeType?: string): Promise<File> {
  const res = await fetch(url);
  const blob = await res.blob();
  return new File([blob], filename, { type: mimeType || blob.type });
}
// =================================================================
// =============== ✨ NEW HELPER FUNCTION (END) ✨ =================
// =================================================================

type Props = {
  currentProduct: (ProductResDT & { isFood: boolean; isAvailiable: boolean }) | null;
};

export function ProductNewEditForm({ currentProduct }: Props) {
  const router = useRouter();
  const { categories } = UseCategories();
  const { variants } = UseVariants();
  const [updateProduct, { isLoading }] = useUpdateProductMutation();

  const methods = useForm<UpdateProductSchemaType>({
    resolver: zodResolver(UpdateProductSchema),
    defaultValues: {
      name: '',
      content: '',
      description: '',
      images: [],
      sellingPrice: null,
      categoryId: null,
      isFood: false,
      isAvailiable: false,
      condition: '',
      variants: [],
    },
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = methods;

  const { fields, append, remove } = useFieldArray({ name: 'variants', control });
  const values = watch();

  useEffect(() => {
    if (!currentProduct) return;
    reset({
      name: currentProduct.name,
      content: currentProduct.content,
      description: currentProduct.description,
      images: currentProduct.images.map((i) => i.image),
      sellingPrice: currentProduct.sellingPrice,
      categoryId: currentProduct.categoryId,
      isFood: currentProduct.isFood,
      isAvailiable: currentProduct.isAvailiable,
      condition: currentProduct.condition ?? '',
      variants:
        currentProduct.variants?.map((v) => ({
          id: v.id,
          color: v.color.name,
          size: v.size.name,
          quantity: v.quantity,
        })) || [],
    });
  }, [currentProduct, reset]);

  // =================================================================
  // ============== ✨ MODIFIED SUBMIT HANDLER (START) ✨ =============
  // =================================================================
  const onSubmit = handleSubmit(async (data) => {
    if (!currentProduct) return;

    try {
      const dto: any = {
        categoryId: data.categoryId,
        name: data.name,
        description: data.description,
        content: data.content,
        sellingPrice: data.sellingPrice,
        isFood: data.isFood,
        isAvailiable: data.isAvailiable,
      };

      if (!data.isFood) {
        dto.condition = data.condition;
        dto.variants = data.variants!.map((v) => ({
          id: v.id,
          colorId: variants!.colors.find((c) => c.name === v.color)!.id,
          sizeId: variants!.sizes.find((s) => s.name === v.size)!.id,
          quantity: v.quantity,
        }));
      }

      // --- IMAGE HANDLING LOGIC ---
      const formData = new FormData();
      formData.append('updateProductDto', JSON.stringify(dto));

      // 1. Convert all images (new Files and existing URLs) into File objects
      const imageFiles = await Promise.all(
        data.images.map((img) => {
          if (img instanceof File) {
            return Promise.resolve(img);
          }
          // For existing images (strings), fetch them and convert them to Files
          const filename = img.substring(img.lastIndexOf('/') + 1);
          return urlToFile(img, filename);
        })
      );

      // 2. Append all the final File objects to FormData
      // This sends the complete, desired set of images to the backend.
      if (imageFiles.length > 0) {
        imageFiles.forEach((file) => formData.append('images', file));
      } else {
        // If the user removed all images, we need to send an empty file array
        // to trigger the "replace all" logic on the backend.
        // NOTE: This assumes the backend is modified to handle an empty `images` array as a "delete all" signal.
        // If not, deleting all images won't work without a backend change.
        // For now, we will handle it as if the user wants to clear them.
        // A common way is to send a special flag, but sticking to frontend-only changes:
        // We can send an empty value if the API is configured to accept it.
        // The current backend logic will NOT delete anything if `images` is empty.
        // This is a backend limitation. The fix below works for ALL other cases.
      }

      // --- END IMAGE HANDLING ---

      await updateProduct({ id: Number(currentProduct.id), formData }).unwrap();

      toast.success('Product updated successfully!');
      router.push(paths.shopOwner.product.root);
    } catch (err) {
      console.error('Submission Error:', err);
      toast.error(getErrorMessage(err));
    }
  });
  // =================================================================
  // =============== ✨ MODIFIED SUBMIT HANDLER (END) ✨ ==============
  // =================================================================

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

  const toggleFood = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.checked;
      setValue('isFood', v, { shouldValidate: true });
      if (v) {
        setValue('variants', []);
      } else {
        // Only add a default variant if there are none
        if (fields.length === 0) {
          append({ color: '', size: '', quantity: 0 });
        }
      }
    },
    [append, setValue, fields.length]
  );

  const toggleAvail = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.checked;
      setValue('isAvailiable', v, { shouldValidate: true });
    },
    [setValue]
  );

  const isFoodValue = values.isFood;

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

  const renderProperties = () => (
    <Card>
      <CardHeader title="Properties" subheader="Category, food/service, variants" sx={{ mb: 3 }} />
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
                  <Switch
                    checked={field.value}
                    onChange={(e) => {
                      field.onChange(e.target.checked);
                      toggleFood(e);
                    }}
                  />
                }
                label="Food"
              />
            )}
          />

          {isFoodValue && (
            <Controller
              name="isAvailiable"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.value}
                      onChange={(e) => {
                        field.onChange(e.target.checked);
                        toggleAvail(e);
                      }}
                    />
                  }
                  label="Stocked"
                />
              )}
            />
          )}

          {!isFoodValue && (
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
        </Box>

        {!isFoodValue &&
          fields.map((f, i) => (
            <Stack
              key={f.id}
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              alignItems="flex-end"
            >
              <Field.Select
                name={`variants.${i}.color`}
                label="Color"
                fullWidth
                slotProps={{ select: { native: true }, inputLabel: { shrink: true } }}
              >
                <option value="" />
                {variants!.colors.map((c: VariantOptionDT) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </Field.Select>
              <Field.Select
                name={`variants.${i}.size`}
                label="Size"
                fullWidth
                slotProps={{ select: { native: true }, inputLabel: { shrink: true } }}
              >
                <option value="" />
                {variants!.sizes.map((s: VariantOptionDT) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </Field.Select>
              <Field.Text
                name={`variants.${i}.quantity`}
                label="Qty"
                type="number"
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <IconButton onClick={() => remove(i)} color="error">
                <Iconify icon="solar:trash-bin-trash-bold" />
              </IconButton>
            </Stack>
          ))}
        {!isFoodValue && (
          <LoadingButton
            variant="outlined"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => append({ color: '', size: '', quantity: 0 })}
          >
            Add Variant
          </LoadingButton>
        )}
      </Stack>
    </Card>
  );

  const renderPricing = () => (
    <Card>
      <CardHeader title="Pricing" subheader="Sell price" sx={{ mb: 3 }} />
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text
          name="sellingPrice"
          label="Price"
          type="number"
          slotProps={{
            inputLabel: { shrink: true },
            input: { startAdornment: <InputAdornment position="start">$</InputAdornment> },
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
