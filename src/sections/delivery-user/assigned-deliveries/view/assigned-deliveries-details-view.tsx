'use client';

import { useCallback, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { ORDER_STATUS_OPTIONS } from '../types/types';

import { toast } from 'src/components/snackbar';
import { useUpdateOrderStatusMutation } from 'src/store/shop-owner/order';
import { getErrorMessage } from 'src/utils/error.message';
import { UseAnalytics } from '../../analytics/hooks';
import { AssignedDeliveryDetailCustomer } from '../assigned-delivery-detail-customer';
import { AssignedOrderDetailsItem } from '../assigned-order-details-item';
import { AssignedOrderDetailsShipping } from '../assigned-order-details-shipping';
import { AssignedOrderDetailsToolbar } from '../assigned-order-details-toolbar';
import { UseAssignedOrders } from '../hooks';
import { AssignedOrderDTRes } from '../types/types';
import { useUpdateAssignedOrderStatusMutation } from 'src/store/delivery-user/delivery-user';
// ----------------------------------------------------------------------

type Props = {
  order?: AssignedOrderDTRes;
};

export function AssignedDeliveryDetailsView({ order }: Props) {
  const [updateAssignedOrderStatus, { isLoading }] = useUpdateAssignedOrderStatusMutation();
  const { refetchAnalytics } = UseAnalytics();
  const { refetchAssignedOrders } = UseAssignedOrders();
  const [status, setStatus] = useState(order?.status);

  const handleChangeStatus = useCallback(
    async (newValue: string) => {
      if (!order?.id) return;

      // Save the previous status in case of an error
      const previousStatus = status;
      setStatus(newValue); // Optimistically update UI

      try {
        await updateAssignedOrderStatus({ id: Number(order.id), status: newValue }).unwrap();
        toast.success('Order status updated successfully');
        await refetchAnalytics();
        await refetchAssignedOrders();
      } catch (error) {
        setStatus(previousStatus); // Revert on error
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage);
      }
    },
    [order?.id, status, updateAssignedOrderStatus, refetchAnalytics]
  );

  return (
    <DashboardContent>
      <AssignedOrderDetailsToolbar
        status={status}
        createdAt={order?.createdAt}
        orderNumber={order?.id}
        backHref={paths.deliveryUser.assignedDeliveries.root}
        onChangeStatus={handleChangeStatus}
        statusOptions={ORDER_STATUS_OPTIONS}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Box
            sx={{ gap: 3, display: 'flex', flexDirection: { xs: 'column-reverse', md: 'column' } }}
          >
            <AssignedOrderDetailsItem items={order?.items} totalAmount={order?.total} />
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <AssignedDeliveryDetailCustomer customer={order?.customer} />

            <Divider sx={{ borderStyle: 'dashed' }} />
            <AssignedOrderDetailsShipping shippingAddress={order?.shippingAddress} />
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
