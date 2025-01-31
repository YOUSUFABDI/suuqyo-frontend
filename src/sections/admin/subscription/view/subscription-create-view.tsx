'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { SubscriptionNewForm } from '../subscription-new-form';

// ----------------------------------------------------------------------

export function SubscriptionCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new subscription"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Subscriptions', href: paths.dashboard.subscription.root },
          { name: 'New subscription' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <SubscriptionNewForm />
    </DashboardContent>
  );
}
