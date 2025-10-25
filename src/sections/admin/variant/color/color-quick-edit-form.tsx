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

import { useEffect } from 'react';
import { Field, Form } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { useUpdateOneColorMutation } from 'src/store/admin/variant';
import { ColorDT } from './types/types';

// ----------------------------------------------------------------------

export type ColorQuickEditSchemaType = zod.infer<typeof ColorQuickEditSchema>;

export const ColorQuickEditSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
});

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  currentColor?: ColorDT | null;
};

export function ColorQuickEditForm({ currentColor, open, onClose }: Props) {
  const role = localStorage.getItem('role');
  const router = useRouter();
  const [updateOneColor, { isLoading }] = useUpdateOneColorMutation();

  const defaultValues: ColorQuickEditSchemaType = {
    name: '',
  };

  const methods = useForm<ColorQuickEditSchemaType>({
    mode: 'all',
    resolver: zodResolver(ColorQuickEditSchema),
    defaultValues: currentColor || defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    if (role !== 'ADMIN') return;

    try {
      await updateOneColor({
        colorId: Number(currentColor?.id),
        body: data,
      }).unwrap();
      toast.success('Saved changes');
      reset();
      onClose();
      router.push(paths.dashboard.variant.color);
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
    if (currentColor) {
      const mapped = {
        ...defaultValues,
        ...currentColor,
      };
      reset(mapped);
    }
  }, [currentColor, reset]);

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { maxWidth: 720 } }}
    >
      <DialogTitle>Update color</DialogTitle>

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
