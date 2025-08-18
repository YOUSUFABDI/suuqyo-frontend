'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { UserDT } from '../types/types';
import { UserEditForm } from '../user-edit-form';

// ----------------------------------------------------------------------

type Props = {
  user?: UserDT | null;
};

export function UserEditView({ user: currentUser }: Props) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.shopOwner.root}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'user', href: paths.dashboard.user.root },
          { name: currentUser?.fullName },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <UserEditForm currentUser={currentUser} />
    </DashboardContent>
  );
}
