import { CONFIG } from 'src/global-config';
import { ShopOwnerLayout } from 'src/layouts/shop-owner';

import { AuthGuard, RoleBasedGuard } from 'src/sections/auth/guard';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  if (CONFIG.auth.skip) {
    return <ShopOwnerLayout>{children}</ShopOwnerLayout>;
  }

  return (
    <AuthGuard>
      <RoleBasedGuard allowedRoles={['SHOP_OWNER']}>
        <ShopOwnerLayout>{children}</ShopOwnerLayout>
      </RoleBasedGuard>
    </AuthGuard>
  );
}
