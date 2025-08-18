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
  const role = localStorage.getItem('role');

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={
          role === 'ADMIN' ? paths.dashboard.subscription.root : paths.staff.subscription.root
        }
        links={[
          {
            name: role === 'ADMIN' ? 'Dashboard' : 'Staff',
            href: role === 'ADMIN' ? paths.dashboard.root : paths.staff.shopOwner.root,
          },
          { name: 'Subscription', href: paths.dashboard.subscription.root },
          { name: currentSubscription?.id },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <SubscriptionEditForm currentSubscription={currentSubscription} />
    </DashboardContent>
  );
}
