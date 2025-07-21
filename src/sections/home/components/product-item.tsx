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
// import { Product } from '../shop/types/types';

import { useCheckoutContext } from '../checkout/context';
import { Product } from '../product/types/types';
import { useEffect } from 'react';
import { paths } from 'src/routes/paths';
import { Typography } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
  product: Product;
  detailsHref: string;
};

export function ProductItem({ product, detailsHref }: Props) {
  const {
    state: checkoutState,
    onAddToCart,
    onSetPaymentMethods,
    onSetShopAddress,
  } = useCheckoutContext();
  const available = product.quantity > 0 ? true : false;

  // Extract unique colors from variants
  const uniqueColors = Array.from(
    new Set(product?.variants?.map((variant) => variant?.color?.name))
  );

  // console.log('shop info:----', product.shop);

  // const { id, name,  price, colors,  } =
  //   product;

  // const handleAddCart = async () => {
  //   const newProduct = {
  //     id: product.id,
  //     name: product.name,
  //     price: product.sellingPrice,
  //     coverUrl: product.images[0]?.image,
  //     quantity: 1,
  //     available: product.quantity,
  //   };
  //   try {
  //     // Set related checkout context data when adding to cart
  //     if (product?.user?.paymentMethods) {
  //       onSetPaymentMethods(product.user.paymentMethods);
  //     }

  //     if (product?.shop?.shopAddress) {
  //       onSetShopAddress(product.shop.shopAddress);
  //     }

  //     onAddToCart(newProduct);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const renderLabels = () =>
  //   (newLabel.enabled || saleLabel.enabled) && (
  //     <Box
  //       sx={{
  //         gap: 1,
  //         top: 16,
  //         zIndex: 9,
  //         right: 16,
  //         display: 'flex',
  //         position: 'absolute',
  //         alignItems: 'center',
  //       }}
  //     >
  //       {newLabel.enabled && (
  //         <Label variant="filled" color="info">
  //           {newLabel.content}
  //         </Label>
  //       )}
  //       {saleLabel.enabled && (
  //         <Label variant="filled" color="error">
  //           {saleLabel.content}
  //         </Label>
  //       )}
  //     </Box>
  //   );

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
      {/* {!!available && (
        <Fab
          size="medium"
          color="warning"
          onClick={handleAddCart}
          sx={[
            (theme) => ({
              right: 16,
              zIndex: 9,
              bottom: 16,
              opacity: 0,
              position: 'absolute',
              transform: 'scale(0)',
              transition: theme.transitions.create(['opacity', 'transform'], {
                easing: theme.transitions.easing.easeInOut,
                duration: theme.transitions.duration.shorter,
              }),
            }),
          ]}
        >
          <Iconify icon="solar:cart-plus-bold" width={24} />
        </Fab>
      )} */}

      {/* <Tooltip title={!available && 'Out of stock'} placement="bottom-end"> */}
      <Image
        alt="Img"
        src={product.images[0].image}
        ratio="1/1"
        // sx={{ borderRadius: 1.5, ...(!available && { opacity: 0.48, filter: 'grayscale(1)' }) }}
        sx={{ borderRadius: 1.5 }}
      />
      {/* </Tooltip> */}
    </Box>
  );

  const renderContent = () => (
    <Stack spacing={2.5} sx={{ p: 3, pt: 2 }}>
      <Link component={RouterLink} href={detailsHref} color="inherit" variant="subtitle2" noWrap>
        {product.name}
      </Link>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* <Tooltip title="Color">
          <ColorPreview colors={} />
        </Tooltip> */}
        {uniqueColors?.length > 0 && (
          <Tooltip title={`Available colors: ${uniqueColors?.join(', ')}`}>
            <ColorPreview colors={uniqueColors} />
          </Tooltip>
        )}
        <Box>{product?.shop?.shopName}</Box>

        {/* <Box sx={{ gap: 0.5, display: 'flex', typography: 'subtitle1' }}>
          {product.sellingPrice && (
            <Box component="span" sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>
              {fCurrency(product.sellingPrice)}
            </Box>
          )}

          <Box component="span">{fCurrency(product.sellingPrice)}</Box>
        </Box> */}
        <Box sx={{ gap: 0.5, display: 'flex', typography: 'subtitle1' }}>
          {/* Show original price with strikethrough if discount exists */}
          {product.discount && product.discount > 0 ? (
            <>
              <Box component="span" sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>
                {fCurrency(product.sellingPrice)}
              </Box>
              <Box component="span">
                {fCurrency(product.sellingPrice * (1 - product.discount / 100))}
              </Box>
            </>
          ) : (
            // Show regular price if no discount
            <Box component="span">{fCurrency(product.sellingPrice)}</Box>
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
