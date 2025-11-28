'use client';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';

import { DashboardContent } from 'src/layouts/dashboard';
import { OneOrderStatusDT } from '../types/types';

import { OrderStatusDetailsCustomer } from '../order-status-details-customer';
import { OrderStatusDetailsItems } from '../order-status-details-item';
import { Divider } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
  order?: OneOrderStatusDT | null;
};

export function OrderStatusDetailsView({ order }: Props) {
  // console.log('data', order);

  if (!order) {
    return <Box sx={{ p: 3 }}>Loading...</Box>;
  }

  // If there are no orders
  if (!order.orders || order.orders.length === 0) {
    return (
      <DashboardContent>
        <Box sx={{ p: 5, textAlign: 'center' }}>
          <Typography variant="h6">No orders found for this Shop Owner.</Typography>
        </Box>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">Orders for {order.shopName}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Total Orders: {order.totalOrders}
        </Typography>
      </Box>

      {/* Loop through ALL orders */}
      {order.orders.map((singleOrder) => (
        <Grid container spacing={3} key={singleOrder.orderId} sx={{ mb: 5 }}>
          {/* Left Side: Order Items */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
              <OrderStatusDetailsItems order={singleOrder} />
            </Box>
          </Grid>

          {/* Right Side: Customer Info & Address */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Use your existing Customer Component */}
              <OrderStatusDetailsCustomer customer={singleOrder.customer} />

              <Divider sx={{ borderStyle: 'dashed' }} />

              {/* Delivery Location Simple View */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Delivery Location
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {singleOrder.customerAddress}
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>
      ))}
    </DashboardContent>
  );
}
