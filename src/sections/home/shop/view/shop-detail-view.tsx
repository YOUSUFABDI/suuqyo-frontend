'use client';

import { Box, Container } from '@mui/material';
import React, { useEffect } from 'react';
import { ShopInfoDT } from '../types/types';
import { ShopDetail } from '../shop-detail';
import { ShopProduct } from '../shop-product';
import { CartIcon } from '../../components/cart-icon';
import { useCheckoutContext } from '../../checkout/context';
import { LoadingScreen } from 'src/components/loading-screen';
import { toast } from 'src/components/snackbar';

type Props = {
  shop: ShopInfoDT | null;
};

export const ShopDetailsView = ({ shop }: Props) => {
  const { state: checkoutState, onSetPaymentMethods } = useCheckoutContext();

  if (!shop) {
    return <LoadingScreen />;
  }

  const { shop: shopDetails, user, products } = shop;

  return (
    <Container sx={{ mb: 15 }}>
      <CartIcon totalItems={checkoutState?.items.length} />
      <Box
        sx={{
          display: 'flex',
          gap: 3,
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 30%' } }}>
          <ShopDetail shop={shopDetails} products={products} user={user} />
        </Box>

        {/* here */}
        <Box sx={{ flex: 1 }}>
          <ShopProduct products={products} shop={shopDetails} />
        </Box>
        {/* here */}
      </Box>
    </Container>
  );
};
