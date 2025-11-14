'use client';

import type { TableHeadCellProps } from 'src/components/table';
import type { AllNotificationDT, INotificationTableFilters } from '../types/types';

import { useBoolean, useSetState } from 'minimal-shared/hooks';
import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import {
  emptyRows,
  getComparator,
  rowInPage,
  TableEmptyRows,
  TableNoData,
  TablePaginationCustom,
  useTable,
} from 'src/components/table';

import { NotificationQuickCreateForm } from '../notification-quick-create-form';
import { NotificationTableFiltersResult } from '../notification-table-filters-result';
import { NotificationTableToolbar } from '../notification-table-toolbar';
import { useAllNotifications } from '../hooks';
import { NotificationTableRow } from '../notification-table-row';

// ----------------------------------------------------------------------

const TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'title', label: 'Title' },
  { id: 'message', label: 'Message' },
  { id: 'recipientType', label: 'Recipient type' },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function NotificationListView() {
  const role = localStorage.getItem('role');
  const { allNotifications } = useAllNotifications();
  // console.log('allNotifications', allNotifications);
  const table = useTable();

  const confirmDialog = useBoolean();
  const quickCreateForm = useBoolean();

  const [tableData, setTableData] = useState<AllNotificationDT[]>(allNotifications);

  const filters = useSetState<INotificationTableFilters>({
    name: '',
    role: [],
    status: 'All',
    phoneNumber: '',
  });
  const { state: currentFilters, setState: updateFilters } = filters;

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!currentFilters.name || currentFilters.role.length > 0 || currentFilters.status !== 'All';

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const renderQuickCreateForm = () => (
    <NotificationQuickCreateForm open={quickCreateForm.value} onClose={quickCreateForm.onFalse} />
  );

  useEffect(() => {
    if (JSON.stringify(allNotifications) !== JSON.stringify(tableData)) {
      setTableData(allNotifications);
    }
  }, [allNotifications, tableData]);

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Notification list "
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'Notification',
              href: paths.dashboard.notification.root,
            },
            { name: 'List' },
          ]}
          action={
            <Button
              onClick={quickCreateForm.onTrue}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Send New Notification
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <NotificationTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            options={{ status: ['All', 'SHOP_OWNER', 'CUSTOMER'] }}
          />

          {canReset && (
            <NotificationTableFiltersResult
              filters={filters}
              totalResults={dataFiltered.length}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: 'relative' }}>
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <NotificationTableRow key={row.id} row={row} editHref="#" />
                    ))}

                  <TableEmptyRows
                    height={table.dense ? 56 : 56 + 20}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>

          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      </DashboardContent>

      {renderQuickCreateForm()}
    </>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: AllNotificationDT[];
  filters: INotificationTableFilters;
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters }: ApplyFilterProps) {
  // Destructure both name and status from filters
  const { name, status } = filters;

  const stabilizedThis = inputData?.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis?.map((el) => el[0]);

  // ✅ FIX 1: Search Filter
  // Check against title, message, user's full name, and phone number
  if (name) {
    const lowerCaseName = name.toLowerCase();
    inputData = inputData?.filter(
      (notification) =>
        notification.title.toLowerCase().includes(lowerCaseName) ||
        notification.message.toLowerCase().includes(lowerCaseName) ||
        notification.user.fullName.toLowerCase().includes(lowerCaseName) ||
        notification.user.phoneNumber.toLowerCase().includes(lowerCaseName)
    );
  }

  // ✅ FIX 2: Status Filter
  // Filter by recipientType if status is not 'All'
  if (status && status !== 'All') {
    inputData = inputData?.filter((notification) => notification.recipientType === status);
  }

  return inputData;
}
