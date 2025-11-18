'use client';

import * as React from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

import { LoadingScreen } from 'src/components/loading-screen';
import { Iconify } from 'src/components/iconify';
import { UseOrderHistory } from 'src/sections/home/account/hooks/use-order-history';
import { fDateTime } from 'src/utils/format-time';
import { IOrderHistory, IOrderItem } from 'src/sections/home/account/types/types';

// ---------------------------------------------------------
// Helpers
// ---------------------------------------------------------

function formatMoney(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '-';
  const num = typeof value === 'string' ? Number(value) : value;
  if (Number.isNaN(num)) return '-';
  return `$${num.toFixed(2)}`;
}

function getStatusChipColor(status: IOrderHistory['status']) {
  switch (status) {
    case 'COMPLETED':
      return 'success';
    case 'DELIVERING':
      return 'info';
    case 'PREPARING':
      return 'warning';
    case 'CANCELED':
    case 'REFUNDED':
      return 'error';
    case 'PENDING':
    default:
      return 'default';
  }
}

function StatusChip({ status }: { status: IOrderHistory['status'] }) {
  return (
    <Chip
      label={status}
      size="small"
      color={getStatusChipColor(status)}
      variant="outlined"
      sx={{ fontWeight: 600, fontSize: 11, height: 24, textTransform: 'capitalize' }}
    />
  );
}

function getProductImage(item: IOrderItem | undefined): string {
  if (!item) return '';
  if (item.product.images && item.product.images.length > 0) {
    return item.product.images[0].image;
  }
  if (item.product.image) return item.product.image;
  return '';
}

// ---------------------------------------------------------
// Main Page
// ---------------------------------------------------------

export default function OrderHistoryPage() {
  const theme = useTheme();
  const { orderHistory, errorMessage, isLoading } = UseOrderHistory();
  const [selectedOrder, setSelectedOrder] = React.useState<IOrderHistory | null>(null);
  const [open, setOpen] = React.useState(false);

  const handleOpen = (order: IOrderHistory) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedOrder(null);
  };

  if (isLoading) return <LoadingScreen />;

  if (errorMessage) {
    return (
      <Box sx={{ p: 5, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          {errorMessage}
        </Typography>
      </Box>
    );
  }

  if (!orderHistory || orderHistory.length === 0) {
    return (
      <Box sx={{ p: 5, textAlign: 'center' }}>
        <Iconify
          icon="eva:shopping-bag-outline"
          width={64}
          sx={{ mb: 2, color: 'text.disabled' }}
        />
        <Typography variant="h5">No orders yet</Typography>
        <Typography variant="body2" color="text.secondary">
          Once you place an order, your order history will appear here.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Card
        sx={{
          p: 2.5,
          boxShadow: (theme as any).customShadows?.z8 ?? 3,
          borderRadius: 2.5,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              My Orders
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {orderHistory.length} order{orderHistory.length > 1 ? 's' : ''} in your history
            </Typography>
          </Box>
        </Stack>

        <TableContainer sx={{ maxHeight: 520 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>Order</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Items</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderHistory.map((order) => {
                const firstItem: IOrderItem | undefined = order.items[0];
                const firstImage = getProductImage(firstItem);
                const itemsCount = order.items.reduce(
                  (acc, item) => acc + Number(item.quantity || 0),
                  0
                );

                return (
                  <TableRow
                    key={order.id}
                    hover
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.02),
                      },
                    }}
                    onClick={() => handleOpen(order)}
                  >
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Avatar
                          variant="rounded"
                          src={firstImage}
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: theme.palette.background.default,
                            border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
                          }}
                        >
                          <Iconify icon="eva:cube-outline" width={18} />
                        </Avatar>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          #{order.orderNumber}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{fDateTime(order.createdAt)}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">{itemsCount}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatMoney(order.total)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <StatusChip status={order.status} />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpen(order);
                        }}
                      >
                        View details
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* -------------------------------------------------
         Order Details Modal (Blur Background)
      -------------------------------------------------- */}
      <Dialog
        open={open && !!selectedOrder}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        BackdropProps={{
          sx: {
            backdropFilter: 'blur(6px)',
            backgroundColor: (theme) => alpha(theme.palette.grey[900], 0.45),
          },
        }}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2,
            backdropFilter: 'blur(16px)',
            backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.9),
          },
        }}
      >
        {selectedOrder && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="overline" color="text.secondary">
                    Order details
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    #{selectedOrder.orderNumber}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Placed on {fDateTime(selectedOrder.createdAt)}
                  </Typography>
                </Box>

                <Stack direction="row" alignItems="center" spacing={1}>
                  <StatusChip status={selectedOrder.status} />
                  <IconButton onClick={handleClose} size="small">
                    <Iconify icon="eva:close-fill" width={18} />
                  </IconButton>
                </Stack>
              </Stack>
            </DialogTitle>

            <DialogContent dividers sx={{ pt: 2 }}>
              <Stack spacing={3}>
                {/* Items */}
                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
                    Items (
                    {selectedOrder.items.reduce((acc, i) => acc + Number(i.quantity || 0), 0)})
                  </Typography>

                  <Stack spacing={1.5}>
                    {selectedOrder.items.map((item: IOrderItem, index: number) => {
                      const lineTotal = Number(item.price ?? 0) * Number(item.quantity ?? 0);

                      return (
                        <Stack
                          key={`${item.product.id}-${index}`}
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          sx={{
                            p: 1.5,
                            borderRadius: 1.5,
                            border: `1px solid ${alpha(theme.palette.divider, 1)}`,
                            bgcolor: alpha(theme.palette.background.default, 0.6),
                          }}
                        >
                          <Stack direction="row" alignItems="center" spacing={1.5}>
                            <Avatar
                              variant="rounded"
                              src={getProductImage(item)}
                              sx={{
                                width: 48,
                                height: 48,
                                bgcolor: theme.palette.background.default,
                              }}
                            >
                              <Iconify icon="eva:cube-outline" width={22} />
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2">{item.product.name}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                Qty: {item.quantity}
                              </Typography>
                            </Box>
                          </Stack>

                          <Box textAlign="right">
                            <Typography variant="body2">{formatMoney(item.price)}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Line total: {formatMoney(lineTotal)}
                            </Typography>
                          </Box>
                        </Stack>
                      );
                    })}
                  </Stack>
                </Box>

                {/* Shipping & Payment Info */}
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2.5} sx={{ mt: 1 }}>
                  {/* Shipping */}
                  <Box
                    sx={{
                      flex: 1,
                      p: 2,
                      borderRadius: 2,
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
                      Shipping
                    </Typography>
                    {selectedOrder.shippingAddress ? (
                      <Stack spacing={0.75}>
                        <Typography variant="body2" fontWeight={600}>
                          {selectedOrder.shippingAddress.fullName}
                        </Typography>
                        <Typography variant="body2">
                          {selectedOrder.shippingAddress.address &&
                            `${selectedOrder.shippingAddress.address}, `}
                          {selectedOrder.shippingAddress.city},{' '}
                          {selectedOrder.shippingAddress.state},{' '}
                          {selectedOrder.shippingAddress.country}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Phone: {selectedOrder.shippingAddress.phoneNumber}
                        </Typography>
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No shipping address on file.
                      </Typography>
                    )}
                  </Box>

                  {/* Payment */}
                  <Box
                    sx={{
                      flex: 1,
                      p: 2,
                      borderRadius: 2,
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
                      Payment
                    </Typography>

                    <Stack spacing={0.75} sx={{ mb: 1.5 }}>
                      <Row label="Subtotal" value={formatMoney(selectedOrder.subtotal)} />
                      <Row label="Shipping" value={formatMoney(selectedOrder.shippingFee)} />
                    </Stack>

                    <Box
                      sx={{
                        mt: 0.5,
                        pt: 1,
                        borderTop: `1px dashed ${theme.palette.divider}`,
                      }}
                    >
                      <Row label="Total" value={formatMoney(selectedOrder.total)} strong />
                    </Box>

                    {/* <Box
                      sx={{
                        mt: 1.5,
                        p: 1,
                        borderRadius: 1.5,
                        bgcolor: alpha(theme.palette.primary.main, 0.06),
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Payment method
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {selectedOrder.paymentMethod || 'N/A'}{' '}
                        {selectedOrder.paymentAccount || 'N/A'}
                      </Typography>
                    </Box> */}
                  </Box>
                </Stack>
              </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button onClick={handleClose}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
}

// ---------------------------------------------------------
// Small helper for label/value rows
// ---------------------------------------------------------

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant={strong ? 'subtitle1' : 'body2'} sx={{ fontWeight: strong ? 600 : 400 }}>
        {value}
      </Typography>
    </Stack>
  );
}
