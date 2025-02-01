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
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Tabs from '@mui/material/Tabs';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';

import { fIsAfter, fIsBetween } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { Iconify } from 'src/components/iconify';
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

import { UseTransactions } from '../hooks';
import { TransactionAnalytic } from '../transaction-analytic';
import { TransactionTableFiltersResult } from '../transaction-table-filters-result';
import { TransactionTableRow } from '../transaction-table-row';
import { TransactionTableToolbar } from '../transaction-table-toolbar';
import { SubscriptionTransactionResDT, TransactionTableFilters } from '../types/transaction';

// ----------------------------------------------------------------------

const TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'shopOwner', label: 'Shopowner' },
  { id: 'transactionDate', label: 'Transaction Date' },
  { id: 'price', label: 'Amount' },
  { id: 'paymentMethod', label: 'Payment method' },
  { id: 'subscriptionType', label: 'Subscription type' },
  { id: 'transactionType', label: 'Transaction type' },
  { id: 'status', label: 'Status' },
  { id: '' },
];

export const TRANSACTION_STATUS_OPTIONS = ['PENDING', 'COMPLETED', 'FAILED'];

// ----------------------------------------------------------------------

export function TransactionListView() {
  const { transactions } = UseTransactions();
  console.log('transactions', transactions);
  const theme = useTheme();

  const table = useTable({ defaultOrderBy: 'createDate' });

  const confirmDialog = useBoolean();

  const [tableData, setTableData] = useState<SubscriptionTransactionResDT[]>(transactions);

  const filters = useSetState<TransactionTableFilters>({
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

  const getInvoiceLength = (status: string) =>
    tableData.filter((item) => item.transactionStatus === status).length;

  const getTotalAmount = (status: string) =>
    sumBy(
      tableData.filter((item) => item.transactionStatus === status),
      (invoice) => invoice.amount
    );

  const getPercentByStatus = (status: string) =>
    (getInvoiceLength(status) / tableData.length) * 100;

  const TABS = [
    {
      value: 'all',
      label: 'All',
      color: 'default',
      count: tableData.length,
    },
    {
      value: 'PENDING',
      label: 'Pending',
      color: 'warning',
      count: getInvoiceLength('PENDING'),
    },
    {
      value: 'COMPLETED',
      label: 'Completed',
      color: 'success',
      count: getInvoiceLength('COMPLETED'),
    },
    {
      value: 'FAILED',
      label: 'Failed',
      color: 'error',
      count: getInvoiceLength('FAILED'),
    },
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
    // const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

    toast.success('Delete success!');

    // setTableData(deleteRows);

    table.onUpdatePageDeleteRows(dataInPage.length, dataFiltered.length);
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      table.onResetPage();
      updateFilters({ status: newValue });
    },
    [updateFilters, table]
  );

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete"
      content={
        <>
          Are you sure want to delete <strong> {table.selected.length} </strong> items?
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
  );

  useEffect(() => {
    if (JSON.stringify(transactions) !== JSON.stringify(tableData)) {
      setTableData(transactions);
    }
  }, [transactions, tableData]);

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Transaction list"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Transaction', href: paths.dashboard.report.root },
            { name: 'Transaction list' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card sx={{ mb: { xs: 3, md: 5 } }}>
          <Scrollbar sx={{ minHeight: 108 }}>
            <Stack
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 2, flexDirection: 'row' }}
            >
              <TransactionAnalytic
                title="Total"
                total={tableData.length}
                percent={100}
                price={sumBy(tableData, (invoice) => invoice.amount)}
                icon="solar:bill-list-bold-duotone"
                color={theme.vars.palette.info.main}
              />

              {/* <TransactionAnalytic
                title="Pending"
                total={getInvoiceLength('pending')}
                percent={getPercentByStatus('pending')}
                price={getTotalAmount('pending')}
                icon="solar:sort-by-time-bold-duotone"
                color={theme.vars.palette.warning.main}
              /> */}

              {/* <TransactionAnalytic
                title="Completed"
                total={getInvoiceLength('paid')}
                percent={getPercentByStatus('paid')}
                price={getTotalAmount('paid')}
                icon="solar:file-check-bold-duotone"
                color={theme.vars.palette.success.main}
              /> */}

              {/* <TransactionAnalytic
                title="Refund"
                total={getInvoiceLength('draft')}
                percent={getPercentByStatus('draft')}
                price={getTotalAmount('draft')}
                icon="solar:file-corrupted-bold-duotone"
                color={theme.vars.palette.text.secondary}
              /> */}

              {/* <TransactionAnalytic
                title="Failed"
                total={getInvoiceLength('overdue')}
                percent={getPercentByStatus('overdue')}
                price={getTotalAmount('overdue')}
                icon="solar:bell-bing-bold-duotone"
                color={theme.vars.palette.error.main}
              /> */}
            </Stack>
          </Scrollbar>
        </Card>

        <Card>
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

          <TransactionTableToolbar
            filters={filters}
            dateError={dateError}
            onResetPage={table.onResetPage}
            options={{ service: TRANSACTION_STATUS_OPTIONS }}
          />

          {canReset && (
            <TransactionTableFiltersResult
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
              action={
                <Box sx={{ display: 'flex' }}>
                  <Tooltip title="Sent">
                    <IconButton color="primary">
                      <Iconify icon="iconamoon:send-fill" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Download">
                    <IconButton color="primary">
                      <Iconify icon="eva:download-outline" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Print">
                    <IconButton color="primary">
                      <Iconify icon="solar:printer-minimalistic-bold" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete">
                    <IconButton color="primary" onClick={confirmDialog.onTrue}>
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  </Tooltip>
                </Box>
              }
            />

            <Scrollbar sx={{ minHeight: 444 }}>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
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
                      <TransactionTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(String(row.id))}
                        onSelectRow={() => table.onSelectRow(String(row.id))}
                        onDeleteRow={() => handleDeleteRow(String(row.id))}
                        editHref={''}
                        detailsHref={''}
                      />
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

      {renderConfirmDialog()}
    </>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  dateError: boolean;
  inputData: SubscriptionTransactionResDT[];
  filters: TransactionTableFilters;
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

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(({ id, shopOwner }) =>
      [id, shopOwner?.fullName, shopOwner?.phoneNumber].some(
        (field) => typeof field === 'string' && field.toLowerCase().includes(name.toLowerCase())
      )
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((invoice) => invoice.transactionStatus === status);
  }

  if (service.length) {
    inputData = inputData.filter(
      (invoice) => service.includes(invoice.transactionStatus) // No need for 'some' since 'transactionStatus' is a string
    );
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((invoice) => fIsBetween(invoice.createdAt, startDate, endDate));
    }
  }

  return inputData;
}
