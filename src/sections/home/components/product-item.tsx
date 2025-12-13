'use client';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Fab, { fabClasses } from '@mui/material/Fab';

import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';
import { ColorPreview } from 'src/components/color-utils';

import { useCheckoutContext } from '../checkout/context';
import { Product } from '../product/types/types';
import { paths } from 'src/routes/paths';
import { Typography } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
  product: Product;
  detailsHref: string;
};

export function ProductItem({ product, detailsHref }: Props) {
  // console.log('product', product);
  const {
    state: checkoutState,
    onAddToCart,
    onSetPaymentMethods,
    onSetShopAddress,
  } = useCheckoutContext();
  const available = product.quantity > 0 ? true : false;

  // Extract unique colors from variants
  const uniqueColors = product?.variants
    ? Array.from(new Set(product.variants.map((variant) => variant?.color?.name).filter(Boolean)))
    : [];

  const renderLabels = () => {
    const labels = [];

    // Add discount label if discount exists
    if (product.discount && product.discount > 0) {
      labels.push(
        <Label key="discount" variant="filled" color="error">
          {`-${product.discount}%`}
        </Label>
      );
    }

    return labels.length > 0 ? (
      <Box
        sx={{
          gap: 1,
          top: 16,
          zIndex: 9,
          right: 16,
          display: 'flex',
          position: 'absolute',
          alignItems: 'center',
        }}
      >
        {labels}
      </Box>
    ) : null;
  };

  const renderImage = () => (
    <Box sx={{ position: 'relative', p: 1 }}>
      <Image
        alt={product.name}
        src={
          product?.images && product.images.length > 0
            ? product.images[0].image
            : '/placeholder.jpg'
        }
        ratio="1/1"
        sx={{ borderRadius: 1.5 }}
      />
    </Box>
  );

  const renderContent = () => (
    <Stack spacing={2.5} sx={{ p: 3, pt: 2 }}>
      <Link component={RouterLink} href={detailsHref} color="inherit" variant="subtitle2" noWrap>
        {product.name}
      </Link>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {uniqueColors?.length > 0 && (
          <Tooltip title={`Available colors: ${uniqueColors?.join(', ')}`}>
            <ColorPreview colors={uniqueColors} />
          </Tooltip>
        )}
        <Box>{product?.shop?.shopName || 'Unknown Shop'}</Box>

        <Box sx={{ gap: 0.5, display: 'flex', typography: 'subtitle1' }}>
          {/* Show original price with strikethrough if discount exists */}
          {product.discount && product.discount > 0 ? (
            <>
              <Box component="span" sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>
                ${product.sellingPrice}
              </Box>
              <Box component="span">
                ${(product.sellingPrice * (1 - product.discount / 100)).toFixed(2)}
              </Box>
            </>
          ) : (
            // Show regular price if no discount
            <Box component="span">${product.sellingPrice}</Box>
          )}
        </Box>
      </Box>
    </Stack>
  );

  return (
    <Card
      component={RouterLink}
      href={detailsHref}
      sx={{
        '&:hover': {
          [`& .${fabClasses.root}`]: { opacity: 1, transform: 'scale(1)' },
        },
        textDecoration: 'none',
        cursor: 'pointer',
      }}
    >
      {renderLabels()}
      {renderImage()}
      {renderContent()}
    </Card>
  );
}
