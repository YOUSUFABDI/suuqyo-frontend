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
import {
  useSendNotificationToCustomerMutation,
  useSendNotificationToShopOwnerMutation,
  useSendSmsToCustomersMutation,
  useSendSmsToShopOwnersMutation,
} from 'src/store/public/notification';
import { getErrorMessage } from 'src/utils/error.message';

// ----------------------------------------------------------------------

export type NotificationQuickCreateSchemaType = zod.infer<typeof NotificationQuickCreateSchema>;

export const NotificationQuickCreateSchema = zod
  .object({
    title: zod.string().min(1, { message: 'Title is required!' }),

    message: zod.string().optional(), // EMAIL
    smsMessage: zod.string().optional(), // SMS

    recipientType: zod.enum(['SHOP_OWNER', 'CUSTOMER']),
    provider: zod.enum(['EMAIL', 'SMS']),
  })
  .refine(
    (data) => (data.provider === 'SMS' ? !!data.smsMessage?.trim() : !!data.message?.trim()),
    {
      message: 'Message content is required',
      path: ['message'],
    }
  );

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

  const [sendSmsShopOwner] = useSendSmsToShopOwnersMutation();
  const [sendSmsCustomer] = useSendSmsToCustomersMutation();

  const defaultValues: NotificationQuickCreateSchemaType = {
    title: '',
    message: '',
    smsMessage: '',
    recipientType: 'SHOP_OWNER',
    provider: 'EMAIL',
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
      if (data.provider === 'SMS') {
        if (data.recipientType === 'SHOP_OWNER') {
          await sendSmsShopOwner(data).unwrap();
        } else {
          await sendSmsCustomer(data).unwrap();
        }
      } else {
        if (data.recipientType === 'SHOP_OWNER') {
          await sendNotificationToShopOwner(data).unwrap();
        } else {
          await sendNotificationToCustomer(data).unwrap();
        }
      }

      toast.success('Sent successfully!');
      reset();
      onClose();
      router.push(paths.dashboard.notification.root);
    } catch (error) {
      toast.error(getErrorMessage(error));
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
              name="provider"
              label="Channel"
              slotProps={{
                select: { native: true },
                inputLabel: { shrink: true },
              }}
            >
              <option value="EMAIL">Email</option>
              <option value="SMS">SMS</option>
            </Field.Select>

            <Field.Select
              name="recipientType"
              label="Recipient type"
              slotProps={{
                select: { native: true },
                inputLabel: { shrink: true },
              }}
            >
              <option value="SHOP_OWNER">Shop owner</option>
              <option value="CUSTOMER">Customer</option>
            </Field.Select>
          </Box>
          <Box
            sx={{
              py: 1,
            }}
          >
            {values.provider === 'SMS' ? (
              <Field.Text name="smsMessage" label="SMS Message" placeholder="Enter SMS content" />
            ) : (
              <Field.Editor name="message" />
            )}
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
