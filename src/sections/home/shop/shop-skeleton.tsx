
import type { BoxProps } from '@mui/material/Box';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

// ----------------------------------------------------------------------

type ShopListSkeletonProps = BoxProps & {
  itemCount?: number;
};

export function ShopListSkeleton({
  itemCount = 8,
  sx,
  ...other
}: ShopListSkeletonProps) {
  return (
    <>
      {Array.from({ length: itemCount }).map((_, idx) => (
        <Box key={idx} sx={{ minWidth: 0 }} {...other}>
          <Box
            sx={[
              {
                p: 2,
                boxShadow: 2,
                borderRadius: 0.6,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                bgcolor: 'background.paper',
                width: '100%',
              },
              ...(Array.isArray(sx) ? sx : [sx]),
            ]}
          >
            {/* Logo circle */}
            <Box
              sx={{
                bgcolor: 'background.neutral',
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
              <Skeleton variant="circular" width={72} height={72} />
            </Box>

            {/* Right content */}
            <Box
              sx={{
                flexGrow: 1,
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 0.75,
              }}
            >
              {/* Shop name */}
              <Skeleton
                variant="text"
                height={24}
                sx={{ maxWidth: { xs: '70%', sm: '60%' } }}
              />

              {/* Address row (icon + text) */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Skeleton variant="circular" width={18} height={18} />
                <Skeleton
                  variant="text"
                  height={18}
                  sx={{ flexGrow: 1, maxWidth: '80%' }}
                />
              </Box>

              {/* Verified chip placeholder */}
              <Skeleton
                variant="rounded"
                width={80}
                height={22}
                sx={{ borderRadius: 999, mt: 0.25 }}
              />
            </Box>
          </Box>
        </Box>
      ))}
    </>
  );
}

export default ShopListSkeleton;
