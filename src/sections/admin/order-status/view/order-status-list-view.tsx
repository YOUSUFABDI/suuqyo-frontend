'use client';

import type { TableHeadCellProps } from 'src/components/table';
import type { IOrderTableFilters } from 'src/types/order';

import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

import { useSetState } from 'minimal-shared/hooks';
import { varAlpha } from 'minimal-shared/utils';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { fIsAfter } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
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
  // TableSelectedAction, // not needed for search/date filters
  useTable,
} from 'src/components/table';

import { UseAllOrderStatus } from '../hooks';
import { OrderStatusTableFiltersResult } from '../order-status-table-filters-result';
import { OrderStatusTableRow } from '../order-status-table-row';
import { ORDER_STATUS_OPTIONS, OrderStatusDT } from '../types/types';
import { OrderStatusTableToolbar } from '../order-status-table-toolbar';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const STATUS_TABS = [{ value: 'all', label: 'All' }, ...ORDER_STATUS_OPTIONS];

const TABLE_HEAD: TableHeadCellProps[] = [
  // Keep in sync with row layout. If your row still shows a checkbox column, add this back:
  { id: 'selector', label: '', width: 48 },
  { id: 'name', label: 'Shop owner', width: 280 },
  { id: 'shopName', label: 'Shop name', width: 160 },
  { id: 'pending', label: 'Pending', width: 80, align: 'center' },
  { id: 'preparing', label: 'Preparing', width: 80, align: 'center' },
  { id: 'delivering', label: 'Delivering', width: 80, align: 'center' },
  { id: 'completed', label: 'Completed', width: 80, align: 'center' },
  { id: 'canceled', label: 'Canceled', width: 80, align: 'center' },
  { id: 'refunded', label: 'Refunded', width: 80, align: 'center' },
  { id: 'totalOrders', label: 'Total', width: 92, align: 'center' },
  { id: 'lastOrderDate', label: 'Last order', width: 160 },
  { id: '', width: 88 },
];

// Safe array helper
function arr<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export function OrderStatusListView() {
  const table = useTable({ defaultOrderBy: 'totalOrders', defaultOrder: 'desc' });
  const { allOrderStatus } = UseAllOrderStatus();

  const [tableData, setTableData] = useState<OrderStatusDT[]>(arr<OrderStatusDT>(allOrderStatus));

  const filters = useSetState<IOrderTableFilters>({
    name: '',
    status: 'all',
    startDate: null, // will store dayjs() | null
    endDate: null, // will store dayjs() | null
  });

  const { state: currentFilters, setState: updateFilters } = filters;

  // Date sanity (start after end)
  const dateError = fIsAfter(currentFilters.startDate, currentFilters.endDate);

  // Sync table data from API
  useEffect(() => {
    const safe = arr<OrderStatusDT>(allOrderStatus);
    if (JSON.stringify(safe) !== JSON.stringify(tableData)) {
      setTableData(safe);
    }
  }, [allOrderStatus, tableData]);

  const dataFiltered = useMemo(
    () =>
      applyFilter({
        inputData: tableData,
        comparator: getComparator(table.order, table.orderBy),
        filters: currentFilters,
        dateError,
      }),
    [tableData, table.order, table.orderBy, currentFilters, dateError]
  );

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!currentFilters.name ||
    currentFilters.status !== 'all' ||
    (!!currentFilters.startDate && !!currentFilters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const onChangeStatusTab = useCallback(
    (_e: React.SyntheticEvent, newValue: string) => {
      table.onResetPage();
      updateFilters({ status: newValue });
    },
    [updateFilters, table]
  );

  // Counts for tab badges
  const tabCounts = useMemo(() => {
    const base = {
      all: tableData.length,
      PENDING: tableData.filter((r) => r.pending > 0).length,
      PREPARING: tableData.filter((r) => r.preparing > 0).length,
      DELIVERING: tableData.filter((r) => r.delivering > 0).length,
      COMPLETED: tableData.filter((r) => r.completed > 0).length,
      CANCELED: tableData.filter((r) => r.canceled > 0).length,
      REFUNDED: tableData.filter((r) => r.refunded > 0).length,
    };
    return base;
  }, [tableData]);

  // ---- Toolbar handlers ----
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    table.onResetPage();
    updateFilters({ name: e.target.value || '' });
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    table.onResetPage();
    updateFilters({ startDate: val ? dayjs(val) : null });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    table.onResetPage();
    updateFilters({ endDate: val ? dayjs(val) : null });
  };

  const handleToday = () => {
    const today = dayjs();
    table.onResetPage();
    updateFilters({ startDate: today, endDate: today });
  };

  const handleClear = () => {
    table.onResetPage();
    updateFilters({ name: '', startDate: null, endDate: null, status: 'all' });
  };

  // For TextField[type="date"] we need yyyy-mm-dd strings
  const startDateStr = currentFilters.startDate
    ? currentFilters.startDate.format('YYYY-MM-DD')
    : '';
  const endDateStr = currentFilters.endDate ? currentFilters.endDate.format('YYYY-MM-DD') : '';

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Order status"
        links={[
          { name: 'Shop owner', href: paths.shopOwner.root },
          { name: 'Orders', href: paths.shopOwner.order.root },
          { name: 'Status' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <Tabs
          value={currentFilters.status}
          onChange={onChangeStatusTab}
          sx={[
            (theme) => ({
              px: 2.5,
              boxShadow: `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
            }),
          ]}
        >
          {STATUS_TABS.map((tab) => (
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
                    (tab.value === 'PREPARING' && 'info') ||
                    (tab.value === 'DELIVERING' && 'secondary') ||
                    (tab.value === 'COMPLETED' && 'success') ||
                    (tab.value === 'CANCELED' && 'error') ||
                    'default'
                  }
                >
                  {tabCounts[tab.value as keyof typeof tabCounts] ?? 0}
                </Label>
              }
            />
          ))}
        </Tabs>

        <OrderStatusTableToolbar
          filters={filters}
          onResetPage={table.onResetPage}
          dateError={dateError}
        />

        {canReset && (
          <OrderStatusTableFiltersResult
            filters={filters}
            totalResults={dataFiltered.length}
            onResetPage={table.onResetPage}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        <Box sx={{ position: 'relative' }}>
          {/* Selection toolbar removed to keep UI clean for search/date usage
          <TableSelectedAction ... /> */}

          <Scrollbar sx={{ minHeight: 444 }}>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headCells={TABLE_HEAD}
                rowCount={dataFiltered.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                // If you re-add a selector column, wire onSelectAllRows here.
              />

              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <OrderStatusTableRow
                      detailsHref={paths.dashboard.orderStatus.details(row.shopOwnerId)}
                      key={row.shopOwnerId}
                      row={row}
                      // If your row still shows a checkbox, keep these lines and add selector column back:
                      selected={table.selected.includes(String(row.shopOwnerId))}
                      onSelectRow={() => table.onSelectRow(String(row.shopOwnerId))}
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
  );
}

// ----------------- helpers -----------------

type ApplyFilterProps = {
  dateError: boolean;
  inputData: OrderStatusDT[] | unknown;
  filters: IOrderTableFilters; // { name, status, startDate(dayjs|null), endDate(dayjs|null) }
  comparator: (a: any, b: any) => number;
};

function toArraySafe<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function applyFilter({ inputData, comparator, filters, dateError }: ApplyFilterProps) {
  const { status, name, startDate, endDate } = filters;

  // Coerce to array
  let data = toArraySafe<OrderStatusDT>(inputData);

  // Sorting (stable)
  const stabilized = data.map((el, index) => [el, index] as const);
  stabilized.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  data = stabilized.map((el) => el[0]);

  // Text search across owner/shop fields
  if (name) {
    const q = name.toLowerCase();
    data = data.filter((row) =>
      [row.name, row.email, row.phoneNumber, row.shopName]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q))
    );
  }

  // Status tab filter: include owner if that count > 0
  if (status !== 'all') {
    data = data.filter((row) => {
      switch (status) {
        case 'PENDING':
          return row.pending > 0;
        case 'PREPARING':
          return row.preparing > 0;
        case 'DELIVERING':
          return row.delivering > 0;
        case 'COMPLETED':
          return row.completed > 0;
        case 'CANCELED':
          return row.canceled > 0;
        case 'REFUNDED':
          return row.refunded > 0;
        default:
          return true;
      }
    });
  }

  // Date range by lastOrderDate (inclusive, day granularity)
  if (!dateError && startDate && endDate) {
    data = data.filter((row) => {
      if (!row.lastOrderDate) return false;
      const d = dayjs(row.lastOrderDate);
      return d.isSameOrAfter(startDate, 'day') && d.isSameOrBefore(endDate, 'day');
    });
  }

  return data;
}
