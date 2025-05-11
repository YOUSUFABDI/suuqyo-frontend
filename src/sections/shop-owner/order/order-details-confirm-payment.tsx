import Box from '@mui/material/Box';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';

// ----------------------------------------------------------------------

type Props = {
  paymentMethod: string | undefined;
  senderPhone: string | undefined;
};

export function OrderDetailsConfirmPayment({ paymentMethod, senderPhone }: Props) {
  return (
    <>
      <CardHeader title="Confirm payment" />
      <Box>
        <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
          <Box sx={{ display: 'flex' }}>
            <Box component="span" sx={{ color: 'text.secondary', width: 170, flexShrink: 0 }}>
              Reciver payment method
            </Box>

            {paymentMethod}
          </Box>

          <Box sx={{ display: 'flex' }}>
            <Box component="span" sx={{ color: 'text.secondary', width: 170, flexShrink: 0 }}>
              Reciver Phone
            </Box>

            {senderPhone}
          </Box>
        </Stack>
      </Box>
    </>
  );
}
