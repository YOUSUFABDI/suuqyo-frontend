'use client';

import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';

import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { useUser } from 'src/sections/auth/hooks';
import { UseAdminAnalytic } from '../hooks';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  const { user } = useUser();
  const { adminAnalytic } = UseAdminAnalytic();

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Hi 👋 {user?.username}, Welcome back
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Total profit"
            percent={adminAnalytic?.percentages.profit || 0}
            total={adminAnalytic?.totalProfit}
            icon={
              <img
                alt="Weekly sales"
                src={`${CONFIG.assetsDir}/assets/icons/glass/ic-glass-bag.svg`}
              />
            }
            chart={{
              categories: adminAnalytic?.monthlyProfit.categories || [],
              series: adminAnalytic?.monthlyProfit.series || [],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Total users"
            percent={adminAnalytic?.percentages.users || 0}
            total={adminAnalytic?.totalUsers}
            color="secondary"
            icon={
              <img
                alt="New users"
                src={`${CONFIG.assetsDir}/assets/icons/glass/ic-glass-users.svg`}
              />
            }
            chart={{
              categories: adminAnalytic?.monthlyUsers.categories || [],
              series: adminAnalytic?.monthlyUsers.series || [],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Total shop owners"
            percent={adminAnalytic?.percentages.shopOwners || 0}
            total={adminAnalytic?.totalShopOwners}
            color="warning"
            icon={
              <img
                alt="Purchase orders"
                src={`${CONFIG.assetsDir}/assets/icons/glass/ic-glass-buy.svg`}
              />
            }
            chart={{
              categories: adminAnalytic?.monthlyShopOwners.categories || [],
              series: adminAnalytic?.monthlyShopOwners.series || [],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Total buyers"
            percent={adminAnalytic?.percentages.buyers || 0}
            total={adminAnalytic?.totalBuyers}
            color="error"
            icon={
              <img
                alt="Messages"
                src={`${CONFIG.assetsDir}/assets/icons/glass/ic-glass-message.svg`}
              />
            }
            chart={{
              categories: adminAnalytic?.monthlyBuyers.categories || [],
              series: adminAnalytic?.monthlyBuyers.series || [],
            }}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
