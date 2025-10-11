'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { SizeNewForm } from '../size-new-form';

// ----------------------------------------------------------------------

export function SizeCreateView() {
  const role = localStorage.getItem('role');

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new size"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Variant',
            href: paths.dashboard.variant.root,
          },
          { name: 'New Size' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <SizeNewForm />
    </DashboardContent>
  );
}
