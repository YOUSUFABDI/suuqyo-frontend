'use client';

import type { Breakpoint } from '@mui/material/styles';

import { useScrollProgress } from 'src/components/animate/scroll-progress';

import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useUser } from 'src/sections/auth/hooks';

// ----------------------------------------------------------------------

const lgKey: Breakpoint = 'lg';

export function CustomerView() {
  const pageProgress = useScrollProgress();

  const { user, isLoading } = useUser();

  const theme = useTheme();

  return (
    <>
      <Box
        sx={[
          {
            my: 0,
            mx: 'auto',
            maxWidth: 680,
            display: 'flex',
            flexWrap: 'wrap',
            typography: 'h2',
            justifyContent: 'center',
            fontFamily: theme.typography.fontSecondaryFamily,
            [theme.breakpoints.up(lgKey)]: {
              fontSize: theme.typography.pxToRem(72),
              lineHeight: '90px',
            },
          },
        ]}
      >
        <Box component="span" sx={{ width: 1, opacity: 0.4 }}>
          Hi 👋, Welcome {isLoading ? '...' : user?.fullName}
        </Box>
      </Box>
    </>
  );
}
