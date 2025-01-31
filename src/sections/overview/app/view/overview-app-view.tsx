'use client';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import { useTheme } from '@mui/material/styles';

import { SeoIllustration } from 'src/assets/illustrations';
import { DashboardContent } from 'src/layouts/dashboard';

import { useUser } from 'src/sections/auth/hooks';

import { AppWelcome } from '../app-welcome';

// ----------------------------------------------------------------------

export function OverviewAppView() {
  const { user, isLoading } = useUser();

  const theme = useTheme();

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <AppWelcome
            title={isLoading ? `...` : `Welcome back 👋 \n ${user?.fullName}`}
            description="If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything."
            img={<SeoIllustration hideBackground />}
            action={
              <Button variant="contained" color="primary">
                Go now
              </Button>
            }
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
