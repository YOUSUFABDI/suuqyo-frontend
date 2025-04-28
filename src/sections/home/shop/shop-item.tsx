import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { Iconify } from 'src/components/iconify';
import { Image } from 'src/components/image';
import { RouterLink } from 'src/routes/components';
import { ShopDT } from './types/types';
// ----------------------------------------------------------------------

type Props = {
  shop: ShopDT;
  detailsHref: string;
};

export function ShopItem({ shop, detailsHref }: Props) {
  return (
    <Link
      component={RouterLink}
      href={detailsHref}
      sx={{
        p: 2,
        boxShadow: 0,
        border: (theme) => `1px solid ${theme.palette.divider}`,
        borderRadius: 0.6,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        backgroundColor: 'background.paper',
      }}
    >
      {/* Shop Logo */}
      <Box
        sx={{
          backgroundColor: 'background.neutral',
          width: 72,
          height: 72,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          boxShadow: 1,
          flexShrink: 0,
        }}
      >
        <Image
          alt={shop.shopName}
          src={shop.shopLogo}
          ratio="1/1"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </Box>

      {/* Shop Info */}
      <Box
        sx={{
          flexGrow: 1,
          minWidth: 0,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 0.5,
        }}
      >
        {/* Shop Name */}
        <Typography
          variant="subtitle1"
          color="text.primary"
          noWrap
          sx={{ fontWeight: 'bold', textOverflow: 'ellipsis' }}
        >
          {shop.shopName}
        </Typography>

        {/* Shop Address with Icon */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            overflow: 'hidden',
          }}
        >
          <Iconify
            icon="mdi:map-marker"
            width={18}
            sx={{ color: 'text.secondary', flexShrink: 0 }}
          />

          <Typography
            variant="body2"
            color="text.secondary"
            noWrap
            sx={{ textOverflow: 'ellipsis' }}
          >
            {shop.shopAddress}
          </Typography>
        </Box>
      </Box>
    </Link>
  );
}
