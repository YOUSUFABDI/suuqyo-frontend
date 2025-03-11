'use client';

import type { DashboardContentProps } from 'src/layouts/dashboard';

import { usePathname } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function MyShopLayout({ children, ...other }: DashboardContentProps) {
  const pathname = usePathname();

  return (
    <DashboardContent {...other}>
      <CustomBreadcrumbs
        heading="My shop"
        links={[
          { name: 'Shop owner', href: paths.shopOwner.root },
          { name: 'Shop', href: paths.shopOwner.myShop.root },
          { name: 'My shop' },
        ]}
        sx={{ mb: 3 }}
      />

      {children}
    </DashboardContent>
  );
}
