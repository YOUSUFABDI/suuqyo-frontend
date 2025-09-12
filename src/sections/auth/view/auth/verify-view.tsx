'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';

import { paths } from 'src/routes/paths';

import { EmailInboxIcon } from 'src/assets/icons';

import { Field, Form } from 'src/components/hook-form';

import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'src/components/snackbar';
import { useVerifyOTPMutation } from 'src/store/auth/auth';
import { getErrorMessage } from 'src/utils/error.message';
import { FormHead } from '../../components/form-head';
import { FormReturnLink } from '../../components/form-return-link';
import { useTranslate } from 'src/locales';
// ----------------------------------------------------------------------

export type VerifySchemaType = zod.infer<typeof VerifySchema>;

export const VerifySchema = zod.object({
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  code: zod
    .string()
    .min(1, { message: 'Code is required!' })
    .min(6, { message: 'Code must be at least 6 characters!' }),
});

// ----------------------------------------------------------------------

export function VerifyView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verifyOTP, { isLoading }] = useVerifyOTPMutation();
  const { t } = useTranslate();

  const emailParam = searchParams.get('email');
  const defaultEmail = emailParam ? emailParam : '';

  const defaultValues: VerifySchemaType = {
    code: '',
    email: defaultEmail,
  };

  const methods = useForm<VerifySchemaType>({
    resolver: zodResolver(VerifySchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const reqData = {
        email: data.email,
        code: Number(data.code),
      };
      const response = await verifyOTP(reqData).unwrap();

      if (response.error === null) {
        toast.success('Account verified successfully!');
        router.push(paths.auth.jwt.signIn);
      }
    } catch (error) {
      console.log(error);
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    }
  });

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Field.Text
        name="email"
        label="Email address"
        placeholder="example@gmail.com"
        slotProps={{ inputLabel: { shrink: true } }}
      />

      <Field.Code name="code" />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting || isLoading}
        loadingIndicator="Verify..."
      >
        {t('verify.btn_verify')}
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <FormHead
        icon={<EmailInboxIcon />}
        title={t('verify.title')}
        description={`${t('verify.desc')}`}
      />

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>

      {/* <FormResendCode onResendCode={() => {}} value={0} disabled={false} /> */}

      <FormReturnLink href={paths.auth.jwt.signIn} label={t('verify.return_to_signin')} />
    </>
  );
}
