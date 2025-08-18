'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ShopOwnerNewForm } from '../shop-owner-new-form';

// ----------------------------------------------------------------------

export function ShopOwnerCreateView() {
  const role = localStorage.getItem('role');

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new shop owner"
        links={[
          { name: 'Staff', href: role === 'ADMIN' ? paths.dashboard.root : paths.staff.root },
          {
            name: 'Shop owner',
            href: role === 'ADMIN' ? paths.dashboard.shopOwner.root : paths.staff.shopOwner.root,
          },
          { name: 'New shop owner' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ShopOwnerNewForm />
    </DashboardContent>
  );
}
