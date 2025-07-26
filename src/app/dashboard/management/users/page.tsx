'use client';

import * as React from 'react';
import { GetUserRequest } from '@/domain/models/user/request/get-user-request';
import { UpdateUserInfoRequest } from '@/domain/models/user/request/user-update-request';
import { type UserResponse } from '@/domain/models/user/response/user-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus } from '@phosphor-icons/react/dist/ssr/Plus';

import { AddUserDialog } from '@/presentation/components/dashboard/management/users/add-user-dialog';
import { UsersFilters } from '@/presentation/components/dashboard/management/users/users-filters';
import UsersTable from '@/presentation/components/dashboard/management/users/users-table';

export default function Page(): React.JSX.Element {
  const userUsecase = useDI().userUsecase;
  const [users, setUsers] = React.useState<UserResponse[]>([]);
  const [showForm, setShowForm] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [totalCount, setTotalCount] = React.useState(0);
  const [filters, setFilters] = React.useState<GetUserRequest>(new GetUserRequest({ pageNumber: 1, pageSize: 10 }));

  const fetchUsers = React.useCallback(async () => {
    try {
      const request: GetUserRequest = new GetUserRequest({
        ...filters,
        pageNumber: page + 1,
        pageSize: rowsPerPage,
      });

      const { users, totalRecords, pageSize, pageNumber } = await userUsecase.getUserListInfo(request);

      setUsers(users);
      setTotalCount(totalRecords / pageNumber);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  }, [userUsecase, filters, page, rowsPerPage]);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleFilter = (newFilters: GetUserRequest) => {
    setFilters(new GetUserRequest({ ...newFilters, pageNumber: 1 }));
    setPage(0);
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const handleUpdateUser = async (userId: string, data: UpdateUserInfoRequest) => {
    try {
      const response = await userUsecase.updateUserInfo(userId, data);
      await fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUsers = async (userIds: string[]) => {
    await Promise.all(
      userIds.map((id) => userUsecase.updateUserInfo(id, new UpdateUserInfoRequest({ isActive: false })))
    );
    await fetchUsers();
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ display: 'flex', flex: '1 1 auto' }}>
          <Typography variant="h4" sx={{ color: 'var(--mui-palette-secondary-main)' }}>
            Users
          </Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            {/* <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Import
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Export
            </Button>
            <Button color="inherit" startIcon={<Copy fontSize="var(--icon-fontSize-md)" />}>
              Copy
            </Button> */}
          </Stack>
        </Stack>
        <div>
          <Button
            startIcon={<Plus fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            onClick={() => { setShowForm(true); }}
          >
            Add
          </Button>
        </div>
      </Stack>

      <UsersFilters onFilter={handleFilter} />

      <UsersTable
        count={totalCount}
        page={page}
        rows={users}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onDeleteUsers={handleDeleteUsers}
        onUpdateUser={handleUpdateUser}
      />

      <AddUserDialog
        open={showForm}
        onClose={() => { setShowForm(false); }}
        onSubmit={async () => {
          await fetchUsers();
          setShowForm(false);
        }}
      />
    </Stack>
  );
}
