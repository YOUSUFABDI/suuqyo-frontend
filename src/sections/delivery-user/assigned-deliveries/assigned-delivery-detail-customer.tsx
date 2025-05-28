import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { UserBasicInfo } from './types/types';

// ----------------------------------------------------------------------

type Props = {
  customer?: UserBasicInfo;
};

export function AssignedDeliveryDetailCustomer({ customer }: Props) {
  return (
    <>
      <CardHeader title="Customer info" />
      <Box sx={{ p: 3, display: 'flex' }}>
        <Avatar
          alt={customer?.username}
          src={customer?.profileImage}
          sx={{ width: 48, height: 48, mr: 2 }}
        />

        <Stack spacing={0.5} sx={{ typography: 'body2', alignItems: 'flex-start' }}>
          <Typography variant="subtitle2">{customer?.username}</Typography>

          <Box sx={{ color: 'text.secondary' }}>{customer?.email}</Box>

          <Box>
            {/* Phone: */}
            <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
              {customer?.phoneNumber}
            </Box>
          </Box>
        </Stack>
      </Box>
    </>
  );
}
