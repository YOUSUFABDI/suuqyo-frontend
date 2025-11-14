import { useBoolean, usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import { Iconify } from 'src/components/iconify';

import { Avatar, Typography } from '@mui/material';
import { AllNotificationDT } from './types/types';

// ----------------------------------------------------------------------

type Props = {
  row: AllNotificationDT;
  editHref: string;
};

export function NotificationTableRow({ row, editHref }: Props) {
  const menuActions = usePopover();
  const confirmDialog = useBoolean();
  const quickEditForm = useBoolean();

  const role = localStorage.getItem('role');

  return (
    <>
      <TableRow hover tabIndex={-1}>
        <TableCell padding="checkbox">
          <Typography color="inherit">#{row.id}</Typography>
        </TableCell>

        <TableCell>
          <Box sx={{ gap: 1, display: 'flex', alignItems: 'center' }}>
            <Avatar src={row.user.profileImage} />
            <Typography color="inherit">{row.user.fullName}</Typography>
            <Typography color="inherit">{row.user.phoneNumber}</Typography>
          </Box>
        </TableCell>
        <TableCell>
          <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Typography color="inherit">{row.title}</Typography>
            </Stack>
          </Box>
        </TableCell>
        <TableCell>
          <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Typography color="inherit">{row.message}</Typography>
            </Stack>
          </Box>
        </TableCell>
        <TableCell>
          <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Typography color="inherit">{row.recipientType}</Typography>
            </Stack>
          </Box>
        </TableCell>

        {role === 'ADMIN' && (
          <TableCell>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                color={menuActions.open ? 'inherit' : 'default'}
                onClick={menuActions.onOpen}
              >
                <Iconify icon="eva:more-vertical-fill" />
              </IconButton>
            </Box>
          </TableCell>
        )}
      </TableRow>
    </>
  );
}
