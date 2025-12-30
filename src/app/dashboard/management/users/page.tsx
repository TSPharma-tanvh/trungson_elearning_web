'use client';

import * as React from 'react';
import { SyncDepartmentFromHrmRequest } from '@/domain/models/department/request/sync-department-from-hrm-request';
import { SyncEmployeeFromHrmRequest } from '@/domain/models/employee/request/sync-employee-from-hrm-request';
import { GetUserRequest } from '@/domain/models/user/request/get-user-request';
import { type CreateUsersFromExcelRequest } from '@/domain/models/user/request/import-user-request';
import { UpdateUserInfoRequest } from '@/domain/models/user/request/user-update-request';
import { type UserResponse } from '@/domain/models/user/response/user-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { CircularProgress } from '@mui/material';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { ArrowsClockwise, Download, Upload } from '@phosphor-icons/react';
import { Plus } from '@phosphor-icons/react/dist/ssr/Plus';
import { useTranslation } from 'react-i18next';

import { AddUserDialog } from '@/presentation/components/dashboard/management/users/add-user-dialog';
import { ImportUsersDialog } from '@/presentation/components/dashboard/management/users/import-users-dialog';
import { UsersFilters } from '@/presentation/components/dashboard/management/users/users-filters';
import UsersTable from '@/presentation/components/dashboard/management/users/users-table';

const excelLink = process.env.NEXT_PUBLIC_IMPORT_USER_FORM;

export default function Page(): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();

  const { userUsecase, departmentUsecase, employeeUsecase, settingUsecase } = useDI();
  const [users, setUsers] = React.useState<UserResponse[]>([]);
  const [showForm, setShowForm] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [totalCount, setTotalCount] = React.useState(0);
  const [filters, setFilters] = React.useState<GetUserRequest>(new GetUserRequest({ pageNumber: 1, pageSize: 10 }));
  const [showImportDialog, setShowImportDialog] = React.useState(false);
  const [syncLoading, setSyncLoading] = React.useState(false);

  const fetchUsers = React.useCallback(async () => {
    try {
      const request: GetUserRequest = new GetUserRequest({
        ...filters,
        pageNumber: page + 1,
        pageSize: rowsPerPage,
      });

      const { users: userList, totalRecords } = await userUsecase.getUserListInfo(request);

      setUsers(userList);
      setTotalCount(totalRecords);
    } catch (error) {
      return undefined;
    }
  }, [userUsecase, filters, page, rowsPerPage]);

  React.useEffect(() => {
    void fetchUsers();
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
      await userUsecase.updateUserInfo(userId, data);
      void fetchUsers();
    } catch (error) {
      return undefined;
    }
  };

  const handleDeleteUsers = async (userIds: string[]) => {
    await Promise.all(
      userIds.map((id) => userUsecase.updateUserInfo(id, new UpdateUserInfoRequest({ isActive: false })))
    );
    await fetchUsers();
  };

  const handleImportUsers = async (request: CreateUsersFromExcelRequest) => {
    try {
      await userUsecase.importUsers(request);
      await fetchUsers();
      setShowImportDialog(false);
    } catch (error) {
      return undefined;
    }
  };

  const syncFromHrm = async (request: SyncEmployeeFromHrmRequest) => {
    setSyncLoading(true);
    try {
      const requestDepartment = new SyncDepartmentFromHrmRequest({
        username: request.username,
        password: request.password,
      });
      await departmentUsecase.syncDepartmentFromHrm(requestDepartment);
      await employeeUsecase.syncEmployeeFromHrm(request);
      await settingUsecase.syncEmployeeOrder();
      await fetchUsers();
    } catch (error) {
    } finally {
      setSyncLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ display: 'flex', flex: '1 1 auto' }}>
          <Typography variant="h4" sx={{ color: 'var(--mui-palette-secondary-main)' }}>
            {t('allUsers')}
          </Typography>
          {/* <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button
              color="inherit"
              startIcon={<Upload fontSize="var(--icon-fontSize-md)" />}
              onClick={() => {
                setShowImportDialog(true);
              }}
            >
              {t('importUsers')}
            </Button>
            <Button
              color="inherit"
              startIcon={<Download fontSize="var(--icon-fontSize-md)" />}
              onClick={() => window.open(excelLink, '_blank', 'noopener,noreferrer')}
            >
              {t('downloadExampleFile')}
            </Button>
          </Stack> */}
        </Stack>
        <div>
          <Stack direction="row" spacing={2}>
            <Button
              startIcon={
                syncLoading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <ArrowsClockwise fontSize="var(--icon-fontSize-md)" />
                )
              }
              variant="contained"
              color="success"
              disabled={syncLoading}
              onClick={() => {
                const request = new SyncEmployeeFromHrmRequest({
                  username: '',
                  password: '',
                });
                void syncFromHrm(request);
              }}
              sx={{
                textTransform: 'none',
                minWidth: 160,
                bgcolor: theme.palette.secondary.main,
              }}
            >
              {syncLoading ? t('syncing') : t('syncFromHRM')}
            </Button>

            {/* <Button
              startIcon={<Plus fontSize="var(--icon-fontSize-md)" />}
              variant="contained"
              color="primary"
              onClick={() => {
                setShowForm(true);
              }}
              sx={{
                textTransform: 'none',
                minWidth: 120,
                bgcolor: theme.palette.primary.main,
                '&:hover': {
                  bgcolor: theme.palette.primary.dark,
                },
              }}
            >
              {t('add')}
            </Button> */}
          </Stack>
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
        onClose={() => {
          setShowForm(false);
        }}
        onSubmit={async () => {
          await fetchUsers();
          setShowForm(false);
        }}
      />

      <ImportUsersDialog
        onSubmit={handleImportUsers}
        disabled={false}
        loading={false}
        open={showImportDialog}
        onClose={() => {
          setShowImportDialog(false);
        }}
      />
    </Stack>
  );
}
