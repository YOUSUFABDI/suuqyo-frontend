import { Box, Container } from '@mui/material';
import React from 'react';
import { ShopInfoDT } from '../types/types';
import { ShopDetail } from '../shop-detail';
import { ShopProduct } from '../shop-product';

type Props = {
  shop: ShopInfoDT | null;
};

export const ShopDetailsView = ({ shop }: Props) => {
  return (
    <Container sx={{ mb: 15 }}>
      <Box
        sx={{
          display: 'flex',
          gap: 3,
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 30%' } }}>
          <ShopDetail shop={shop} />
        </Box>

        <Box sx={{ flex: 1 }}>
          <ShopProduct shop={shop} />
        </Box>
      </Box>
    </Container>
  );
};
