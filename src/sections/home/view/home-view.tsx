'use client';

import type { Breakpoint } from '@mui/material/styles';

import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';

import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------

const lgKey: Breakpoint = 'lg';

export function HomeView() {
  const pageProgress = useScrollProgress();

  const theme = useTheme();

  return (
    <>
      {/* <ScrollProgress
        variant="linear"
        progress={pageProgress.scrollYProgress}
        sx={[(theme) => ({ position: 'fixed', zIndex: theme.zIndex.appBar + 1 })]}
      /> */}

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
          Suuqyo 👋
        </Box>
      </Box>
    </>
  );
}
