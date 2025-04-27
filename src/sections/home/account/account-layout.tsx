'use client';

import type { DashboardContentProps } from 'src/layouts/dashboard';

import { removeLastSlash } from 'minimal-shared/utils';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';
import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Box, Container } from '@mui/material';

// ----------------------------------------------------------------------

const NAV_ITEMS = [
  {
    label: 'General',
    icon: <Iconify width={24} icon="solar:user-id-bold" />,
    href: paths.customer.account.root,
  },
  {
    label: 'Security',
    icon: <Iconify width={24} icon="ic:round-vpn-key" />,
    href: `${paths.customer.account.changePassword}`,
  },
];

// ----------------------------------------------------------------------

export function AccountLayout({ children, ...other }: DashboardContentProps) {
  const pathname = usePathname();

  return (
    <Container sx={{ py: 3 }}>
      <CustomBreadcrumbs
        heading="Account"
        links={[
          { name: 'User', href: paths.customer.root },
          { name: 'User', href: paths.customer.account.root },
          { name: 'Account' },
        ]}
        sx={{ mb: 3 }}
      />

      <Tabs value={removeLastSlash(pathname)} sx={{ mb: { xs: 3, md: 5 } }}>
        {NAV_ITEMS.map((tab) => (
          <Tab
            component={RouterLink}
            key={tab.href}
            label={tab.label}
            icon={tab.icon}
            value={tab.href}
            href={tab.href}
          />
        ))}
      </Tabs>

      {children}
    </Container>
  );
}
