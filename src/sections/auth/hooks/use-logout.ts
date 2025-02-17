import { useCallback } from 'react';

import { AppDispatch } from 'src/store';
import { useRouter } from 'src/routes/hooks';
import { logout } from 'src/store/auth/authSlice';
import { useDispatch } from 'react-redux';

import { toast } from 'src/components/snackbar';

export function useLogout() {
  const dispatch: AppDispatch = useDispatch();

  const router = useRouter();

  const handleLogout = useCallback(async () => {
    try {
      dispatch(logout());

      //   onClose?.();
      // router.replace('/');
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('Unable to logout!');
    }
  }, [dispatch, router]);

  return {
    handleLogout,
  };
}
