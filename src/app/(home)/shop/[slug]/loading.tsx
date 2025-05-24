'use client';

import Container from '@mui/material/Container';
import { LoadingScreen } from 'src/components/loading-screen';

import { ProductDetailsSkeleton } from 'src/sections/home/shop/shop-skeleton';

// ----------------------------------------------------------------------

export default function Loading() {
  return (
    <Container sx={{ mt: 5, mb: 10 }}>
      <LoadingScreen />;
    </Container>
  );
}
