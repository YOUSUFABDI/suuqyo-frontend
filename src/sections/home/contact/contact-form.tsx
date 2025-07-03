import type { BoxProps } from '@mui/material/Box';

import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useContactUsMutation } from 'src/store/public/public';

import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { toast } from 'src/components/snackbar';
import { getErrorMessage } from 'src/utils/error.message';

import { Field, Form } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type ContactUsSchemaType = zod.infer<typeof ContactUsSchema>;

export const ContactUsSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  email: zod.string().min(1, { message: 'Email is required!' }),
  subject: zod.string().min(1, { message: 'Subject is required!' }),
  message: zod.string().min(1, { message: 'Message is required!' }),
});

export function ContactForm({ sx, ...other }: BoxProps) {
  const [contactUs, { isLoading, isSuccess, isError, error }] = useContactUsMutation();

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

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  const onSubmit = async (data: ContactUsSchemaType) => {
    try {
      // console.log('Submitting contact form:', data);
      await contactUs(data).unwrap();
      toast.success('Your message has been sent successfully!');
      reset(); // Clear form inputs after successful submission
    } catch (error) {
      console.log('Error submitting contact form:', error);
      const errorMessage = getErrorMessage(error);
      toast.error(
        errorMessage || 'There was an error while submitting your form. Please try again.'
      );
    }
  };

  return (
    <Box sx={sx} {...other}>
      <Typography variant="h3">
        Feel free to contact us. <br />
        We&apos;ll be glad to hear from you!
      </Typography>

      <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            my: 5,
            gap: 3,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Use Field.Text to register the inputs */}
          <Field.Text name="name" label="Name" />
          <Field.Text name="email" label="Email" />
          <Field.Text name="subject" label="Subject" />
          <Field.Text name="message" label="Enter your message here." multiline rows={4} />
        </Box>

        <Button type="submit" size="large" variant="contained" disabled={isSubmitting || isLoading}>
          {isSubmitting || isLoading ? 'Submitting...' : 'Submit'}
        </Button>

        {/* Display error or success messages based on the mutation state */}
        {isError && (
          <Typography color="error" sx={{ mt: 2 }}>
            Error: {getErrorMessage(error)}
          </Typography>
        )}
        {isSuccess && (
          <Typography color="success" sx={{ mt: 2 }}>
            Message sent successfully!
          </Typography>
        )}
      </Form>
    </Box>
  );
}
