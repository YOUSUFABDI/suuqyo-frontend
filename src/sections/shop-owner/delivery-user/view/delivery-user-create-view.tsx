'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { DeliveryUserNewForm } from '../delivery-user-new-form';

// ----------------------------------------------------------------------

export function DeliveryUserCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new delivery user"
        links={[
          { name: 'Shop owner', href: paths.shopOwner.root },
          { name: 'Shop owner', href: paths.shopOwner.deliveryUser.root },
          { name: 'New delivery user' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <DeliveryUserNewForm />
    </DashboardContent>
  );
}
