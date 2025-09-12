'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useBoolean } from 'minimal-shared/hooks';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';

import { AnimateLogoRotate } from 'src/components/animate';
import { Field, Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { FormHead } from '../../components/form-head';

import axios, { AxiosError } from 'axios';
import { API } from 'src/store/api';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store';
import { setLoading as setAuthLoading, setCredentials } from 'src/store/auth/authSlice';
import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

export type SignInSchemaType = zod.infer<typeof SignInSchema>;

export const SignInSchema = zod.object({
  email: zod.string().min(1, { message: 'Email is required!' }),
  password: zod
    .string()
    .min(1, { message: 'Password is required!' })
    .min(6, { message: 'Password must be at least 6 characters!' }),
});

export function SignInView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showPassword = useBoolean();
  const returnTo = searchParams.get('returnTo');
  const { t } = useTranslate();

  // Local error state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Redux state
  const dispatch = useDispatch();
  const { loading } = useSelector((state: RootState) => state.auth);

  const methods = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
    defaultValues: { email: '', password: '' },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleRoleBasedRedirect = (role: string) => {
    if (returnTo) return returnTo;
    switch (role) {
      case 'ADMIN':
        return '/dashboard';
      case 'SHOP_OWNER':
        return '/shop-owner';
      case 'DELIVERY_USER':
        return '/delivery-user';
      case 'STAFF':
        return '/staff/shop-owner';
      default:
        return '/';
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    dispatch(setAuthLoading(true));
    setErrorMessage(null);

    try {
      const res = await axios.post(`${API}/auth/login`, {
        emailOrUsername: data.email,
        password: data.password,
      });

      const { access_token, role, email } = res.data.payload.data;
      // Dispatch credentials
      dispatch(setCredentials({ token: access_token, role, email }));

      // Redirect
      router.push(handleRoleBasedRedirect(role));
    } catch (err: any) {
      const axiosErr = err as AxiosError<{
        error: { details: string; message: string };
        message: string;
        statusCode: number;
      }>;
      const detailMessage = axiosErr.response?.data?.error?.message || 'An unknown error occurred';

      setErrorMessage(detailMessage);
    } finally {
      dispatch(setAuthLoading(false));
    }
  });

  return (
    <>
      <AnimateLogoRotate sx={{ mb: 3, mx: 'auto' }} />

      <FormHead
        title={t('signin.title')}
        description={
          <>
            {/* Don’t have an account?{' '} */}
            {t('signin.desc')}{' '}
            <Link component={RouterLink} href={paths.auth.jwt.signUp} variant="subtitle2">
              {/* Get started */}
              {t('signin.btn_start')}
            </Link>
          </>
        }
      />

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Field.Text
            name="email"
            label="Email address or username"
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Link
              component={RouterLink}
              href={paths.auth.jwt.resetPassword}
              variant="body2"
              color="inherit"
              sx={{ alignSelf: 'flex-end' }}
            >
              {/* Forgot password? */}
              {t('signin.forgot_pass')}
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
            loading={loading || isSubmitting}
            disabled={loading || isSubmitting}
          >
            {/* {loading || isSubmitting ? 'Signing in…' : 'Sign in'} */}
            {loading || isSubmitting ? t('signin.signing_in') : t('pages.signin')}
          </LoadingButton>
        </Box>
      </Form>
    </>
  );
}
