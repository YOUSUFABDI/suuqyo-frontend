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
import { useCreateOneColorMutation } from 'src/store/admin/variant';
import { getErrorMessage } from 'src/utils/error.message';
import {
  useSendNotificationToCustomerMutation,
  useSendNotificationToShopOwnerMutation,
} from 'src/store/public/notification';

// ----------------------------------------------------------------------

export type NotificationQuickCreateSchemaType = zod.infer<typeof NotificationQuickCreateSchema>;

export const NotificationQuickCreateSchema = zod.object({
  title: zod.string().min(1, { message: 'Title is required!' }),
  message: zod.string().min(1, { message: 'Message is required!' }),
  recipientType: zod.string().min(1, { message: 'Recipient type is required!' }),
});

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
};

export function NotificationQuickCreateForm({ open, onClose }: Props) {
  const role = localStorage.getItem('role');
  const router = useRouter();
  const [sendNotificationToShopOwner] = useSendNotificationToShopOwnerMutation();
  const [sendNotificationToCustomer] = useSendNotificationToCustomerMutation();

  const defaultValues: NotificationQuickCreateSchemaType = {
    title: '',
    message: '',
    recipientType: '',
  };

  const methods = useForm<NotificationQuickCreateSchemaType>({
    mode: 'all',
    resolver: zodResolver(NotificationQuickCreateSchema),
    defaultValues: defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (data.recipientType === 'SHOP_OWNER') {
        await sendNotificationToShopOwner(data).unwrap();
        toast.success('Sent successfully!');
        reset();
        onClose();

        router.push(paths.dashboard.notification.root);
      } else {
        await sendNotificationToCustomer(data).unwrap();
        toast.success('Sent successfully!');
        reset();
        onClose();

        router.push(paths.dashboard.notification.root);
      }
    } catch (error: any) {
      console.log('error', error);
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
      <DialogTitle>Send new notification</DialogTitle>

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
            <Field.Text name="title" label="Title" />
            <Field.Select
              name="recipientType"
              label="Recipient type"
              value={values.recipientType} // This binds the role value from the form state
              slotProps={{
                select: { native: true },
                inputLabel: { shrink: true },
              }}
            >
              {/* Select the role if it's available from the currentUser */}
              <option value="" disabled>
                Select Role
              </option>
              <option value="SHOP_OWNER" selected={values.recipientType === 'SHOP_OWNER'}>
                Shop owner
              </option>
              <option value="CUSTOMER" selected={values.recipientType === 'CUSTOMER'}>
                Customer
              </option>{' '}
            </Field.Select>
          </Box>
          <Box
            sx={{
              py: 1,
            }}
          >
            <Field.Editor name="message" />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Send
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
