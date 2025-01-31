'use client';

import type { TableHeadCellProps } from 'src/components/table';

import { useSetState } from 'minimal-shared/hooks';
import { varAlpha } from 'minimal-shared/utils';
import { useCallback, useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Tabs from '@mui/material/Tabs';

import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';
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

import { useSubscriptions } from '../hooks';
import { SubscriptionTableFiltersResult } from '../subscription-table-filters-result';
import { SubscriptionTableRow } from '../susbcription-table-row';
import { SubscriptionTableToolbar } from '../susbcription-table-toolbar';
import { SUBS_STATUS_OPTIONS, SubscriptionResDT } from '../types/subscription';

// ----------------------------------------------------------------------

export const _roles = [`YEARLY`, `MONTHLY`];

const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, ...SUBS_STATUS_OPTIONS];

const TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'name', label: 'Name' },
  { id: 'phoneNumber', label: 'Phone number', width: 100 },
  { id: 'subscriptionType', label: 'Subscription type' },
  { id: 'subscriptionFee', label: 'Subscription fee' },
  { id: 'discount', label: 'Discount' },
  { id: 'startDate', label: 'Start date' },
  { id: 'endDate', label: 'End date' },
  { id: 'remainingTime', label: 'Remaining time' },
  { id: 'subscriptionStatus', label: 'Subscription status' },
  { id: '', width: 80 },
];

export type SUBSTableFilters = {
  name: string;
  status: string;
  phoneNumber: string;
  subscriptionType: string[];
};
// ----------------------------------------------------------------------

export function SubscriptionListView() {
  const { subscriptions } = useSubscriptions();
  const table = useTable();

  const [tableData, setTableData] = useState<SubscriptionResDT[]>(subscriptions);

  const filters = useSetState<SUBSTableFilters>({
    name: '',
    subscriptionType: [],
    status: 'all',
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
    !!currentFilters.name ||
    currentFilters.subscriptionType.length > 0 ||
    currentFilters.status !== 'all';

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      table.onResetPage();
      updateFilters({ status: newValue });
    },
    [updateFilters, table]
  );

  useEffect(() => {
    if (JSON.stringify(subscriptions) !== JSON.stringify(tableData)) {
      setTableData(subscriptions);
    }
  }, [subscriptions, tableData]);

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Subscriptions', href: paths.dashboard.subscription.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.subscription.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New subscription
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <Tabs
            value={currentFilters.status}
            onChange={handleFilterStatus}
            sx={[
              (theme) => ({
                px: 2.5,
                boxShadow: `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
              }),
            ]}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === currentFilters.status) && 'filled') ||
                      'soft'
                    }
                    color={
                      (tab.value === 'PENDING' && 'warning') ||
                      (tab.value === 'ACTIVE' && 'success') ||
                      (tab.value === 'EXPIRED' && 'error') ||
                      'default'
                    }
                  >
                    {['PENDING', 'ACTIVE', 'EXPIRED'].includes(tab.value)
                      ? tableData.filter((user) => user.subscriptionStatus === tab.value).length
                      : tableData.length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <SubscriptionTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            options={{ subscriptionTypes: _roles }}
          />

          {canReset && (
            <SubscriptionTableFiltersResult
              filters={filters}
              totalResults={dataFiltered.length}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
                )
              }
            />

            <Scrollbar>
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
                      dataFiltered.map((row) => row.id)
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
                      <SubscriptionTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        editHref={'#'}
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
    </>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: SubscriptionResDT[];
  filters: SUBSTableFilters;
  comparator: (a: any, b: any) => number;
};

// Function to apply filters
function applyFilter({ inputData, comparator, filters }: ApplyFilterProps) {
  const { name, phoneNumber, status, subscriptionType } = filters;

  let filteredData = inputData;

  // Filter by name or phone number if available
  if (name || phoneNumber) {
    filteredData = filteredData.filter(
      (user) =>
        user.shopOwner.fullName.toLowerCase().includes(name.toLowerCase()) ||
        user.shopOwner.phoneNumber.toLowerCase().includes(phoneNumber.toLowerCase())
    );
  }

  // Filter by status if not 'all'
  if (status !== 'all') {
    filteredData = filteredData.filter((user) => user.subscriptionStatus === status);
  }

  // Filter by subscriptionType
  if (subscriptionType.length) {
    filteredData = filteredData.filter((user) => subscriptionType.includes(user.subscriptionType));
  }

  return filteredData;
}
