import { CONFIG } from 'src/global-config';
import { StaffLayout } from 'src/layouts/staff';

import { AuthGuard, RoleBasedGuard } from 'src/sections/auth/guard';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  if (CONFIG.auth.skip) {
    return <StaffLayout>{children}</StaffLayout>;
  }

  return (
    <AuthGuard>
      <RoleBasedGuard allowedRoles={['STAFF']}>
        <StaffLayout>{children}</StaffLayout>
      </RoleBasedGuard>
    </AuthGuard>
  );
}
