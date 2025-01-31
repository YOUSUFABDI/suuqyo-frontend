import { CONFIG } from 'src/global-config';
import { DashboardLayout } from 'src/layouts/dashboard';

import { AuthGuard, RoleBasedGuard } from 'src/sections/auth/guard';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  if (CONFIG.auth.skip) {
    return <DashboardLayout>{children}</DashboardLayout>;
  }

  return (
    <AuthGuard>
      <RoleBasedGuard allowedRoles={['CUSTOMER']}>
        <DashboardLayout>{children}</DashboardLayout>
      </RoleBasedGuard>
    </AuthGuard>
  );
}
