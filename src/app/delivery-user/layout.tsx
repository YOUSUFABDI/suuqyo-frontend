import { CONFIG } from 'src/global-config';
import { DeliveryUserLayout } from 'src/layouts/delivery-user';

import { AuthGuard, RoleBasedGuard } from 'src/sections/auth/guard';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  if (CONFIG.auth.skip) {
    return <DeliveryUserLayout>{children}</DeliveryUserLayout>;
  }

  return (
    <AuthGuard>
      <RoleBasedGuard allowedRoles={['DELIVERY_USER']}>
        <DeliveryUserLayout>{children}</DeliveryUserLayout>
      </RoleBasedGuard>
    </AuthGuard>
  );
}
