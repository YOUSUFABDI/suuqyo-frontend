'use client';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

import {} from 'src/utils/format-number';
import { Scrollbar } from 'src/components/scrollbar';
import { OrdersDT } from './types/types';

// ----------------------------------------------------------------------

type Props = {
  order: OrdersDT; // Takes a single order object
};

export function OrderStatusDetailsItems({ order }: Props) {
  // Calculate specific totals based on the order data
  const shipping = order.shippingFee; // Or order.shippingFee if available in API
  const totalAmount = Number(order.total);
  const subtotal = totalAmount - shipping;

  const renderTotal = () => (
    <Box
      sx={{
        p: 3,
        gap: 2,
        display: 'flex',
        textAlign: 'right',
        typography: 'body2',
        alignItems: 'flex-end',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ color: 'text.secondary' }}>Subtotal</Box>
        <Box sx={{ width: 160, typography: 'subtitle2' }}>${subtotal}</Box>
      </Box>

      <Box sx={{ display: 'flex' }}>
        <Box sx={{ color: 'text.secondary' }}>Shipping</Box>
        <Box sx={{ width: 160 }}>${shipping ? shipping : '-'}</Box>
      </Box>

      <Box sx={{ display: 'flex', typography: 'subtitle1' }}>
        <Box>Total</Box>
        <Box sx={{ width: 160 }}>${totalAmount}</Box>
      </Box>
    </Box>
  );

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title={`Order #${order.orderId}`}
        subheader={order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}
        action={
          <Box sx={{ typography: 'subtitle2', color: 'primary.main', px: 2 }}>{order.status}</Box>
        }
      />
      <Divider />

      <Scrollbar>
        {order.items.map((item) => (
          <Box
            key={item.itemId}
            sx={[
              (theme) => ({
                p: 3,
                minWidth: 640,
                display: 'flex',
                alignItems: 'center',
                borderBottom: `dashed 2px ${theme.vars.palette.background.neutral}`,
              }),
            ]}
          >
            <Avatar
              src={item.productImage || ''}
              variant="rounded"
              sx={{ width: 48, height: 48, mr: 2 }}
            />

            <ListItemText
              primary={item.productName}
              secondary={`ID: ${item.itemId}`}
              primaryTypographyProps={{ typography: 'body2' }}
              secondaryTypographyProps={{ component: 'span', color: 'text.disabled', mt: 0.5 }}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, mr: 2 }}>
              {item.selectedColor && (
                <Box sx={{ typography: 'caption', color: 'text.secondary' }}>
                  Color: {item.selectedColor}
                </Box>
              )}
              {item.selectedSize && (
                <Box sx={{ typography: 'caption', color: 'text.secondary' }}>
                  Size: {item.selectedSize}
                </Box>
              )}
              <Box sx={{ typography: 'body2' }}>x{item.quantity}</Box>
            </Box>

            <Box sx={{ width: 110, textAlign: 'right', typography: 'subtitle2' }}>
              ${item.price}
            </Box>
          </Box>
        ))}
      </Scrollbar>

      {renderTotal()}
    </Card>
  );
}
