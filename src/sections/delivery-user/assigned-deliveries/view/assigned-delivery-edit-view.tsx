'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { AssignedDeliveryEditForm } from '../assigned-delivery-edit-form';
import { DeliveryUserResDT } from '../types/types';

// ----------------------------------------------------------------------

type Props = {
  user?: DeliveryUserResDT;
};

export function AssignedDeliveryEditView({ user: currentUser }: Props) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.deliveryUser.assignedDeliveries.root}
        links={[
          { name: 'Delivery user', href: paths.deliveryUser.root },
          { name: 'Assigned deliveries', href: paths.deliveryUser.assignedDeliveries.root },
          { name: currentUser?.user.fullName },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <AssignedDeliveryEditForm currentUser={currentUser} />
    </DashboardContent>
  );
}
