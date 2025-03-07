'use client';

import type { TableHeadCellProps } from 'src/components/table';
import type { IShopOwnerTableFilters, ShopDT } from '../types/types';

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

import { SHOP_OWNER_STATUS_OPTIONS } from '../types/types';

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

import { ShopOwnerDT } from '../types/types';
// import { UseDeleteShopOwner, UseShopOwners, UseShops } from '../hooks';
import { UseShops } from '../hooks';
// import { UseDeleteShopOwners } from '../hooks/use-delete-shop-owners';
import { ShopTableFiltersResult } from '../shop-table-filters-result';
import { ShopTableRow } from '../shop-table-row';
import { ShopTableToolbar } from '../shop-table-toolbar';

// ----------------------------------------------------------------------

export const _SHOPOWNER_STATUS = [`ACTIVE`, `INACTIVE`];

const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, ...SHOP_OWNER_STATUS_OPTIONS];

const TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'name', label: 'Shop' },
  { id: 'shopAddress', label: 'Shop address' },
  { id: 'phoneNumber', label: 'Phone number' },
  { id: 'CreatedAt', label: 'Created at' },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function ShopListView() {
  const { shops } = UseShops();
  // const { deleteShopOwner, isDeleting } = UseDeleteShopOwner();
  // const { deleteShopOwners, areDeleting } = UseDeleteShopOwners();
  const table = useTable();

  const confirmDialog = useBoolean();

  const [tableData, setTableData] = useState<ShopDT[]>(shops);

  const filters = useSetState<IShopOwnerTableFilters>({
    name: '',
    role: [],
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
    !!currentFilters.name || currentFilters.role.length > 0 || currentFilters.status !== 'all';

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  // const handleDeleteRow = useCallback(
  //   async (id: string) => {
  //     try {
  //       await deleteShopOwner(parseInt(id)).unwrap();
  //       toast.success('Shop owner deleted successfully!');

  //       const deleteRow = tableData.filter((row) => row.id !== Number(id));
  //       setTableData(deleteRow);

  //       table.onUpdatePageDeleteRow(dataInPage.length);
  //     } catch (error: any) {
  //       console.log(error);
  //       let errorMessage = 'An unexpected error occurred';
  //       if (error?.data?.error?.message) {
  //         errorMessage = error.data.error.message;
  //       } else if (error?.data?.message) {
  //         errorMessage = error.data.message;
  //       }
  //       toast.error(errorMessage);
  //     }
  //   },
  //   [dataInPage.length, deleteShopOwner, table, tableData]
  // );

  // const handleDeleteRows = useCallback(async () => {
  //   try {
  //     const selectedIds = table.selected.map((id) => Number(id));
  //     if (!selectedIds.length) return;

  //     await deleteShopOwners(selectedIds).unwrap();
  //     toast.success('Shop owners deleted successfully!');

  //     const deleteRows = tableData.filter((row) => !selectedIds.includes(Number(row.id)));
  //     setTableData(deleteRows);

  //     table.onUpdatePageDeleteRows(dataInPage.length, dataFiltered.length);
  //   } catch (error: any) {
  //     let errorMessage = 'An unexpected error occurred';
  //     if (error?.data?.error?.message) {
  //       errorMessage = error.data.error.message;
  //     } else if (error?.data?.message) {
  //       errorMessage = error.data.message;
  //     }
  //     toast.error(errorMessage);
  //   }
  // }, [deleteShopOwners, table.selected, dataInPage.length, dataFiltered.length, table, tableData]);

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
          Are you sure you want to delete <strong>{table.selected.length}</strong> items?
        </>
      }
      action={
        <Button
          variant="contained"
          color="error"
          // disabled={areDeleting}
          onClick={async () => {
            // await handleDeleteRows();
            confirmDialog.onFalse();
          }}
        >
          {/* {areDeleting ? 'Deleting...' : 'Delete'} */}
          Delete
        </Button>
      }
    />
  );

  useEffect(() => {
    if (JSON.stringify(shops) !== JSON.stringify(tableData)) {
      setTableData(shops);
    }
  }, [shops, tableData]);

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Shop owner', href: paths.shopOwner.root },
            { name: 'Shop owner', href: paths.shopOwner.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.shopOwner.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Setup your shop
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <ShopTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            options={{ status: _SHOPOWNER_STATUS }}
          />

          {canReset && (
            <ShopTableFiltersResult
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
                      <ShopTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => {}}
                        // onDeleteRow={() => handleDeleteRow(row.id)}
                        editHref={paths.shopOwner.setupShop.edit(row.id)}
                        isDeleting={false}
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
  inputData: ShopDT[];
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
        user.user.ShopOwner.fullName.toLowerCase().includes(name.toLowerCase()) ||
        user.user.ShopOwner.phoneNumber.toLowerCase().includes(phoneNumber.toLowerCase())
    );
  }

  // if (status !== 'all') {
  //   inputData = inputData.filter((user) => user.status === status);
  // }

  // if (role.length) {
  //   inputData = inputData.filter((user) => role.includes(user.status));
  // }

  return inputData;
}
