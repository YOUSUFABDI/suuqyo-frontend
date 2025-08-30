import type { BoxProps } from '@mui/material/Box';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useContactUsMutation } from 'src/store/public/public';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { toast } from 'src/components/snackbar';
import { getErrorMessage } from 'src/utils/error.message';
import { Field, Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

export type ContactUsSchemaType = zod.infer<typeof ContactUsSchema>;

export const ContactUsSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  email: zod.string().email('Invalid email format').min(1, { message: 'Email is required!' }),
  subject: zod.string().min(1, { message: 'Subject is required!' }),
  message: zod.string().min(1, { message: 'Message is required!' }),
});

export function ContactForm({ sx, ...other }: BoxProps) {
  const [contactUs, { isLoading }] = useContactUsMutation();
  const { t } = useTranslate();

  const defaultValues: ContactUsSchemaType = {
    name: '',
    email: '',
    subject: '',
    message: '',
  };

  const methods = useForm<ContactUsSchemaType>({
    resolver: zodResolver(ContactUsSchema),
    defaultValues,
  });

  const { handleSubmit, reset } = methods;

  const onSubmit = async (data: ContactUsSchemaType) => {
    try {
      await contactUs(data).unwrap();
      toast.success('Your message has been sent successfully!');
      reset();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(
        errorMessage || 'There was an error while submitting your form. Please try again.'
      );
    }
  };

  return (
    <Box sx={sx} {...other}>
      <Stack spacing={3}>
        <Typography variant="h3">
          {t('contact.desc1')}
          <br />
          {t('contact.desc2')}
        </Typography>

        <Box
          sx={{
            p: 3,
            borderRadius: 1,
            bgcolor: 'background.neutral',
            border: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Stack spacing={1.5} direction="row" alignItems="center">
            <Box
              sx={{
                width: 40,
                height: 40,
                flexShrink: 0,
                display: 'flex',
                borderRadius: '50%',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
              }}
            >
              <Iconify icon="eva:phone-call-fill" width={20} />
            </Box>
            <Stack>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Phone/WhatsApp
              </Typography>
              <Typography variant="subtitle2">+252613768128</Typography>
            </Stack>
          </Stack>

          <Stack spacing={1.5} direction="row" alignItems="center" sx={{ mt: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                flexShrink: 0,
                display: 'flex',
                borderRadius: '50%',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
              }}
            >
              <Iconify icon="eva:pin-fill" width={20} />
            </Box>
            <Stack>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Address
              </Typography>
              <Typography variant="subtitle2">Mogadishu, Somalia, Taleex</Typography>
            </Stack>
          </Stack>
        </Box>
      </Stack>

      <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            my: 5,
            gap: 3,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Field.Text name="name" label="Name" />
          <Field.Text name="email" label="Email" type="email" />
          <Field.Text name="subject" label="Subject" />
          <Field.Text name="message" label="Enter your message here." multiline rows={4} />
        </Box>

        <Button type="submit" size="large" variant="contained" disabled={isLoading} fullWidth>
          {isLoading ? t('contact.submiting') : t('contact.submit')}
        </Button>
      </Form>
    </Box>
  );
}
