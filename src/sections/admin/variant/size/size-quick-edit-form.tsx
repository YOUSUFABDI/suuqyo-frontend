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
import { SizeDT } from './types/types';
import { useUpdateOneSizeMutation } from 'src/store/admin/variant';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { useEffect } from 'react';

// ----------------------------------------------------------------------

export type SizeQuickEditSchemaType = zod.infer<typeof SizeQuickEditSchema>;

export const SizeQuickEditSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
});

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  currentSize?: SizeDT | null;
};

export function SizeQuickEditForm({ currentSize, open, onClose }: Props) {
  const role = localStorage.getItem('role');
  const router = useRouter();
  const [updateOneSize, { isLoading }] = useUpdateOneSizeMutation();

  const defaultValues: SizeQuickEditSchemaType = {
    name: '',
  };

  const methods = useForm<SizeQuickEditSchemaType>({
    mode: 'all',
    resolver: zodResolver(SizeQuickEditSchema),
    defaultValues: currentSize || defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    if (role !== 'ADMIN') return;

    try {
      await updateOneSize({
        sizeId: Number(currentSize?.id),
        body: data,
      }).unwrap();
      toast.success('Saved changes');
      reset();
      onClose();
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
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { maxWidth: 720 } }}
    >
      <DialogTitle>Update size</DialogTitle>

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
            Update
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
