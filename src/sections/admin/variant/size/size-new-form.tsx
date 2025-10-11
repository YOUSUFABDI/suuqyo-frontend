import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { useBoolean } from 'minimal-shared/hooks';

import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';

import { useRouter } from 'src/routes/hooks';

import { Field, Form } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';
import { paths } from 'src/routes/paths';

import { CardHeader, Divider } from '@mui/material';
import { useCreateOneSizeMutation } from 'src/store/admin/variant';
import { getErrorMessage } from 'src/utils/error.message';

// ----------------------------------------------------------------------

export type NewUserSchemaType = zod.infer<typeof NewUserSchema>;

export const NewUserSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
});

// ----------------------------------------------------------------------

export function SizeNewForm() {
  const role = localStorage.getItem('role');
  const router = useRouter();

  const [createOneSize, { isLoading, error }] = useCreateOneSizeMutation();

  const showPassword = useBoolean();

  const defaultValues: NewUserSchemaType = {
    name: '',
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

  const onSubmit = handleSubmit(async (data) => {
    try {
      await createOneSize(data).unwrap();
      toast.success('Category created successfully!');
      reset();
      router.push(paths.dashboard.variant.root);
    } catch (error: any) {
      // console.error('Category creation error:', error);

      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }}>
        <Card sx={{ width: '100%' }}>
          <CardHeader title="Category detail" subheader="Name..." sx={{ mb: 3 }} />
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

        <Stack sx={{ mt: 3, alignItems: 'flex-end' }}>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Create Category
          </LoadingButton>
        </Stack>
      </Stack>
    </Form>
  );
}
