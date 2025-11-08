'use client';

import type { TableHeadCellProps } from 'src/components/table';
import type { IProductCategoryTableFilters } from '../types/types';

import { useBoolean, useSetState } from 'minimal-shared/hooks';
import { useCallback, useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Tooltip from '@mui/material/Tooltip';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { Iconify } from 'src/components/iconify';
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

import { UseDeleteOneProductCategory, UseProductCategories } from '../hooks';
import { UseDeleteProductCategories } from '../hooks/use-delete-product-categories';
import { ProductCatgeoryQuickCreateForm } from '../product-category-quick-create-form';
import { SizeTableFiltersResult } from '../size-table-filters-result';
import { ProductCatgoryTableRow } from '../product-category-table-row';
import { SizeTableToolbar } from '../size-table-toolbar';
import { ProductCategoryDT } from '../types/types';

// ----------------------------------------------------------------------

const TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'name', label: 'Name' },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function ProductCategoryListView() {
  const role = localStorage.getItem('role');
  const { productCategories } = UseProductCategories();
  const { deleteOneProductCategory, isDeleting } = UseDeleteOneProductCategory();
  const { deleteManyProductCategories, areDeleting } = UseDeleteProductCategories();
  const table = useTable();

  const confirmDialog = useBoolean();
  const quickCreateForm = useBoolean();

  const [tableData, setTableData] = useState<ProductCategoryDT[]>(productCategories);

  const filters = useSetState<IProductCategoryTableFilters>({
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
        await deleteOneProductCategory({ id: parseInt(id) }).unwrap();
        toast.success('Product category deleted successfully!');

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
    [dataInPage.length, deleteOneProductCategory, table, tableData]
  );

  const handleDeleteRows = useCallback(async () => {
    try {
      const selectedIds = table.selected.map((id) => Number(id));
      if (!selectedIds.length) return;

      await deleteManyProductCategories({ ids: selectedIds }).unwrap();
      toast.success('Product categories deleted successfully!');

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
  }, [
    deleteManyProductCategories,
    table.selected,
    dataInPage.length,
    dataFiltered.length,
    table,
    tableData,
  ]);

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

  const renderQuickCreateForm = () => (
    <ProductCatgeoryQuickCreateForm
      open={quickCreateForm.value}
      onClose={quickCreateForm.onFalse}
    />
  );

  useEffect(() => {
    if (JSON.stringify(productCategories) !== JSON.stringify(tableData)) {
      setTableData(productCategories);
    }
  }, [productCategories, tableData]);

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="List"
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.category.root,
            },
            {
              name: 'Product categories',
              href: paths.dashboard.category.root,
            },
            { name: 'List' },
          ]}
          action={
            <Button
              onClick={quickCreateForm.onTrue}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Product Category
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <SizeTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            options={{ status: ['All', 'Active', 'Inactive'] }}
          />

          {canReset && (
            <SizeTableFiltersResult
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
                      <ProductCatgoryTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        editHref="#"
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
      {renderQuickCreateForm()}
    </>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: ProductCategoryDT[];
  filters: IProductCategoryTableFilters;
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters }: ApplyFilterProps) {
  const { name } = filters;

  const stabilizedThis = inputData?.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis?.map((el) => el[0]);

  if (name) {
    inputData = inputData?.filter((user) => user.name.toLowerCase().includes(name.toLowerCase()));
  }

  return inputData;
}
