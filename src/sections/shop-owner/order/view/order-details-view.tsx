'use client';

import { useCallback, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';

import { paths } from 'src/routes/paths';

import { ORDER_STATUS_OPTIONS } from '../types/types';
import { DashboardContent } from 'src/layouts/dashboard';

import { OrderDetailsCustomer } from '../order-details-customer';
import { OrderDetailsDelivery } from '../order-details-delivery';
import { OrderDetailsHistory } from '../order-details-history';
import { OrderDetailsItems } from '../order-details-item';
import { OrderDetailsPayment } from '../order-details-payment';
import { OrderDetailsShipping } from '../order-details-shipping';
import { OrderDetailsToolbar } from '../order-details-toolbar';
import { OrderResDT } from '../types/types';

// ----------------------------------------------------------------------

type Props = {
  order?: OrderResDT;
};

export function OrderDetailsView({ order }: Props) {
  console.log('order-----------', order);
  const [status, setStatus] = useState(order?.status);

  const handleChangeStatus = useCallback((newValue: string) => {
    setStatus(newValue);
  }, []);

  return (
    <DashboardContent>
      <OrderDetailsToolbar
        status={status}
        createdAt={order?.createdAt}
        orderNumber={order?.id}
        backHref={paths.shopOwner.order.root}
        onChangeStatus={handleChangeStatus}
        statusOptions={ORDER_STATUS_OPTIONS}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Box
            sx={{ gap: 3, display: 'flex', flexDirection: { xs: 'column-reverse', md: 'column' } }}
          >
            <OrderDetailsItems
              items={order?.items}
              // taxes={0}
              // shipping={0}
              // discount={0}
              // subtotal={order?.subtotal}
              totalAmount={order?.total}
            />

            {/* <OrderDetailsHistory history={order?.} /> */}
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <OrderDetailsCustomer customer={order?.customer} />

            <Divider sx={{ borderStyle: 'dashed' }} />
            {/* <OrderDetailsDelivery delivery={order?.delivery} /> */}

            {/* <Divider sx={{ borderStyle: 'dashed' }} /> */}
            {/* <OrderDetailsShipping shippingAddress={order?.shippingAddress} /> */}

            {/* <Divider sx={{ borderStyle: 'dashed' }} /> */}
            {/* <OrderDetailsPayment payment={order?.payment} /> */}
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
