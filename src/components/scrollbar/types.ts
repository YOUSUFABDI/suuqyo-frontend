import type { Theme, SxProps } from '@mui/material/styles';
import type SimpleBar from 'simplebar-react';

// ----------------------------------------------------------------------

export type SimplebarProps = React.ComponentProps<typeof import('simplebar-react').default> & {
  sx?: SxProps<Theme>;
  children?: React.ReactNode;
  fillContent?: boolean;
  slotProps?: {
    wrapperSx?: SxProps<Theme>;
    contentSx?: SxProps<Theme>;
    contentWrapperSx?: SxProps<Theme>;
  };
};
