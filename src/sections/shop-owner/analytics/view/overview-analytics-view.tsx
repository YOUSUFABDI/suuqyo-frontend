'use client';

import Grid from '@mui/material/Grid2';
import { useTheme } from '@mui/material/styles';

import { _ecommerceNewProducts } from 'src/_mock';
import { MotivationIllustration } from 'src/assets/illustrations';
import { DashboardContent } from 'src/layouts/dashboard';

import { useUser } from 'src/sections/auth/hooks';
import { AnalyticsNewProducts } from '../analytics-new-products';
import { AnalyticsWelcome } from '../analytics-welcome';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { UseAnalytics } from '../hooks';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  const { user } = useUser();
  const { analyticsData } = UseAnalytics();

  const theme = useTheme();

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <AnalyticsWelcome
            title={`Congratulations 🎉  \n ${user?.fullName}`}
            // description={`Great news! You've successfully sold ${analyticsData?.summary.completedOrders.current || 0} products.`}
            description={
              analyticsData?.summary.completedOrders.current === 0
                ? 'Your shop is ready for its first sale!'
                : `Great news! You've successfully sold ${analyticsData?.summary.completedOrders.current} product${analyticsData?.summary.completedOrders.current !== 1 ? 's' : ''}.`
            }
            img={<MotivationIllustration hideBackground />}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <AnalyticsNewProducts list={analyticsData?.newProducts || []} />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <AnalyticsWidgetSummary
            title="Total product"
            percent={analyticsData?.summary.totalProducts.percent || 0}
            total={analyticsData?.summary.totalProducts.current || 0}
            chart={{
              categories: analyticsData?.chartData.categories || [],
              series: analyticsData?.chartData.orders || [],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <AnalyticsWidgetSummary
            title="Total Order"
            percent={analyticsData?.summary.totalOrders.percent || 0}
            total={analyticsData?.summary.totalOrders.current || 0}
            chart={{
              categories: analyticsData?.chartData.categories || [],
              series: analyticsData?.chartData.orders || [],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <AnalyticsWidgetSummary
            title="Product sold"
            percent={analyticsData?.summary.completedOrders.percent || 0}
            total={analyticsData?.summary.completedOrders.current || 0}
            chart={{
              categories: analyticsData?.chartData.categories || [],
              series: analyticsData?.chartData.completedOrders || [],
            }}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
