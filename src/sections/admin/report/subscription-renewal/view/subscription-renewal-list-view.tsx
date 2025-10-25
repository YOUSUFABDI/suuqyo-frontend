'use client';

import type { TableHeadCellProps } from 'src/components/table';
import { sumBy } from 'es-toolkit';
import { useBoolean, useSetState } from 'minimal-shared/hooks';
import { varAlpha } from 'minimal-shared/utils';
import { useCallback, useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';
import { fIsAfter, fIsBetween } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';
import { toast } from 'src/components/snackbar';
import {
  emptyRows,
  getComparator,
  rowInPage,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  useTable,
} from 'src/components/table';

import { UseSubscriptionRenewals } from '../hooks';
import { SubscriptionRenewalAnalytic } from '../subscription-renewal-analytic';
import { SubscriptionRenewalTableFiltersResult } from '../subscription-renewal-table-filters-result';
import { SubscriptionRenewalTableRow } from '../subscription-renewal-table-row';
import {
  SubscriptionRenewalResDT,
  SubscriptionRenewalTableFilters,
} from '../types/subscription-renewal';

// Toolbar with search + date range + multi-select status
import { SubscriptionRenewalTableToolbar } from '../subscription-renewal-table-toolbar';

const TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'shopOwner', label: 'Shopowner' },
  { id: 'phone', label: 'Phone' },
  { id: 'transactionType', label: 'Transaction type' },
  { id: 'subscriptionTerm', label: 'Subscription type' },
  { id: 'subscriptionFee', label: 'Subscription fee' }, // Shows transaction amount
  { id: 'startDate', label: 'Start date' },
  { id: 'endDate', label: 'End date' },
  { id: 'subscriptionStatus', label: 'Subscription status' },
];

// ✅ make it a mutable string[]
export const TRANSACTION_STATUS_OPTIONS: string[] = ['PENDING', 'ACTIVE', 'EXPIRED'];

export function SubscriptionRenewalListView() {
  const { subscriptionRenewals } = UseSubscriptionRenewals();
  const theme = useTheme();

  const table = useTable({ defaultOrderBy: 'createdAt' });
  const confirmDialog = useBoolean();

  const [tableData, setTableData] = useState<SubscriptionRenewalResDT[]>(subscriptionRenewals);

  const filters = useSetState<SubscriptionRenewalTableFilters>({
    name: '',
    service: [],
    status: 'all',
    startDate: null,
    endDate: null,
  });
  const { state: currentFilters, setState: updateFilters } = filters;

  const dateError = fIsAfter(currentFilters.startDate, currentFilters.endDate);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
    dateError,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!currentFilters.name ||
    currentFilters.service.length > 0 ||
    currentFilters.status !== 'all' ||
    (!!currentFilters.startDate && !!currentFilters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const getCountBySubStatus = (status: 'PENDING' | 'ACTIVE' | 'EXPIRED') =>
    tableData.filter((r) => r.subscription.subscriptionStatus === status).length;

  const TABS = [
    { value: 'all', label: 'All', color: 'default', count: tableData.length },
    { value: 'PENDING', label: 'Pending', color: 'warning', count: getCountBySubStatus('PENDING') },
    { value: 'ACTIVE', label: 'Active', color: 'success', count: getCountBySubStatus('ACTIVE') },
    { value: 'EXPIRED', label: 'Expired', color: 'default', count: getCountBySubStatus('EXPIRED') },
  ] as const;

  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = tableData.filter((row) => row.id !== Number(id));
      toast.success('Delete success!');
      setTableData(deleteRow);
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    toast.success('Delete success!');
    table.onUpdatePageDeleteRows(dataInPage.length, dataFiltered.length);
  }, [dataFiltered.length, dataInPage.length, table]);

  const handleFilterStatus = useCallback(
    (_: React.SyntheticEvent, newValue: string) => {
      table.onResetPage();
      updateFilters({ status: newValue });
    },
    [updateFilters, table]
  );

  useEffect(() => {
    if (JSON.stringify(subscriptionRenewals) !== JSON.stringify(tableData)) {
      setTableData(subscriptionRenewals);
    }
  }, [subscriptionRenewals, tableData]);

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Subscription renewal list"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Subscription renewal', href: paths.dashboard.report.subscriptionRenewal },
            { name: 'Subscription renewal list' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card sx={{ mb: { xs: 3, md: 5 } }}>
          <Scrollbar sx={{ minHeight: 108 }}>
            <Stack
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 2, flexDirection: 'row' }}
            >
              <SubscriptionRenewalAnalytic
                title="Total"
                total={tableData.length}
                percent={100}
                price={sumBy(tableData, (r) => r.amount)}
                icon="solar:bill-list-bold-duotone"
                color={theme.vars.palette.info.main}
              />
            </Stack>
          </Scrollbar>
        </Card>

        <Card>
          <SubscriptionRenewalTableToolbar
            filters={filters}
            dateError={dateError}
            onResetPage={table.onResetPage}
            options={{ service: TRANSACTION_STATUS_OPTIONS }}
          />

          <Tabs
            value={currentFilters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
            }}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                iconPosition="end"
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === currentFilters.status) && 'filled') ||
                      'soft'
                    }
                    color={tab.color}
                  >
                    {tab.count}
                  </Label>
                }
              />
            ))}
          </Tabs>

          {canReset && (
            <SubscriptionRenewalTableFiltersResult
              filters={filters}
              onResetPage={table.onResetPage}
              totalResults={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) => {
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => String(row.id))
                );
              }}
            />

            <Scrollbar sx={{ minHeight: 444 }}>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headCells={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => String(row.id))
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <SubscriptionRenewalTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(String(row.id))}
                        onSelectRow={() => table.onSelectRow(String(row.id))}
                        onDeleteRow={() => handleDeleteRow(String(row.id))}
                        editHref=""
                        detailsHref=""
                      />
                    ))}

                  <TableEmptyRows
                    height={table.dense ? 56 : 76}
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

      <ConfirmDialog
        open={confirmDialog.value}
        onClose={confirmDialog.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong>{table.selected.length}</strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirmDialog.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

type ApplyFilterProps = {
  dateError: boolean;
  inputData: SubscriptionRenewalResDT[];
  filters: SubscriptionRenewalTableFilters;
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters, dateError }: ApplyFilterProps) {
  const { name, status, startDate, endDate, service } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  let data = stabilizedThis.map((el) => el[0]);

  // Search by id, name, phone, email
  if (name) {
    const lower = name.toLowerCase();
    data = data.filter((row) =>
      [String(row.id), row.user?.fullName, row.user?.phoneNumber, row.user?.email].some(
        (field) => typeof field === 'string' && field.toLowerCase().includes(lower)
      )
    );
  }

  // Tab status (single)
  if (status !== 'all') {
    data = data.filter((row) => row.subscription.subscriptionStatus === status);
  }

  // Multi-select status
  if (service.length) {
    data = data.filter((row) => service.includes(row.subscription.subscriptionStatus));
  }

  // Date range (transactionDate)
  if (!dateError && startDate && endDate) {
    data = data.filter((row) => fIsBetween(row.transactionDate, startDate, endDate));
  }

  return data;
}
