'use client';

import { useState } from 'react';
import { UseOrderHistory } from 'src/sections/home/account/hooks'; // Import the custom hook
import { fDateTime } from 'src/utils/format-time';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Timeline from '@mui/lab/Timeline';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineConnector from '@mui/lab/TimelineConnector';
import { IOrderHistory, OrderHistoryDT } from './types/types';
import { LoadingScreen } from 'src/components/loading-screen';
import { Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const MyOrderDetailsHistoryWithData = () => {
  const theme = useTheme(); // Access the current theme
  const { orderHistory, errorMessage, isLoading } = UseOrderHistory(); // Use the hook to fetch order history
  const [selectedOrder, setSelectedOrder] = useState<IOrderHistory | null>(null); // Order state

  // Ensure orderHistory is always an array (empty array as fallback)
  const mappedOrderHistory: IOrderHistory[] = (orderHistory || []).map((order: OrderHistoryDT) => ({
    id: String(order.id), // Convert the orderId (number) to string
    orderNumber: String(order.orderNumber), // Ensure orderNumber is a string
    createdAt: order.createdAt,
    orderTime: order.orderTime,
    paymentTime: order.paymentTime,
    deliveryTime: order.deliveryTime,
    completionTime: order.completionTime,
    timeline: order.timeline,
    status: order.status,
  }));

  const handleOrderClick = (order: IOrderHistory) => {
    setSelectedOrder(order); // Set the selected order when clicked
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (errorMessage) {
    return <Typography color="error">{errorMessage}</Typography>;
  }

  if (mappedOrderHistory.length === 0) {
    return <Typography>No orders found.</Typography>;
  }

  return (
    <Grid container sx={{ overflowX: 'hidden' }}>
      {/* Left Column: Order List */}
      <Grid item xs={12} md={4}>
        <Box sx={{ py: 2, borderRight: { xs: 'none', md: '1px solid #e0e0e0' }, width: '100%' }}>
          <Typography variant="h6">Orders</Typography>
          {mappedOrderHistory.map((order: IOrderHistory) => (
            <Paper
              key={order.id}
              sx={{
                p: 2,
                mb: 1,
                cursor: 'pointer',
                '&:hover': { backgroundColor: theme.palette.action.hover },
                width: '100%',
                backgroundColor:
                  selectedOrder?.id === order.id
                    ? theme.palette.primary.light // Active order background color
                    : 'transparent',
              }}
              onClick={() => handleOrderClick(order)} // Pass the entire order object
            >
              <Typography variant="body2">#Order-{order.orderNumber}</Typography>
              <Typography variant="caption" sx={{ color: 'text.primary' }}>
                {fDateTime(order.createdAt)}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Grid>

      {/* Right Column: Order Details */}
      <Grid item xs={12} md={8}>
        {selectedOrder ? (
          <MyOrderDetailsHistory history={selectedOrder} /> // Pass the selected order to display its timeline
        ) : (
          <Typography variant="h6" sx={{ textAlign: 'center', mt: 3 }}>
            Please select an order to view its history.
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

const MyOrderDetailsHistory = ({ history }: { history: IOrderHistory }) => {
  const renderTimeline = () => {
    if (!history?.timeline?.length) {
      return <Typography>No timeline data available for this order.</Typography>;
    }

    // Define all possible statuses
    const allStatuses = ['PENDING', 'PREPARING', 'DELIVERING', 'COMPLETED', 'CANCELED', 'REFUNDED'];

    return (
      <Timeline sx={{ p: 0, m: 0 }}>
        {allStatuses.map((status, index) => {
          // Find the timeline event matching the current status
          const statusItem = history.timeline.find(
            (item) => item.title.toLowerCase() === status.toLowerCase()
          );

          const isCurrentStatus = status === history.status; // Highlight the current status
          const statusTime = statusItem ? statusItem.time : new Date().toISOString(); // If the status exists in timeline, use its time

          return (
            <TimelineItem key={status}>
              <TimelineSeparator>
                {/* Highlight the current status with primary color */}
                <TimelineDot color={isCurrentStatus ? 'primary' : 'grey'} />
                {/* This correctly hides the connector for the last item */}
                {index === allStatuses.length - 1 ? null : <TimelineConnector />}
              </TimelineSeparator>

              <TimelineContent>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: isCurrentStatus ? 'bold' : 'normal',
                  }} // Make current status bold
                >
                  {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
                </Typography>
                <Box sx={{ color: 'text.disabled', typography: 'caption', mt: 0.5 }}>
                  {fDateTime(statusTime)}
                </Box>
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </Timeline>
    );
  };

  return (
    <Card sx={{ width: '100%' }}>
      <CardHeader title="Order History" />
      <Box
        sx={{
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          width: '100%',
        }}
      >
        {renderTimeline()}
      </Box>
    </Card>
  );
};

export default MyOrderDetailsHistoryWithData;
