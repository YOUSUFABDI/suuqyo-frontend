'use client';

import type { TableHeadCellProps } from 'src/components/table';
import type { IShopOwnerTableFilters } from '../types/types';

import { useBoolean, useSetState } from 'minimal-shared/hooks';
import { varAlpha } from 'minimal-shared/utils';
import { useCallback, useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Tabs from '@mui/material/Tabs';
import Tooltip from '@mui/material/Tooltip';

import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';

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

import { UseDeleteShopOwner, UseShopOwners } from '../hooks';
import { UseDeleteShopOwners } from '../hooks/use-delete-shop-owners';
import { ShopOwnerTableFiltersResult } from '../shop-owner-table-filters-result';
import { ShopOwnerTableRow } from '../shop-owner-table-row';
import { ShopOwnerTableToolbar } from '../shop-owner-table-toolbar';
import { ShopOwnerDT } from '../types/types';

// ----------------------------------------------------------------------
export const _SHOPOWNER_STATUS = ['All', 'Active', 'Inactive'];

const STATUS_OPTIONS = [
  { value: 'All', label: 'All' },
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
] as const;

const TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'name', label: 'Name' },
  { id: 'phoneNumber', label: 'Phone number', width: 180 },
  { id: 'country', label: 'Country', width: 220 },
  { id: 'address', label: 'Address', width: 220 },
  { id: 'role', label: 'Role', width: 180 },
  { id: 'status', label: 'Status', width: 100 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function ShopwOwnerListView() {
  const role = localStorage.getItem('role');
  const { shopOwners } = UseShopOwners();
  const { deleteShopOwner, isDeleting } = UseDeleteShopOwner();
  const { deleteShopOwners, areDeleting } = UseDeleteShopOwners();
  const table = useTable();

  const confirmDialog = useBoolean();

  const [tableData, setTableData] = useState<ShopOwnerDT[]>(shopOwners);

  const filters = useSetState<IShopOwnerTableFilters>({
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

  const handleDeleteRow = useCallback(
    async (id: string) => {
      try {
        await deleteShopOwner(parseInt(id)).unwrap();
        toast.success('Shop owner deleted successfully!');

        const deleteRow = tableData.filter((row) => row.id !== id);
        setTableData(deleteRow);

        table.onUpdatePageDeleteRow(dataInPage.length);
      } catch (error: any) {
        console.log(error);
        let errorMessage = 'An unexpected error occurred';
        if (error?.data?.error?.message) {
          errorMessage = error.data.error.message;
        } else if (error?.data?.message) {
          errorMessage = error.data.message;
        }
        toast.error(errorMessage);
      }
    },
    [dataInPage.length, deleteShopOwner, table, tableData]
  );

  const handleDeleteRows = useCallback(async () => {
    try {
      const selectedIds = table.selected.map((id) => Number(id));
      if (!selectedIds.length) return;

      await deleteShopOwners(selectedIds).unwrap();
      toast.success('Shop owners deleted successfully!');

      const deleteRows = tableData.filter((row) => !selectedIds.includes(Number(row.id)));
      setTableData(deleteRows);

      table.onUpdatePageDeleteRows(dataInPage.length, dataFiltered.length);
    } catch (error: any) {
      let errorMessage = 'An unexpected error occurred';
      if (error?.data?.error?.message) {
        errorMessage = error.data.error.message;
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      }
      toast.error(errorMessage);
    }
  }, [deleteShopOwners, table.selected, dataInPage.length, dataFiltered.length, table, tableData]);

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: IShopOwnerTableFilters['status']) => {
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
          Are you sure you want to delete <strong>{table.selected.length}</strong> items?
        </>
      }
      action={
        <Button
          variant="contained"
          color="error"
          disabled={areDeleting}
          onClick={async () => {
            await handleDeleteRows();
            confirmDialog.onFalse();
          }}
        >
          {areDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      }
    />
  );

  useEffect(() => {
    if (JSON.stringify(shopOwners) !== JSON.stringify(tableData)) {
      setTableData(shopOwners);
    }
  }, [shopOwners, tableData]);

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="List"
          links={[
            {
              name: role === 'ADMIN' ? 'Dashboard' : 'Staff',
              href: role === 'ADMIN' ? paths.dashboard.shopOwner.root : paths.staff.shopOwner.root,
            },
            {
              name: 'Shop owner',
              href: role === 'ADMIN' ? paths.dashboard.shopOwner.root : paths.staff.shopOwner.root,
            },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={role === 'ADMIN' ? paths.dashboard.shopOwner.new : paths.staff.shopOwner.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New shop owner
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
            {STATUS_OPTIONS.map((tab, index) => (
              <Tab
                key={index}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={tab.value === currentFilters.status ? 'filled' : 'soft'}
                    color={
                      tab.value === 'Active'
                        ? 'success'
                        : tab.value === 'Inactive'
                          ? 'error'
                          : 'default'
                    }
                  >
                    {tab.value === 'All'
                      ? tableData.length
                      : tableData.filter((user) => user.status === (tab.value === 'Active')).length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <ShopOwnerTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            options={{ status: ['All', 'Active', 'Inactive'] }}
          />

          {canReset && (
            <ShopOwnerTableFiltersResult
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
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirmDialog.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
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
                      <ShopOwnerTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        editHref={
                          role === 'ADMIN'
                            ? paths.dashboard.shopOwner.edit(row.id)
                            : paths.staff.shopOwner.edit(row.id)
                        }
                        isDeleting={isDeleting}
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
  inputData: ShopOwnerDT[];
  filters: IShopOwnerTableFilters;
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters }: ApplyFilterProps) {
  const { name, status, role, phoneNumber } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (user) =>
        user.fullName.toLowerCase().includes(name.toLowerCase()) ||
        user.phoneNumber.toLowerCase().includes(phoneNumber.toLowerCase())
    );
  }

  if (status !== 'All') {
    inputData = inputData.filter((user) =>
      status === 'Active' ? user.status === true : user.status === false
    );
  }

  if (role.length) {
    inputData = inputData.filter((user) => role.includes(user.role));
  }

  return inputData;
}
