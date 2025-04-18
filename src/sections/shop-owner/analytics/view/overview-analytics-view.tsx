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
import { LoadingScreen } from 'src/components/loading-screen';
import { AnalyticsBestDeliveryUser } from '../analytics-best-delivery-user';

import { _ecommerceBestSalesman } from 'src/_mock';

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
        <Grid size={{ xs: 12, md: 8 }}>
          <AnalyticsWelcome
            title={`Congratulations 🎉  \n ${user?.username}`}
            description={
              analyticsData?.summary.completedOrders.current === 0
                ? 'Your shop is ready for its first sale!'
                : `Great news! You've successfully sold  ${analyticsData?.summary.productsSold.current} product${analyticsData?.summary.productsSold.current !== 1 ? 's' : ''}.`
            }
            img={<MotivationIllustration hideBackground />}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <AnalyticsNewProducts list={analyticsData?.newProducts || []} />
        </Grid>

        {/* Changed md:4 to md:2.4 to fit four in a row (12/5=2.4) */}
        <Grid size={{ xs: 12, md: 2.4 }}>
          <AnalyticsWidgetSummary
            title="Total product"
            total={analyticsData?.summary.totalProducts.current || 0}
            chart={{
              categories: analyticsData?.chartData.categories || [],
              series: analyticsData?.chartData.orders || [],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 2.4 }}>
          <AnalyticsWidgetSummary
            title="Quantity sold"
            total={analyticsData?.summary.productsSold.current || 0}
            chart={{
              categories: analyticsData?.chartData.categories || [],
              series: analyticsData?.chartData.productsSold || [],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 2.4 }}>
          <AnalyticsWidgetSummary
            title="Total sale"
            total={analyticsData?.summary?.totalRevenue?.current || 0}
            prefix="$"
            chart={{
              categories: analyticsData?.chartData.categories || [],
              series: analyticsData?.chartData.revenue || [],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 2.4 }}>
          <AnalyticsWidgetSummary
            title="Pending Order"
            total={analyticsData?.summary.totalOrders.current || 0}
            chart={{
              categories: analyticsData?.chartData.categories || [],
              series: analyticsData?.chartData.orders || [],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 2.4 }}>
          <AnalyticsWidgetSummary
            title="Completed Orders"
            total={analyticsData?.summary.completedOrders.current || 0}
            chart={{
              categories: analyticsData?.chartData.categories || [],
              series: analyticsData?.chartData.completedOrders || [],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AnalyticsBestDeliveryUser
            title="Best delivery users"
            tableData={analyticsData?.getTopDeliveryUsers || []}
            headCells={[
              { id: 'name', label: 'Name' },
              { id: 'phone', label: 'Phone' },
              { id: 'country', label: 'Country' },
              { id: 'totalDeliveries', label: 'Total' },
              { id: 'rank', label: 'Rank' },
            ]}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
