'use client';

import { useState, useEffect } from 'react';
import { useShopsQuery } from 'src/store/customer/shop';
import { isSuccessResponse } from 'src/utils/is-success-res';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { useTranslate } from 'src/locales';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import { ShopFeaturedList } from '../shop-featured-list';
import { ShopInfoDT } from '../types/types';
import { useShuffledShops } from '../hooks';

// ----------------------------------------------------------------------

export function ShopFeaturedView() {
  const { t } = useTranslate();
  const router = useRouter();
  const {shops, isLoading, isFetching} = useShuffledShops()


  const handleSeeAll = () => {
    router.push(paths.customer.shop.root);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      <Stack 
        direction="row" 
        alignItems="center" 
        justifyContent="space-between" 
        sx={{ mb: 4 }}
      >
        <Typography variant="h4">
          {t('home.featured_shops')}
        </Typography>
      </Stack>

      <ShopFeaturedList 
        shops={shops} 
        loading={isLoading || isFetching}
      />

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
       <Button 
          variant="contained" 
          color="inherit"
          onClick={handleSeeAll}
        >
          {t('home.see_all')}
        </Button>
      </Box>
    </Container>
  );
}