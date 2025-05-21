'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useBoolean } from 'minimal-shared/hooks';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { toast } from 'src/components/snackbar';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';

import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';

import { AnimateLogoRotate } from 'src/components/animate';
import { Field, Form, schemaHelper } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';

import { FormHead } from '../../components/form-head';
import { useSignupMutation } from 'src/store/auth/auth';
import { getErrorMessage } from 'src/utils/error.message';
import { useRouter } from 'next/navigation';

// ----------------------------------------------------------------------

export type SignUpSchemaType = zod.infer<typeof SignUpSchema>;

export const SignUpSchema = zod.object({
  fullName: zod.string().min(1, { message: 'Full name is required!' }),
  username: zod.string().min(1, { message: 'Username is required!' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  phoneNumber: schemaHelper.phoneNumber({ isValid: isValidPhoneNumber }),
  password: zod
    .string()
    .min(1, { message: 'Password is required!' })
    .min(6, { message: 'Password must be at least 6 characters!' }),
});

// ----------------------------------------------------------------------

export function SignUpView() {
  const showPassword = useBoolean();
  const router = useRouter();
  const [signup, { isLoading }] = useSignupMutation();

  const defaultValues: SignUpSchemaType = {
    fullName: '',
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
  };

  const methods = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await signup(data).unwrap();
      // console.log('response', response);
      if (response.error === null) {
        toast.success(`Verification code sent to your email!`);
        router.push(`${paths.auth.jwt.verify}?email=${data.email}`);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    }
  });

  const renderForm = () => (
    <Box
      sx={{
        gap: 3,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{ display: 'flex', gap: { xs: 3, sm: 2 }, flexDirection: { xs: 'column', sm: 'row' } }}
      >
        <Field.Text
          name="fullName"
          label="Full name"
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <Field.Text name="username" label="Username" slotProps={{ inputLabel: { shrink: true } }} />
      </Box>
      <Field.Text name="email" label="Email address" slotProps={{ inputLabel: { shrink: true } }} />
      <Field.Phone name="phoneNumber" label="Phone number" placeholder="61XXXXXXX" />
      <Field.Text
        name="password"
        label="Password"
        placeholder="6+ characters"
        type={showPassword.value ? 'text' : 'password'}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={showPassword.onToggle} edge="end">
                  <Iconify icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting || isLoading}
        loadingIndicator="Create account..."
      >
        Create account
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <AnimateLogoRotate sx={{ mb: 3, mx: 'auto' }} />

      <FormHead
        title="Get start now"
        description={
          <>
            {`Already have an account? `}
            <Link component={RouterLink} href={paths.auth.jwt.signIn} variant="subtitle2">
              Sign in
            </Link>
          </>
        }
      />

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>

      {/* <SignUpTerms /> */}
    </>
  );
}
