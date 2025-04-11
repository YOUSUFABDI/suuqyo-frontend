import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItemText from '@mui/material/ListItemText';

import { fCurrency } from 'src/utils/format-number';

import { Scrollbar } from 'src/components/scrollbar';
import { OrderItem } from './types/types';

// ----------------------------------------------------------------------

type Props = {
  taxes?: number;
  shipping?: number;
  discount?: number;
  subtotal?: number;
  totalAmount?: number;
  items?: OrderItem[];
};

export function AssignedOrderDetailsItem({
  taxes,
  shipping,
  discount,
  subtotal,
  items = [],
  totalAmount,
}: Props) {
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
      {/* <Box sx={{ display: 'flex', typography: 'subtitle1' }}>
        <div>Total</div>
        <Box sx={{ width: 160 }}>{fCurrency(totalAmount) || '-'}</Box>
      </Box> */}
    </Box>
  );

  return (
    <Card>
      <CardHeader title="Details" />

      <Scrollbar>
        {items.map((item) => (
          <Box
            key={item.id}
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
              src={item?.product?.images[0].image}
              variant="rounded"
              sx={{ width: 48, height: 48, mr: 2 }}
            />

            <ListItemText
              primary={item.product.name}
              secondary={item.id}
              primaryTypographyProps={{ typography: 'body2' }}
              secondaryTypographyProps={{ component: 'span', color: 'text.disabled', mt: 0.5 }}
            />

            <Box sx={{ typography: 'body2' }}>x{item.quantity}</Box>

            {/* <Box sx={{ width: 110, textAlign: 'right', typography: 'subtitle2' }}>
              {fCurrency(item.price)}
            </Box> */}
          </Box>
        ))}
      </Scrollbar>

      {renderTotal()}
    </Card>
  );
}
