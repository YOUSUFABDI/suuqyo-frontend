'use client';

import { Avatar, Box, Card, Divider, Stack, Typography, Chip } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { ShopDT, ShopInfoDT } from './types/types';
import { LoadingScreen } from 'src/components/loading-screen';
import { Product, User } from '../product/types/types';

type Props = {
  // shop: ShopInfoDT | null;
  shop?: ShopDT | null;
  user?: User | null;
  products: Product[];
};

export const ShopDetail = ({ shop, products, user }: Props) => {
  return (
    <Card sx={{ borderRadius: 0.6, boxShadow: 2 }}>
      {/* Shop Logo and Name */}
      <Stack direction="row" spacing={2} alignItems="center" textAlign="left" sx={{ px: 2, py: 3 }}>
        {/* Shop Logo */}
        <Avatar src={shop?.shopLogo} alt={shop?.shopName} sx={{ width: 80, height: 80 }} />

        {/* Shop Name & Products */}
        <Box>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h6" fontWeight="bold">
              {shop?.shopName}
            </Typography>

            {/* Verified Badge */}
            {/* {shop.user.status && (
              <Chip
                label="Verified"
                color="success"
                size="small"
                icon={<Iconify icon="mdi:check-decagram" width={14} />}
                sx={{ fontWeight: 'medium', pl: 0.5 }}
              />
            )} */}
          </Stack>

          <Typography variant="body2" color="text.secondary">
            {products.length} products
          </Typography>
        </Box>
      </Stack>

      <Divider />

      {/* Shop Description */}
      <Box sx={{ px: 2, py: 3 }}>
        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
          About this shop
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {shop?.shopDescription}
        </Typography>
      </Box>

      <Divider />

      {/* Shop Info (Address & Contact) */}
      <Box sx={{ px: 2, py: 3 }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Address
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {shop?.shopAddress}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Phone
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.phoneNumber}
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Card>
  );
};
