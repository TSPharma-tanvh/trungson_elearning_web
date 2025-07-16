'use client';

import React, { useEffect, useState } from 'react';
import { GetRoleRequest } from '@/domain/models/role/request/get-role-request';
import { UpdateRoleRequest } from '@/domain/models/role/request/update-role-request';
import { RoleResponse } from '@/domain/models/role/response/role-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { Button, CircularProgress, Stack, Typography } from '@mui/material';
import { Plus } from '@phosphor-icons/react';

import { RolesFilters } from '@/presentation/components/dashboard/management/roles/roles-filters';
import RolesTable from '@/presentation/components/dashboard/management/roles/roles-table';
import { RoleForm } from '@/presentation/components/dashboard/management/roles/update-role-form-dialog';

export default function Page(): React.JSX.Element {
  const roleUseCase = useDI().roleUseCase;

  const [filters, setFilters] = useState<GetRoleRequest>(new GetRoleRequest({ pageNumber: 1, pageSize: 10 }));
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleResponse | undefined>(undefined); // State for selected role

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await roleUseCase.getAllRoles(
        new GetRoleRequest({
          ...filters,
          pageNumber: page + 1,
          pageSize: rowsPerPage,
        })
      );
      setRoles(response.roles ?? []);
      setTotalCount(response.totalRecords ?? 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page, rowsPerPage]);

  const handleFilter = (newFilters: GetRoleRequest) => {
    setFilters(new GetRoleRequest({ ...newFilters, pageNumber: 1 }));
    setPage(0);
  };

  const handlePageChange = (_: unknown, newPage: number) => setPage(newPage);

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteRoles = async (ids: string[]) => {
    await Promise.all(ids.map((id) => roleUseCase.updateRole(id, new UpdateRoleRequest({ isActive: false }))));
    await fetchRoles();
  };

  const handleEditRole = (role: RoleResponse) => {
    setSelectedRole(role);
    setShowForm(true);
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ display: 'flex', flex: '1 1 auto' }}>
          <Typography variant="h4" sx={{ color: 'var(--mui-palette-secondary-main)' }}>
            Roles
          </Typography>
        </Stack>
        <div>
          <Button
            startIcon={<Plus fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            onClick={() => {
              setSelectedRole(undefined);
              setShowForm(true);
            }}
          >
            Add
          </Button>
        </div>
      </Stack>

      <RolesFilters onFilter={handleFilter} />

      {loading ? (
        <Stack alignItems="center" py={5}>
          <CircularProgress />
        </Stack>
      ) : (
        <RolesTable
          rows={roles}
          count={totalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onDeleteRoles={handleDeleteRoles}
          onEditRole={handleEditRole}
        />
      )}

      <RoleForm
        open={showForm}
        onClose={() => {
          setShowForm(false);
          setSelectedRole(undefined);
        }}
        onCreatedOrUpdated={async () => {
          await fetchRoles();
          setShowForm(false);
          setSelectedRole(undefined);
        }}
        role={selectedRole}
      />
    </Stack>
  );
}
