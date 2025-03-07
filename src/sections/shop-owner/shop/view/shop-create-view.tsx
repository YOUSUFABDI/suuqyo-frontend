'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ShopNewForm } from '../shop-new-form';

// ----------------------------------------------------------------------

export function ShopOwnerCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new shop owner"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Shop owner', href: paths.dashboard.shopOwner.root },
          { name: 'New shop owner' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ShopNewForm />
    </DashboardContent>
  );
}
