'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { SubscriptionNewForm } from '../subscription-new-form';

// ----------------------------------------------------------------------

export function SubscriptionCreateView() {
  const role = localStorage.getItem('role');

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new subscription"
        links={[
          {
            name: role === 'ADMIN' ? 'Dashboard' : 'Staff',
            href: role === 'ADMIN' ? paths.dashboard.root : paths.staff.shopOwner.root,
          },
          {
            name: 'Subscriptions',
            href:
              role === 'ADMIN' ? paths.dashboard.subscription.root : paths.staff.subscription.root,
          },
          { name: 'New subscription' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <SubscriptionNewForm />
    </DashboardContent>
  );
}
