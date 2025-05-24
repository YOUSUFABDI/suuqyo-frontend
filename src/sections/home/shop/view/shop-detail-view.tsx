'use client';

import { Box, Container } from '@mui/material';
import React, { useEffect } from 'react';
import { ShopInfoDT } from '../types/types';
import { ShopDetail } from '../shop-detail';
import { ShopProduct } from '../shop-product';
import { CartIcon } from '../../components/cart-icon';
import { useCheckoutContext } from '../../checkout/context';
import { LoadingScreen } from 'src/components/loading-screen';

type Props = {
  shop: ShopInfoDT | null;
};

export const ShopDetailsView = ({ shop }: Props) => {
  // console.log('shop', shop);
  // console.log('PaymentMethodOfShop:--', shop?.user.PaymentMethodOfShop);
  const { state: checkoutState, onSetPaymentMethods } = useCheckoutContext();

  // useEffect(() => {
  //   if (shop?.data.) {
  //     onSetPaymentMethods(shop.user.PaymentMethodOfShop); // save into checkout context
  //   }
  // }, [shop, onSetPaymentMethods]);

  const products = shop;
  console.log('productsproducts', products);

  if (!shop) {
    // return null;
    return <LoadingScreen />;
  }

  return (
    <Container sx={{ mb: 15 }}>
      <CartIcon totalItems={checkoutState.totalItems} />
      <Box
        sx={{
          display: 'flex',
          gap: 3,
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 30%' } }}>
          {/* <ShopDetail shop={shop} /> */}
          <ShopDetail
            shop={products && products[0]?.shop}
            products={products || []}
            user={products && products[0]?.user}
          />
        </Box>

        <Box sx={{ flex: 1 }}>
          <ShopProduct products={products || []} />
        </Box>
      </Box>
    </Container>
  );
};
