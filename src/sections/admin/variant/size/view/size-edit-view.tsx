'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { SizeDT } from '../types/types';
import { SizeEditForm } from '../size-edit-form';

// ----------------------------------------------------------------------

type Props = {
  size?: SizeDT | null;
};

export function SizeEditView({ size: currentSize }: Props) {
  const role = localStorage.getItem('role');

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.variant.root}
        links={[
          {
            name: 'Dashbaord',
            href: paths.dashboard.root,
          },
          {
            name: 'Variant',
            href: paths.dashboard.variant.root,
          },
          { name: currentSize?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <SizeEditForm currentSize={currentSize} />
    </DashboardContent>
  );
}
