'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { DeliveryUserEditForm } from '../delivery-user-edit-form';
import { DeliveryUserResDT } from '../types/types';

// ----------------------------------------------------------------------

type Props = {
  user?: DeliveryUserResDT;
};

export function DeliveryUserEditView({ user: currentUser }: Props) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.shopOwner.deliveryUser.root}
        links={[
          { name: 'Shop owner', href: paths.shopOwner.root },
          { name: 'Delivery user', href: paths.shopOwner.deliveryUser.root },
          { name: currentUser?.user.fullName },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <DeliveryUserEditForm currentUser={currentUser} />
    </DashboardContent>
  );
}
