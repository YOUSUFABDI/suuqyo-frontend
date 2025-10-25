import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { Label } from 'src/components/label';
import { fDate, fTime } from 'src/utils/format-time';
import { SubscriptionRenewalResDT } from './types/subscription-renewal';

type Props = {
  row: SubscriptionRenewalResDT;
  selected: boolean;
  editHref: string;
  detailsHref: string;
  onSelectRow: () => void;
  onDeleteRow: () => void;
};

export function SubscriptionRenewalTableRow({ row, selected, onSelectRow }: Props) {
  return (
    <TableRow hover selected={selected}>
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
          <ListItemText
            disableTypography
            primary={
              <Typography variant="body2" noWrap>
                {row.user.fullName}
              </Typography>
            }
            secondary={
              <Typography variant="body2" noWrap>
                {row.user.email}
              </Typography>
            }
          />
        </Box>
      </TableCell>

      <TableCell>{row.user.phoneNumber}</TableCell>
      <TableCell>{row.transactionType}</TableCell>
      <TableCell>{row.subscription.subscriptionTerm}</TableCell>
      <TableCell>{row.amount}</TableCell>

      <TableCell>
        <ListItemText
          primary={fDate(row.subscription.startDate)}
          secondary={fTime(row.subscription.startDate)}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{ mt: 0.5, component: 'span', typography: 'caption' }}
        />
      </TableCell>

      <TableCell>
        <ListItemText
          primary={fDate(row.subscription.endDate)}
          secondary={fTime(row.subscription.endDate)}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{ mt: 0.5, component: 'span', typography: 'caption' }}
        />
      </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (row.subscription.subscriptionStatus === 'PENDING' && 'warning') ||
            (row.subscription.subscriptionStatus === 'ACTIVE' && 'success') ||
            (row.subscription.subscriptionStatus === 'EXPIRED' && 'error') ||
            'default'
          }
        >
          {row.subscription.subscriptionStatus}
        </Label>
      </TableCell>
    </TableRow>
  );
}
