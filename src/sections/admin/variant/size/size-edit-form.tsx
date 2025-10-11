import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { Field, Form } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';

import { useBoolean } from 'minimal-shared/hooks';

import { CardHeader, Divider } from '@mui/material';
import { useEffect } from 'react';
import { useUpdateOneSizeMutation } from 'src/store/admin/variant';
import { SizeDT } from './types/types';

// ----------------------------------------------------------------------

export type NewSizeSchemaType = zod.infer<typeof NewSizeSchema>;

export const NewSizeSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
});

// ----------------------------------------------------------------------

type Props = {
  currentSize?: SizeDT | null;
};

export function SizeEditForm({ currentSize }: Props) {
  const role = localStorage.getItem('role');
  const router = useRouter();
  const confirmDialog = useBoolean();

  // Hook for RTK Query mutation
  const [updateOneSize, { isLoading }] = useUpdateOneSizeMutation();

  const defaultValues: NewSizeSchemaType = {
    name: '',
  };

  const methods = useForm<NewSizeSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewSizeSchema),
    defaultValues: currentSize || defaultValues,
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
    if (role !== 'ADMIN') return;

    try {
      console.log('currentSize?.id', currentSize?.id);
      await updateOneSize({
        sizeId: Number(currentSize?.id),
        body: data,
      }).unwrap();
      toast.success('Saved changes');
      reset();
      router.push(paths.dashboard.variant.root);
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

  useEffect(() => {
    if (currentSize) {
      const mapped = {
        ...defaultValues,
        ...currentSize,
      };
      reset(mapped);
    }
  }, [currentSize, reset]);

  return (
    <>
      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={{ xs: 3, md: 5 }}>
          <Card sx={{ width: '100%' }}>
            <CardHeader title="Category detail" subheader="Name" sx={{ mb: 3 }} />
            <Divider />

            <Grid container spacing={3} sx={{ p: 3 }}>
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
                    <Field.Text name="name" label="Name" />
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Card>

          <Divider />

          {role === 'ADMIN' && (
            <Stack sx={{ mt: 3, alignItems: 'flex-end' }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save changes
              </LoadingButton>
            </Stack>
          )}
        </Stack>
      </Form>
    </>
  );
}
