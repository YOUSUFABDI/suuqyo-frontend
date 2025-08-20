'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ShopOwnerDT } from '../types/types';
import { ShopOwnerEditForm } from '../shop-owner-edit-form';

// ----------------------------------------------------------------------

type Props = {
  user?: ShopOwnerDT;
};

export function ShopOwnerEditView({ user: currentUser }: Props) {
  const role = localStorage.getItem('role');

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        // backHref={paths.staff.shopOwner.root}
        backHref={role === 'ADMIN' ? paths.dashboard.shopOwner.root : paths.staff.shopOwner.root}
        links={[
          {
            name: role === 'ADMIN' ? 'Dashbaord' : 'Staff',
            href: role === 'ADMIN' ? paths.dashboard.root : paths.staff.shopOwner.root,
          },
          {
            name: 'Shop owner',
            href: role === 'ADMIN' ? paths.dashboard.shopOwner.root : paths.staff.shopOwner.root,
          },
          { name: currentUser?.fullName },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ShopOwnerEditForm currentUser={currentUser} />
    </DashboardContent>
  );
}
