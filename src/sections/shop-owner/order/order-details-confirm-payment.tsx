import Box from '@mui/material/Box';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';

// ----------------------------------------------------------------------

type Props = {
  paymentMethod: string | undefined;
  paymentAccount: string | undefined;
  senderPhone: string | undefined;
};

export function OrderDetailsConfirmPayment({ paymentMethod, paymentAccount, senderPhone }: Props) {
  return (
    <>
      <CardHeader title="Payment Confirmation Details" />
      <Box>
        <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
          <Box fontWeight="fontWeightBold">Receiver Details</Box>

          <Box sx={{ display: 'flex' }}>
            <Box component="span" sx={{ color: 'text.secondary', width: 170, flexShrink: 0 }}>
              Payment Method:
            </Box>
            {paymentMethod ?? 'N/A'}
          </Box>

          <Box sx={{ display: 'flex' }}>
            <Box component="span" sx={{ color: 'text.secondary', width: 170, flexShrink: 0 }}>
              Account Number:
            </Box>
            {paymentAccount ?? 'N/A'}
          </Box>
        </Stack>

        <Stack spacing={1.5} sx={{ p: 3, pt: 0, typography: 'body2' }}>
          <Box fontWeight="fontWeightBold">Sender Details</Box>

          <Box sx={{ display: 'flex' }}>
            <Box component="span" sx={{ color: 'text.secondary', width: 170, flexShrink: 0 }}>
              Payment Method Used:
            </Box>
            {paymentMethod ?? 'N/A'}
          </Box>

          <Box sx={{ display: 'flex' }}>
            <Box component="span" sx={{ color: 'text.secondary', width: 170, flexShrink: 0 }}>
              Account Number:
            </Box>
            {paymentAccount ?? 'N/A'}
          </Box>

          <Box sx={{ display: 'flex' }}>
            <Box component="span" sx={{ color: 'text.secondary', width: 170, flexShrink: 0 }}>
              Sender Source Account:
            </Box>
            {senderPhone ?? 'N/A'}
          </Box>
        </Stack>
      </Box>
    </>
  );
}
