import type { CardProps } from '@mui/material/Card';
import type { TableHeadCellProps } from 'src/components/table';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';
import { getTopDeliveryUsersDT } from './types/types';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  headCells: TableHeadCellProps[];
  tableData: getTopDeliveryUsersDT[];
};

export function AnalyticsBestDeliveryUser({
  title,
  subheader,
  tableData,
  headCells,
  sx,
  ...other
}: Props) {
  return (
    <Card sx={sx} {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

      <Scrollbar sx={{ minHeight: 422 }}>
        <Table sx={{ minWidth: 640 }}>
          <TableHeadCustom headCells={headCells} />

          <TableBody>
            {tableData.map((row) => (
              <RowItem key={row.name} row={row} />
            ))}
          </TableBody>
        </Table>
      </Scrollbar>
    </Card>
  );
}

// ----------------------------------------------------------------------

type RowItemProps = {
  row: Props['tableData'][number];
};

function RowItem({ row }: RowItemProps) {
  return (
    <TableRow>
      <TableCell>
        <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
          <Avatar alt={row.name} src={row.profileImage} />
          {row.name}
        </Box>
      </TableCell>

      <TableCell>{row.phone}</TableCell>

      <TableCell>{row.country}</TableCell>

      <TableCell>{row.totalDeliveries} delivery</TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (row.rank === 1 && 'primary') ||
            (row.rank === 2 && 'secondary') ||
            (row.rank === 3 && 'info') ||
            (row.rank === 4 && 'warning') ||
            'error'
          }
        >
          Top {row.rank}
        </Label>
      </TableCell>
    </TableRow>
  );
}
