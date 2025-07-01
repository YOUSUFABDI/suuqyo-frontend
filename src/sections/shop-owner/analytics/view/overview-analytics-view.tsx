'use client';

import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import { MotivationIllustration } from 'src/assets/illustrations';
import { DashboardContent } from 'src/layouts/dashboard';
import { LoadingScreen } from 'src/components/loading-screen';
import { useUser } from 'src/sections/auth/hooks';
import { AnalyticsBestDeliveryUser } from '../analytics-best-delivery-user';
import { AnalyticsNewProducts } from '../analytics-new-products';
import { AnalyticsWelcome } from '../analytics-welcome';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { UseAnalytics } from '../hooks';

import { formatISO } from 'date-fns';
import React, { useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs'; // <-- Import Dayjs
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import axios from 'axios';
import { API } from 'src/store/api';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export function OverviewAnalyticsView() {
  const { user } = useUser();
  const { analyticsData, isLoading } = UseAnalytics();
  console.log('analyticsData', analyticsData);
  const theme = useTheme();

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Helper: render a widget with responsive sizing
  const Widget = (props: React.ComponentProps<typeof AnalyticsWidgetSummary>) => (
    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
      <AnalyticsWidgetSummary {...props} />
    </Grid>
  );

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        {/* Welcome + illustration */}
        <Grid item xs={12} md={12}>
          <AnalyticsWelcome
            title={`Congratulations 🎉  \n ${user?.username}`}
            description={
              analyticsData?.summary?.completedOrders === 0
                ? 'Your shop is ready for its first sale!'
                : `Great news! You've successfully sold ${analyticsData?.summary?.quantitySold} product${
                    analyticsData?.summary?.quantitySold !== 1 ? 's' : ''
                  }.`
            }
            img={<MotivationIllustration hideBackground />}
          />
        </Grid>

        {/* Summary? widgets */}
        <Widget title="Total products" total={analyticsData?.summary?.totalProducts || 0} />
        <Widget title="Quantity sold" total={analyticsData?.summary?.quantitySold || 0} />
        <Widget title="Total sale" total={analyticsData?.summary?.totalSale || 0} prefix="$" />
        <Widget title="Total profit" total={analyticsData?.summary.totalProfit || 0} prefix="$" />
        <Widget title="Pending orders" total={analyticsData?.summary?.pendingOrders || 0} />
        <Widget title="Completed orders" total={analyticsData?.summary?.completedOrders || 0} />

        {/* Best delivery users */}
        <Grid item xs={12} md={6} lg={8}>
          <AnalyticsBestDeliveryUser
            title="Best delivery users"
            tableData={analyticsData?.summary.getTopDeliveryUsers || []}
            headCells={[
              { id: 'name', label: 'Name' },
              { id: 'phone', label: 'Phone' },
              { id: 'country', label: 'Country' },
              { id: 'totalDeliveries', label: 'Total' },
              { id: 'rank', label: 'Rank' },
            ]}
          />
        </Grid>

        {/* <Grid item xs={12} md={6} lg={8}>
          <AnalyticsByDateView />
        </Grid> */}
      </Grid>
    </DashboardContent>
  );
}

interface Metrics {
  totalProducts: number;
  quantitySold: number;
  totalSale: number;
  totalProfit: number;
  pendingOrders: number;
  completedOrders: number;
}

function AnalyticsByDateView() {
  const today = formatISO(new Date(), { representation: 'date' });
  const [startDate, setStartDate] = useState<Dayjs>(dayjs(today)); // Use Dayjs object
  const [endDate, setEndDate] = useState<Dayjs>(dayjs(today)); // Use Dayjs object
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data whenever start or end date changes
  useEffect(() => {
    const fetchMetrics = async () => {
      setError(null);
      setLoading(true);
      setMetrics(null);
      try {
        const res = await axios.get(`${API}/analytics/custom`, {
          params: {
            startDate: startDate.toISOString(), // Use Dayjs' toISOString()
            endDate: endDate.toISOString(), // Use Dayjs' toISOString()
          },
        });
        setMetrics(res.data.payload.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [startDate, endDate]);

  const handleTodayClick = () => {
    const today = dayjs();
    setStartDate(today);
    setEndDate(today);
  };

  return (
    <Box>
      <Box component="form" sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={(newValue) => setStartDate(newValue ?? dayjs())} // Ensure we don't set `null`
          slotProps={{ textField: { fullWidth: true } }}
          sx={{ maxWidth: { md: 200 } }}
        />

        <DatePicker
          label="End Date"
          value={endDate}
          onChange={(newValue) => setEndDate(newValue ?? dayjs())} // Ensure we don't set `null`
          slotProps={{ textField: { fullWidth: true } }}
          sx={{ maxWidth: { md: 200 } }}
        />

        <LoadingButton
          variant="outlined"
          onClick={handleTodayClick}
          sx={{ maxWidth: { md: 200 }, height: 56 }}
        >
          Today
        </LoadingButton>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {metrics && (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <AnalyticsWidgetSummary
              title="Total Products"
              total={metrics.totalProducts}
              chart={{
                categories: [],
                series: [],
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AnalyticsWidgetSummary
              title="Quantity Sold"
              total={metrics.quantitySold}
              chart={{
                categories: [],
                series: [],
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AnalyticsWidgetSummary
              title="Total Sale"
              total={metrics.totalSale}
              prefix="$"
              chart={{
                categories: [],
                series: [],
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AnalyticsWidgetSummary
              title="Total Profit"
              total={metrics.totalProfit}
              prefix="$"
              chart={{
                categories: [],
                series: [],
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AnalyticsWidgetSummary
              title="Pending Orders"
              total={metrics.pendingOrders}
              chart={{
                categories: [],
                series: [],
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AnalyticsWidgetSummary
              title="Completed Orders"
              total={metrics.completedOrders}
              chart={{
                categories: [],
                series: [],
              }}
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
