import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { Field, Form } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { useCreateOneShopCategoryMutation } from 'src/store/admin/category';
import { getErrorMessage } from 'src/utils/error.message';

// ----------------------------------------------------------------------

export type ShopCategoryQuickCreateSchemaType = zod.infer<typeof ShopCategoryQuickCreateSchema>;

export const ShopCategoryQuickCreateSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
});

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
};

export function ShopCategoryQuickCreateForm({ open, onClose }: Props) {
  const role = localStorage.getItem('role');
  const router = useRouter();
  const [createOneShopCategory, { isLoading, error }] = useCreateOneShopCategoryMutation();

  const defaultValues: ShopCategoryQuickCreateSchemaType = {
    name: '',
  };

  const methods = useForm<ShopCategoryQuickCreateSchemaType>({
    mode: 'all',
    resolver: zodResolver(ShopCategoryQuickCreateSchema),
    defaultValues: defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await createOneShopCategory(data).unwrap();
      toast.success('Shop category created successfully!');
      reset();
      onClose();

      router.push(paths.dashboard.category.shopCategory);
    } catch (error: any) {
      // console.error('Category creation error:', error);

      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { maxWidth: 720 } }}
    >
      <DialogTitle>Create new Shop category</DialogTitle>

      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Box
            sx={{
              py: 1,
              rowGap: 3,
              columnGap: 2,
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
            }}
          >
            <Field.Text name="name" label="Name" />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting || isLoading}>
            Create
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
