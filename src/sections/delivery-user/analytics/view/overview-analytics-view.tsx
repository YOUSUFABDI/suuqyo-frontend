'use client';

import Grid from '@mui/material/Grid2';
import { useTheme } from '@mui/material/styles';

import { _ecommerceNewProducts } from 'src/_mock';
import { MotivationIllustration } from 'src/assets/illustrations';
import { DashboardContent } from 'src/layouts/dashboard';

import { useUser } from 'src/sections/auth/hooks';
import { AnalyticsWelcome } from '../analytics-welcome';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { UseAnalytics } from '../hooks';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  const { user } = useUser();
  const { analyticsData, isLoading } = UseAnalytics();

  const theme = useTheme();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 12 }}>
          <AnalyticsWelcome
            title={`Congratulations 🎉  \n ${user?.username}`}
            description={`Great news! you've completed ${analyticsData?.summary.completedDeliveries.current || 0} delivery.`}
            img={<MotivationIllustration hideBackground />}
          />
        </Grid>

        {/* Changed md:4 to md:3 to fit four in a row (12/4=3) */}
        <Grid size={{ xs: 12, md: 4 }}>
          <AnalyticsWidgetSummary
            title="Orders to delivery"
            total={analyticsData?.summary.ordersToDeliver.current || 0}
            chart={{
              categories: analyticsData?.chartData.categories || [],
              series: analyticsData?.chartData.ordersToDeliver || [],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <AnalyticsWidgetSummary
            title="Completed deliveries"
            total={analyticsData?.summary.completedDeliveries.current || 0}
            chart={{
              categories: analyticsData?.chartData.categories || [],
              series: analyticsData?.chartData.completedDeliveries || [],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <AnalyticsWidgetSummary
            title="All"
            total={analyticsData?.summary.all.current || 0}
            chart={{
              categories: analyticsData?.chartData.categories || [],
              series: analyticsData?.chartData.all || [],
            }}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
