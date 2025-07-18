'use client';

import { usePopover } from 'minimal-shared/hooks';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import { RouterLink } from 'src/routes/components';

import { CustomPopover } from 'src/components/custom-popover';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';

import { ListItemText } from '@mui/material';
import { fDate, fTime } from 'src/utils/format-time';
import { SubscriptionResDT } from './types/subscription';
import {
  useRenewSubscriptionMutation,
  useSendReminderMutation,
} from 'src/store/admin/subscription';
import { getErrorMessage } from 'src/utils/error.message';
import { toast } from 'src/components/snackbar';
import { UseSubscriptionRenewals } from '../report/subscription-renewal/hooks';

// ----------------------------------------------------------------------

type Props = {
  row: SubscriptionResDT;
  selected: boolean;
  editHref: string;
  onSelectRow: () => void;
};

export function SubscriptionTableRow({ row, selected, editHref, onSelectRow }: Props) {
  const menuActions = usePopover();

  const [sendReminder, { isLoading }] = useSendReminderMutation();
  const [renewSubscription, { isLoading: renewIsLoading }] = useRenewSubscriptionMutation();
  const { refetch } = UseSubscriptionRenewals();

  const handleSendReminder = async () => {
    try {
      const response = await sendReminder({ shopOwnerId: Number(row.user.id) }).unwrap();

      if ('payload' in response) {
        const { message } = response.payload.data;

        // Display success message
        toast.success(message);
      }
    } catch (error: any) {
      console.error(error);
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      menuActions.onClose();
    }
  };

  const handleRenew = async () => {
    try {
      await renewSubscription({ shopOwnerId: Number(row.user.id) }).unwrap();
      toast.success('Renewed subscription.');
      refetch();
    } catch (error: any) {
      console.error(error);
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      menuActions.onClose();
    }
  };

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
        <li>
          <MenuItem component={RouterLink} href={editHref} onClick={() => menuActions.onClose()}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>
        </li>
        <li>
          <MenuItem onClick={handleSendReminder} disabled={isLoading}>
            <Iconify icon="solar:bell-bold" />
            Remind
          </MenuItem>
        </li>
        <li>
          <MenuItem onClick={handleRenew} disabled={renewIsLoading}>
            <Iconify icon="solar:close-bold" />
            Renew
          </MenuItem>
        </li>
      </MenuList>
    </CustomPopover>
  );

  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            onClick={onSelectRow}
            inputProps={{
              id: `${row.id}-checkbox`,
              'aria-label': `${row.id} checkbox`,
            }}
          />
        </TableCell>

        <TableCell>
          <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar alt={row.user.fullName} src={row.user.profileImage} />

            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Link
                component={RouterLink}
                href={editHref}
                color="inherit"
                sx={{ cursor: 'pointer' }}
              >
                {row.user.fullName}
              </Link>
              <Box component="span" sx={{ color: 'text.disabled' }}>
                {row.user.email}
              </Box>
            </Stack>
          </Box>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.user.phoneNumber}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.subscriptionTerm}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.subscriptionPlan}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>$ {row.subscriptionFee}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {row.discount ? `$${row.discount}` : 'N/A'}
        </TableCell>
        <TableCell>
          <ListItemText
            primary={fDate(row.startDate)}
            secondary={fTime(row.startDate)}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{ mt: 0.5, component: 'span', typography: 'caption' }}
          />
        </TableCell>
        <TableCell>
          <ListItemText
            primary={fDate(row.endDate)}
            secondary={fTime(row.endDate)}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{ mt: 0.5, component: 'span', typography: 'caption' }}
          />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}> {row.remainingTime} days</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (row.subscriptionStatus === 'PENDING' && 'warning') ||
              (row.subscriptionStatus === 'ACTIVE' && 'success') ||
              (row.subscriptionStatus === 'EXPIRED' && 'error') ||
              'default'
            }
          >
            {row.subscriptionStatus}
          </Label>
        </TableCell>

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
      </TableRow>

      {renderMenuActions()}
    </>
  );
}
