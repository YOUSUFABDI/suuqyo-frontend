import type { ButtonProps } from '@mui/material/Button';

import { useCallback } from 'react';

import Button from '@mui/material/Button';

import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';

import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { logout } from 'src/store/auth/authSlice';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

type Props = ButtonProps & {
  onClose?: () => void;
};

export function SignOutButton({ onClose, sx, ...other }: Props) {
  const dispatch: AppDispatch = useDispatch();

  const router = useRouter();

  const handleLogout = useCallback(async () => {
    try {
      dispatch(logout());

      onClose?.();

      window.location.href = paths.auth.jwt.signIn;
    } catch (error) {
      console.error(error);
      toast.error('Unable to logout!');
    }
  }, [dispatch, onClose, router]);

  return (
    <Button
      fullWidth
      variant="soft"
      size="large"
      color="error"
      onClick={handleLogout}
      sx={sx}
      {...other}
    >
      Logout
    </Button>
  );
}
