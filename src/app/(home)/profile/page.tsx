import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';
import { AuthGuard, RoleBasedGuard } from 'src/sections/auth/guard';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Profile - ${CONFIG.appName}` };

export default function Page() {
  return (
    <AuthGuard>
      <RoleBasedGuard allowedRoles={['CUSTOMER']}>
        <h1>Profile</h1>
      </RoleBasedGuard>
    </AuthGuard>
  );
}
