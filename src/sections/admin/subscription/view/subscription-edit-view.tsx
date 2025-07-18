'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { SubscriptionEditForm } from '../subscription-edit-form';
import { SubscriptionResDT } from '../types/subscription';

// ----------------------------------------------------------------------

type Props = {
  subscription?: SubscriptionResDT | null;
};

export function SubscriptionEditView({ subscription: currentSubscription }: Props) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.subscription.root}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Subscription', href: paths.dashboard.subscription.root },
          { name: currentSubscription?.id },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <SubscriptionEditForm currentSubscription={currentSubscription} />
    </DashboardContent>
  );
}
