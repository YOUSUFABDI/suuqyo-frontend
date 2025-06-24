'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useBoolean } from 'minimal-shared/hooks';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';

import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';

import { AnimateLogoRotate } from 'src/components/animate';
import { Field, Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';

import { FormHead } from '../../components/form-head';

import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { useLoginMutation } from 'src/store/auth/auth';
import { setCredentials } from 'src/store/auth/authSlice';
import { getErrorMessage } from 'src/utils/error.message';

// ----------------------------------------------------------------------

export type SignInSchemaType = zod.infer<typeof SignInSchema>;

export const SignInSchema = zod.object({
  email: zod.string().min(1, { message: 'Email is required!' }),
  // .({ message: 'Email must be a valid email address!' }),
  password: zod
    .string()
    .min(1, { message: 'Password is required!' })
    .min(6, { message: 'Password must be at least 6 characters!' }),
});

// ----------------------------------------------------------------------

export function SignInView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showPassword = useBoolean();
  const dispatch: AppDispatch = useDispatch();
  const [login, { isLoading, data }] = useLoginMutation();

  const returnTo = searchParams.get('returnTo');

  const handleRoleBasedRedirect = (role: string) => {
    const redirectPath: any = returnTo; // Use returnTo if exists, else default

    // Only override if no returnTo specified
    if (!returnTo) {
      switch (role) {
        case 'ADMIN':
          return '/dashboard';
        case 'SHOP_OWNER':
          return '/shop-owner';
        case 'DELIVERY_USER':
          return '/delivery-user';
        default:
          return '/';
      }
    }

    return redirectPath;
  };

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const defaultValues: SignInSchemaType = {
    email: '',
    password: '',
  };

  const methods = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await login({
        emailOrUsername: data.email,
        password: data.password,
      }).unwrap();

      if (response.error === null) {
        dispatch(
          setCredentials({
            token: response?.payload?.data?.access_token || '',
            email: response?.payload?.data.email || '',
            role: response?.payload?.data.role || '',
          })
        );
      }

      if (response.error === null) {
        // Get the role from the response, not localStorage
        const role = response?.payload?.data.role || '';
        const redirectPath = handleRoleBasedRedirect(role);
        router.push(redirectPath);
      }
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      setErrorMessage(errorMessage);
    }
  });

  return (
    <>
      <AnimateLogoRotate sx={{ mb: 3, mx: 'auto' }} />

      <FormHead
        title="Sign in to your account"
        description={
          <>
            {`Don’t have an account? `}
            <Link component={RouterLink} href={paths.auth.jwt.signUp} variant="subtitle2">
              Get started
            </Link>
          </>
        }
      />

      {!!errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
          <Field.Text
            name="email"
            label="Email address or username"
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <Box sx={{ gap: 1.5, display: 'flex', flexDirection: 'column' }}>
            <Link
              component={RouterLink}
              href={paths.auth.jwt.resetPassword}
              variant="body2"
              color="inherit"
              sx={{ alignSelf: 'flex-end' }}
            >
              Forgot password?
            </Link>
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
                        <Iconify
                          icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>
          <LoadingButton
            fullWidth
            color="inherit"
            size="large"
            type="submit"
            variant="contained"
            loading={isLoading}
            disabled={isLoading}
            loadingIndicator="Sign in..."
          >
            Sign in
          </LoadingButton>
        </Box>
      </Form>
    </>
  );
}
