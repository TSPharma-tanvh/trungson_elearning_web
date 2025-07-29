'use client';

import React from 'react';
import { GetEmployeeRequest } from '@/domain/models/employee/request/get-employee-request';
import { SyncEmployeeFromHrmRequest } from '@/domain/models/employee/request/sync-employee-from-hrm-request';
import { type EmployeeResponse } from '@/domain/models/employee/response/employee-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { Button, Stack, Typography } from '@mui/material';
import { ArrowsClockwise } from '@phosphor-icons/react';

import { EmployeeFilters } from '@/presentation/components/dashboard/management/employee/employee-filter';
import EmployeeTable from '@/presentation/components/dashboard/management/employee/employee-table';

export default function Page(): React.JSX.Element {
  const { employeeUsecase } = useDI();

  const [_showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [filters, setFilters] = React.useState<GetEmployeeRequest>(
    new GetEmployeeRequest({ pageNumber: 1, pageSize: 10 })
  );
  const [employee, setEmployee] = React.useState<EmployeeResponse[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [_deleteLoading, setDeleteLoading] = React.useState(false);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const fetchCategories = React.useCallback(async () => {
    try {
      const request = new GetEmployeeRequest({
        ...filters,
        pageNumber: page + 1,
        pageSize: rowsPerPage,
      });
      const { employees, totalRecords } = await employeeUsecase.getEmployeeListInfo(request);
      setEmployee(employees);
      setTotalCount(totalRecords);
    } catch (error) {
      setEmployee([]);
      return undefined;
    }
  }, [filters, page, rowsPerPage, employeeUsecase]);

  React.useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  const handleFilter = (newFilters: GetEmployeeRequest) => {
    setFilters(newFilters);
    setPage(0);
  };

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(event.target.value, 10);
    setRowsPerPage(newSize);
    setPage(0);
  };

  const syncFromHrm = async (request: SyncEmployeeFromHrmRequest) => {
    try {
      await employeeUsecase.syncEmployeeFromHrm(request);
      setShowCreateDialog(false);
      await fetchCategories();
    } catch (error) {
      return undefined;
    }
  };

  // const handleEditEmployee = async (request: UpdateEmployeeRequest) => {
  //   try {
  //     await employeeUsecase.updateEmployee(request);
  //     await fetchCategories();
  //   } catch (error) {
  //     console.error('Failed to update category path:', error);
  //   }
  // };

  const handleDeleteCategories = async (ids: string[]) => {
    try {
      setDeleteLoading(true);
      for (const id of ids) {
        const response = await employeeUsecase.deleteEmployee(id);
        if (!response) {
          throw new Error(`Failed to delete path with ID: ${id}`);
        }
      }
      await fetchCategories();
    } catch (error) {
      return undefined;
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4" sx={{ color: 'var(--mui-palette-secondary-main)' }}>
            Employee
          </Typography>
        </Stack>
        <Button
          startIcon={<ArrowsClockwise fontSize="var(--icon-fontSize-md)" />}
          variant="contained"
          onClick={() => {
            const request = new SyncEmployeeFromHrmRequest({
              username: '',
              password: '',
            });
            void syncFromHrm(request);
          }}
        >
          Sync From HRM
        </Button>
      </Stack>
      <EmployeeFilters onFilter={handleFilter} />
      <EmployeeTable
        rows={employee}
        count={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onDeleteEmployees={handleDeleteCategories}
      />
    </Stack>
  );
}
