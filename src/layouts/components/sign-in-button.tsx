import type { ButtonProps } from '@mui/material/Button';

import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';

import { RouterLink } from 'src/routes/components';

import { paths } from 'src/routes/paths';
import { useAuth } from 'src/sections/auth/hooks';

// ----------------------------------------------------------------------

export function SignInButton({ sx, ...other }: ButtonProps) {
  const { authenticated } = useAuth();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setRole(localStorage.getItem('role'));
  }, []);

  const getRedirectPath = () => {
    if (authenticated) {
      switch (role) {
        case 'ADMIN':
          return paths.dashboard.root;
        case 'SHOP_OWNER':
          return paths.shopOwner.root;
        case 'DELIVERY_USER':
          return paths.deliveryUser.root;
        default:
          return '/';
      }
    }
    return paths.auth.jwt.signIn;
  };

  return (
    <Button component={RouterLink} href={getRedirectPath()} variant="outlined" sx={sx} {...other}>
      Sign in
    </Button>
  );
}
