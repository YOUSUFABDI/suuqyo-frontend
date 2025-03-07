'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ShopOwnerDT } from '../types/types';
import { ShopEditForm } from '../shop-edit-form';

// ----------------------------------------------------------------------

type Props = {
  user?: ShopOwnerDT;
};

export function ShopOwnerEditView({ user: currentUser }: Props) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.shopOwner.root}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Shop owner', href: paths.dashboard.shopOwner.root },
          { name: currentUser?.fullName },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ShopEditForm currentUser={currentUser} />
    </DashboardContent>
  );
}
